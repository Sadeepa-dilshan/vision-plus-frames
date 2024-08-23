<?php

namespace App\Http\Controllers;

use Log;
use App\Models\Frame;
use App\Models\Stock;
use Illuminate\Http\Request;

class FrameController extends Controller
{
    public function index()
    {
        $frames = Frame::with(['stocks', 'brand', 'code', 'color'])->get();

        return response()->json($frames);
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
            'quantity' => 'required|integer',
        ]);

        $frameData = $request->only(['brand_id', 'code_id', 'color_id', 'price', 'size']);
        
        if ($request->hasFile('image')) {
            $imageName = $request->file('image')->getClientOriginalName();
            $destinationPath = base_path('laravel_react_project/public/images/frames');
            $request->file('image')->move($destinationPath, $imageName);
            $frameData['image'] = $imageName;
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
        // Load all related data (brand, code, color, stocks)
        $frame->load(['brand', 'code', 'color', 'stocks']);
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
            'image' => 'nullable|image|max:2048',
            'quantity' => 'required|integer',
        ]);

        $frameData = $request->only(['brand_id', 'code_id', 'color_id', 'price', 'size']);

        // Handle image upload if a new image is provided
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($frame->image) {
                $oldImagePath =  base_path('laravel_react_project/public/images/frames/' . $frame->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            // Store the new image
            $imageName = $request->file('image')->getClientOriginalName();
            $randomNumber = rand(1000, 9999); 
            $fileName = pathinfo($imageName, PATHINFO_FILENAME) . '_' . $randomNumber . '.' . $request->file('image')->getClientOriginalExtension();
            $destinationPath = base_path('laravel_react_project/public/images/frames/');
            $request->file('image')->move($destinationPath, $fileName);
            $frameData['image'] = $fileName;
        }

        // Update frame data
        $frame->update($frameData);

        // Update stock quantity
        if ($frame->stocks()->exists()) {
            $frame->stocks()->update(['qty' => $request->quantity]);
        } else {
            Stock::create([
                'frame_id' => $frame->id,
                'qty' => $request->quantity,
            ]);
        }

        return response()->json($frame, 200);
    }

    public function destroy(Frame $frame)
    {
        $frame->delete();

        return response()->json(null, 204);
    }
}
