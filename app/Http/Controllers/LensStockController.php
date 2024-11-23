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
        return response()->json(LensStock::with('frame')->get());
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
            return response()->json(['message' => 'No stock found for this frame.'], 404);
        }
        // Get the lens details including the related code
        $lens = $stock->lens()->with('type')->first();
        // Get all stock changes for this stock
        $stockChanges = LensStockChange::where('lens_stock_id', $stock->id)
            ->orderBy('change_date', 'asc')
            ->get();
        return response()->json([
            'lens' => $lens,  // Include frame details
            'initial_count' => $stock->initial_count,
            'stock_created_at' => $stock->created_at,
            'changes' => $stockChanges,
        ]);
    }
}
