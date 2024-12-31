<?php

namespace App\Http\Controllers;

use App\Models\Lens;
use App\Models\LensPower;
use App\Models\LensStock;
use Illuminate\Http\Request;
use App\Models\LensStockChange;

class LensStockController extends Controller
{
    public function index()
    {
        return response()->json(LensStock::with('lens')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'lens_id' => 'required|exists:lenses,id',
            'qty' => 'required|integer',
        ]);

        $stock = LensStock::create($request->all());
        return response()->json($stock, 201);
    }

    public function show(LensStock $stock)
    {
        return response()->json($stock);
    }

    public function update(Request $request, LensStock $stock)
    {
        $request->validate([
            'lens_id' => 'required|exists:lenses,id',
            'qty' => 'required|integer',
        ]);
        $stock->update($request->all());
        return response()->json($stock);
    }

    public function destroy(LensStock $stock)
    {
        $stock->delete();
        return response()->json(null, 204);
    }

    public function getStockHistory($lensId)
    {
        // Get the initial stock for the lens
        $stock = LensStock::where('lens_id', $lensId)->first();
        if (!$stock) {
            return response()->json(['message' => 'No stock found for this lense.'], 404);
        }
        // Get the lens details including the related code
        $lens = $stock->lens()->with('type')->first();
        // Get all stock changes for this stock
        $stockChanges = LensStockChange::where('lens_stock_id', $stock->id)
            ->orderBy('change_date', 'asc')
            ->get();
        return response()->json([
            'lens' => $lens,  // Include lense details
            'initial_count' => $stock->initial_count,
            'stock_created_at' => $stock->created_at,
            'changes' => $stockChanges,
        ]);
    }

    public function setStockLimit(Request $request, $lensStockId)
    {
        $request->validate([
            'limit' => 'required|integer|min:0',
        ]);

        // Find the LensStock by ID
        $lensStock = LensStock::findOrFail($lensStockId);
        $lensStock->update([
            'limit' => $request->limit,
        ]);
        return response()->json([
            'message' => 'Stock limit updated successfully.',
            'lens_stock' => $lensStock,
        ], 200);
    }

    public function getLensStocks(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);
    
        // Query Lens Stocks with optional filters
        $lensStocks = LensStock::query()
            ->when($request->date_from, function ($query) use ($request) {
                $query->whereDate('created_at', '>=', $request->date_from);
            })
            ->when($request->date_to, function ($query) use ($request) {
                $query->whereDate('created_at', '<=', $request->date_to);
            })
            ->with(['lens', 'lens.type', 'lens.coating', 'lens.powers']) 
            ->get()
            ->map(function ($stock) {
                $lens = $stock->lens; // Access lens
                $side = $lens->powers->pluck('pivot.side')->first() ?? 'N/A'; // Retrieve side from pivot
    
                return [
                    'lens_type' => $lens->type->name ?? 'N/A', 
                    'coating' => $lens->coating->name ?? 'N/A',
                    'sph' => $lens->sph ?? 'Plano',
                    'cyl' => $lens->cyl ?? '-', 
                    'r/l' => $side, 
                    'limit' => $stock->limit ?? 0, 
                    'quantity' => $stock->qty, 
                ];
            });
    
        // Return as JSON
        return response()->json($lensStocks);
    }
    
    
}
