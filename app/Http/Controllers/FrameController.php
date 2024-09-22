<?php

namespace App\Http\Controllers;

use Log;
use Carbon\Carbon;
use App\Models\Frame;
use App\Models\Stock;
use App\Models\StockChange;
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
            'species' => 'required|string|max:255',
            'image' => 'nullable|string',
            'quantity' => 'required|integer',
        ]);

        $frameData = $request->only(['brand_id', 'code_id', 'color_id', 'price', 'size','species','image']);
        $frame = Frame::create($frameData);

        $stock = Stock::create([
            'frame_id' => $frame->id,
            'qty' => $request->quantity,
        ]);

        $stock->initial_count = $request->quantity;
        $stock->save();

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
            'species' => 'required|string|max:255',
            'image' => 'nullable|url',
            'quantity' => 'required|integer',
            'branch' => 'required|string|max:255',
        ]);

        $frameData = $request->only(['brand_id', 'code_id', 'color_id', 'price', 'size','species','image']);
        // Handle image upload if a new image is provided
        // if ($request->hasFile('image')) {
        //     // Delete old image if it exists
        //     if ($frame->image) {
        //         $oldImagePath =  base_path('laravel_react_project/public/images/frames/' . $frame->image);
        //         if (file_exists($oldImagePath)) {
        //             unlink($oldImagePath);
        //         }
        //     }
        //     // Store the new image
        //     $imageName = $request->file('image')->getClientOriginalName();
        //     $randomNumber = rand(1000, 9999); 
        //     $fileName = pathinfo($imageName, PATHINFO_FILENAME) . '_' . $randomNumber . '.' . $request->file('image')->getClientOriginalExtension();
        //     $destinationPath = base_path('laravel_react_project/public/images/frames/');
        //     $request->file('image')->move($destinationPath, $fileName);
        //     $frameData['image'] = $fileName;
        // }

        // Update frame data
        $frame->update($frameData);
        // Update stock and stock_changes
        $existingStock = $frame->stocks()->first();

        if ($existingStock) {
            // Calculate the change in quantity and status
            if ($request->quantity > $existingStock->qty) {
                $changeQty = $request->quantity - $existingStock->qty;
                $status = 'plus';
            } elseif ($request->quantity < $existingStock->qty) {
                $changeQty = $existingStock->qty - $request->quantity;
                $status = 'minus';
            } else {
                $changeQty = 0; // No change in stock
            }
    
            // Update the existing stock quantity
            $existingStock->update(['qty' => $request->quantity]);
    
            // Insert a new record in stock_changes table only if changeQty is not 0 or negative
            if ($changeQty > 0) {
                StockChange::create([
                    'stock_id' => $existingStock->id,
                    'frame_id' => $frame->id,
                    'change_date' => now(),
                    'change_qty' => $changeQty,
                    'status' => $status,
                    'branch' => $request->branch,
                ]);
            }
        } else {
            // Create a new stock entry
            $newStock = Stock::create([
                'frame_id' => $frame->id,
                'qty' => $request->quantity,
            ]);
    
            // Add the initial stock change entry only if the quantity is greater than 0
            if ($request->quantity > 0) {
                StockChange::create([
                    'stock_id' => $newStock->id,
                    'frame_id' => $frame->id,
                    'change_date' => now(),
                    'change_qty' => $request->quantity, // The first quantity added
                    'status' => 'plus',
                    'branch' => $request->branch,
                ]);
            }
        }

        return response()->json($frame, 200);
    }

    public function destroy(Frame $frame)
    {
        $frame->delete();

        return response()->json(null, 204);
    }

    public function topFramesByStockReduction(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());
    
        // Ensure dates are formatted correctly
        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();
    
        // Query the stock_changes table for the top 5 frames 
        $topFrames = StockChange::with(['frame.brand', 'frame.code', 'frame.color']) 
            ->select('frame_id')
            ->where('status', 'minus')
            ->whereBetween('change_date', [$startDate, $endDate])
            ->selectRaw('SUM(change_qty) as total_reduction')
            ->groupBy('frame_id')
            ->orderBy('total_reduction', 'desc')
            ->take(5)
            ->get()
            ->map(function ($stockChange) {
                $frame = $stockChange->frame;
                return [
                    'frame_id' => $frame->id,
                    'total_reduction' => $stockChange->total_reduction,
                    'frame' => [
                        'id' => $frame->id,
                        'brand_name' => $frame->brand->brand_name ?? null,
                        'code_name' => $frame->code->code_name ?? null,   
                        'color_name' => $frame->color->color_name ?? null, 
                        'price' => $frame->price,
                        'size' => $frame->size,
                        'species' => $frame->species,
                        'image' => $frame->image,
                        'created_at' => $frame->created_at,
                        'updated_at' => $frame->updated_at,
                    ]
                ];
            });
        return response()->json($topFrames, 200);
    }
}
