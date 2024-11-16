<?php

namespace App\Http\Controllers;

use App\Models\LensPower;
use Illuminate\Http\Request;

class LensPowersController extends Controller
{
    /**
     * Display a listing of the lens powers.
     */
    public function index(Request $request)
    {
        $query = LensPower::with(['lens:id', 'power:id,name']);
        if ($request->has('lens_id')) {
            $query->where('lens_id', $request->lens_id);
        }
        $lensPowers = $query->select('id', 'lens_id', 'power_id', 'value')->get();
    
        return response()->json($lensPowers, 200);
    }
    

    /**
     * Store a newly created lens power in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'lens_powers' => 'required|array|min:1',
            'lens_powers.*.lens_id' => 'required|exists:lenses,id',
            'lens_powers.*.power_id' => 'required|exists:powers,id',
            'lens_powers.*.value' => 'required|numeric',
        ]);
        $createdLensPowers = [];
        foreach ($request->lens_powers as $powerData) {
            $createdLensPowers[] = LensPower::create([
                'lens_id' => $powerData['lens_id'],
                'power_id' => $powerData['power_id'],
                'value' => $powerData['value'],
            ]);
        }
        return response()->json($createdLensPowers, 201);
    }
    

    /**
     * Display the specified lens power.
     */
    public function show($id)
    {
        $lensPower = LensPower::with(['lens:id', 'power:id,name'])
            ->select('id', 'lens_id', 'power_id', 'value')
            ->findOrFail($id);
    
        return response()->json($lensPower, 200);
    }
    

    /**
     * Update the specified lens power in storage.
     */
    public function updateMultiple(Request $request)
    {
        $request->validate([
            'lens_powers' => 'required|array|min:1',
            'lens_powers.*.id' => 'required|exists:lens_powers,id', // Each entry must have an existing ID
            'lens_powers.*.lens_id' => 'required|exists:lenses,id',
            'lens_powers.*.power_id' => 'required|exists:powers,id',
            'lens_powers.*.value' => 'required|numeric',
        ]);
    
        $updatedLensPowers = [];
        foreach ($request->lens_powers as $powerData) {
            $lensPower = LensPower::findOrFail($powerData['id']);

            $lensPower->update([
                'lens_id' => $powerData['lens_id'],
                'power_id' => $powerData['power_id'],
                'value' => $powerData['value'],
            ]);
            $updatedLensPowers[] = $lensPower->fresh();
        }
        return response()->json($updatedLensPowers, 200);
    }
    
    

    /**
     * Remove the specified lens power from storage.
     */
    public function destroy(LensPower $lensPower)
    {
        $lensPower->delete();

        return response()->json(['message' => 'Lens power deleted successfully'], 200);
    }
}
