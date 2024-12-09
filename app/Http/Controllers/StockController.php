<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Brand;
use App\Models\Stock;
use App\Models\StockChange;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        return response()->json(Stock::with('frame')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'frame_id' => 'required|exists:frames,id',
            'qty' => 'required|integer',
        ]);

        $stock = Stock::create($request->all());

        return response()->json($stock, 201);
    }

    public function show(Stock $stock)
    {
        return response()->json($stock);
    }

    public function update(Request $request, Stock $stock)
    {
        $request->validate([
            'frame_id' => 'required|exists:frames,id',
            'qty' => 'required|integer',
        ]);

        $stock->update($request->all());

        return response()->json($stock);
    }

    public function destroy(Stock $stock)
    {
        $stock->delete();

        return response()->json(null, 204);
    }

    public function getStockHistory($frameId)
    {
        // Get the initial stock for the frame
        $stock = Stock::where('frame_id', $frameId)->first();

        if (!$stock) {
            return response()->json(['message' => 'No stock found for this frame.'], 404);
        }

        // Get the frame details including the related code
        $frame = $stock->frame()->with('code')->first();

        // Get all stock changes for this stock
        $stockChanges = StockChange::where('stock_id', $stock->id)
            ->orderBy('change_date', 'asc')
            ->get();

        return response()->json([
            'frame' => $frame,  // Include frame details
            'initial_count' => $stock->initial_count,
            'stock_created_at' => $stock->created_at,
            'changes' => $stockChanges,
        ]);
    }

    //all stocks
    public function allStock()
    {
        $totalQty = Stock::sum('qty');
        return response()->json(['total_stock' => $totalQty], 200);
    }

    //total sold quantity
    public function totalSoldQty(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        $totalQty = StockChange::where('status', 'minus')
            ->whereBetween('change_date', [$startDate, $endDate])
            ->sum('change_qty');

        return response()->json(['total_sold_quantity' => $totalQty], 200);
    }

    public function brandWiseStock()
    {
        $brandWiseStock = Brand::with('frames.stocks')
            ->get()
            ->map(function ($brand) {
                $totalStock = $brand->frames->sum(function ($frame) {
                    return $frame->stocks->sum('qty'); // Sum stock quantities for each frame
                });

                return [
                    'brand_id' => $brand->id,
                    'brand_name' => $brand->brand_name,
                    'total_stock' => $totalStock,
                ];
            });

        return response()->json($brandWiseStock, 200);
    }
}
