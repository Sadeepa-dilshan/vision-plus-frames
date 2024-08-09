<?php

namespace App\Http\Controllers;

use App\Models\Frame;
use App\Models\Stock;
use Illuminate\Http\Request;

class FrameController extends Controller
{
    public function index()
    {
        return response()->json(Frame::with(['brand', 'code', 'color'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'code_id' => 'required|exists:codes,id',
            'color_id' => 'required|exists:colors,id',
            'price' => 'required|numeric',
            'size' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'quantity' => 'required',
        ]);

        $frameData = $request->only(['brand_id', 'code_id', 'color_id', 'price', 'size']);

        if ($request->hasFile('image')) {
            $frameData['image'] = $request->file('image')->store('frames', 'public');
        }

        $frame = Frame::create($frameData);

        Stock::create([
            'frame_id' => $frame->id,
            'qty' => $request->quantity,
        ]);

        return response()->json($frame, 201);
    }

    public function show(Frame $frame)
    {
        return response()->json($frame);
    }

    public function update(Request $request, Frame $frame)
    {
        $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'code_id' => 'required|exists:codes,id',
            'color_id' => 'required|exists:colors,id',
            'price' => 'required|numeric',
            'size' => 'required|string|max:255',
        ]);

        $frame->update($request->all());

        return response()->json($frame);
    }

    public function destroy(Frame $frame)
    {
        $frame->delete();

        return response()->json(null, 204);
    }
}
