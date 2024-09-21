<?php

namespace App\Http\Controllers;

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
}
