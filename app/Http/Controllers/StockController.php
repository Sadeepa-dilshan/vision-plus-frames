<?php

namespace App\Http\Controllers;

use App\Models\Stock;
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
}
