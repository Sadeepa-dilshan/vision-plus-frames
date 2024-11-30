<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Lens;
use App\Models\LensPower;
use App\Models\LensStock;
use Illuminate\Http\Request;
use App\Models\LensStockChange;

class LensController extends Controller
{
    /**
     * Display a listing of the lenses.
     */
    public function index()
    {
        $lenses = Lens::with(['type:id,name,description', 'coating:id,name,description', 'powers:id,name', 'lensStock'])->get();
        return response()->json($lenses, 200);
    }
    /**
     * Store a newly created lens in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type_id' => 'required|exists:lens_types,id',
            'coating_id' => 'required|exists:coatings,id',
            'price' => 'required|numeric|min:0',
            'lens_powers' => 'required|array',
            'lens_powers.*.power_id' => 'required',
            'lens_powers.*.value' => 'required|numeric',
            'quantity' => 'required|integer|min:0',
        ]);
        $lens = Lens::create([
            'type_id' => $request->type_id,
            'coating_id' => $request->coating_id,
            'price' => $request->price,
        ]);
        $lensPowers = [];
        foreach ($request->lens_powers as $powerData) {
            $lensPowers[] = LensPower::create([
                'lens_id' => $lens->id,
                'power_id' => $powerData['power_id'],
                'value' => $powerData['value'],
            ]);
        }
        $lensStock = LensStock::create([
            'lens_id' => $lens->id,
            'initial_count' => $request->quantity,
            'qty' => $request->quantity,
        ]);
        return response()->json([
            'lens' => $lens,
            'lens_powers' => $lensPowers,
            'lens_stock' => $lensStock,
        ], 201);
    }

    /**
     * Display the specified lens.
     */
    public function show(Lens $lens)
    {
        // Load related data for the lens
        $lens->load(['type:id,name,description', 'coating:id,name,description', 'powers:id,name', 'lensStock']);
        return response()->json($lens, 200);
    }

    /**
     * Update the specified lens in storage.
     */
    public function update(Request $request, Lens $lens)
    {
        $request->validate([
            'type_id' => 'exists:lens_types,id',
            'coating_id' => 'exists:coatings,id',
            'price' => 'numeric|min:0',
            'lens_powers' => 'required|array',
            'lens_powers.*.power_id' => 'required|exists:powers,id',
            'lens_powers.*.value' => 'required|numeric',
            'quantity' => 'required|integer',
            'branch_id' => 'required|integer', // Validate branch existence
        ]);
        // Update the Lens record
        $lens->update([
            'type_id' => $request->type_id ?? $lens->type_id,
            'coating_id' => $request->coating_id ?? $lens->coating_id,
            'price' => $request->price ?? $lens->price,
        ]);
    
        // Update Lens Powers
        $powerIds = array_column($request->lens_powers, 'power_id');
        LensPower::where('lens_id', $lens->id)
            ->whereIn('power_id', $powerIds)
            ->delete();
    
        $lensPowers = [];
        foreach ($request->lens_powers as $powerData) {
            $lensPowers[] = LensPower::create([
                'lens_id' => $lens->id,
                'power_id' => $powerData['power_id'],
                'value' => $powerData['value'],
            ]);
        }
    
        // Update Lens Stock and Record Stock Changes
        $lensStock = $lens->lensStock;
        if ($lensStock) {
            $changeQty = $request->quantity - $lensStock->qty; // Difference in stock quantity
            $status = $changeQty > 0 ? 'plus' : 'minus';
    
            $lensStock->update([
                'qty' => $request->quantity,
            ]);
    
            // Record a stock change only if there is a change in quantity
            if ($changeQty !== 0) {
                LensStockChange::create([
                    'lens_stock_id' => $lensStock->id,
                    'lens_id' => $lens->id,
                    'branch_id' => $request->branch_id, // Add branch information
                    'status' => $status,
                    'change_date' => now(),
                    'change_qty' => abs($changeQty),
                    'reason' => 'Stock adjustment during lens update',
                    'created_at' => now(),
                ]);
            }
        } else {
            // Create a new stock record
            $lensStock = LensStock::create([
                'lens_id' => $lens->id,
                'initial_count' => $request->quantity,
                'qty' => $request->quantity,
            ]);
    
            // Record the initial stock addition
            LensStockChange::create([
                'lens_stock_id' => $lensStock->id,
                'lens_id' => $lens->id,
                'branch_id' => $request->branch_id, // Add branch information
                'status' => 'plus',
                'change_qty' => $request->quantity,
                'reason' => 'Initial stock added during lens creation',
                'created_at' => now(),
            ]);
        }
    
        return response()->json([
            'lens' => $lens,
            'lens_powers' => $lensPowers,
            'lens_stock' => $lensStock,
        ], 200);
    }
    
    /**
     * Remove the specified lens from storage.
     */
    public function destroy(Lens $lens)
    {
        // Delete the lens
        $lens->delete();
        return response()->json(['message' => 'Lens deleted successfully'], 200);
    }

    //top lens
    public function topLensesByStockReduction(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());
    
        // Ensure dates are formatted correctly
        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();
    
        // Query the stock_changes table for the top 5 Lens
        $topLens = LensStockChange::with(['lens.type', 'lens.lensStock', 'lens.coating','lens.powers'])
            ->select('lens_id')
            ->where('status', 'minus')
            ->whereBetween('change_date', [$startDate, $endDate])
            ->selectRaw('SUM(change_qty) as total_reduction')
            ->groupBy('lens_id')
            ->orderBy('total_reduction', 'desc')
            ->take(5)
            ->get()
            ->map(function ($stockChange) {
                $lens = $stockChange->lens;
                $currentQty = $lens->lensStock ? $lens->lensStock->qty : 0;

                 // Map lens powers
                $lensPowers = $lens->powers->map(function ($power) {
                    return [
                        'power_id' => $power->id,
                        'value' => $power->pivot->value, // Access value from the pivot table
                    ];
                });
    
                return [
                    'lens_id' => $lens->id,
                    'total_reduction' => $stockChange->total_reduction,
                    'current_qty' => $currentQty,
                    'lens' => [
                        'id' => $lens->id,
                        'price' => $lens->price,
                        'type' => $lens->type ? $lens->type->name : null,
                        'coating' => $lens->coating ? $lens->coating->name : null,
                        'stock' => [
                            'initial_count' => $lens->lensStock ? $lens->lensStock->initial_count : 0,
                            'qty' => $currentQty,
                        ],
                        'lens_powers' => $lensPowers,
                    ],
                ];
            });
    
        return response()->json($topLens, 200);
    }
    
}
