<?php

namespace App\Http\Controllers;

use App\Models\Lens;
use App\Models\LensPower;
use App\Models\LensStock;
use Illuminate\Http\Request;

class LensController extends Controller
{
    /**
     * Display a listing of the lenses.
     */
    public function index()
    {
        // Fetch all lenses with related data (type, power, coating)
        $lenses = Lens::with(['type', 'power', 'coating'])->get();
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
            'lens_powers.*.power_id' => 'required|exists:powers,id',
            'lens_powers.*.value' => 'required|numeric|min:0',
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
        $lens->load(['type', 'power', 'coating']);

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
            'lens_powers.*.value' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0', 
        ]);
        $lens->update([
            'type_id' => $request->type_id ?? $lens->type_id,
            'coating_id' => $request->coating_id ?? $lens->coating_id,
            'price' => $request->price ?? $lens->price,
        ]);
        // Delete existing LensPower records for the specified lens and power_ids in the request
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
        $lensStock = $lens->lensStock;
        if ($lensStock) {
            $lensStock->update([
                'initial_count' => $lensStock->initial_count,
                'qty' => $request->quantity,
            ]);
        } else {
            $lensStock = LensStock::create([
                'lens_id' => $lens->id,
                'initial_count' => $request->quantity,
                'qty' => $request->quantity,
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
}
