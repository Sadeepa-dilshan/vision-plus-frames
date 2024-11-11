<?php

namespace App\Http\Controllers;

use App\Models\LensType;
use Illuminate\Http\Request;

class LensTypeController extends Controller
{
    /**
     * Display a listing of the lens types.
     */
    public function index(Request $request)
    {
        $lensTypes = LensType::select('id', 'name', 'description')
            ->paginate(10);

        return response()->json($lensTypes, 200);
    }

    /**
     * Store a newly created lens type in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:lens_types,name|max:255',
            'description' => 'required|string',
        ]);
        $lensType = LensType::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($lensType, 201);
    }

    /**
     * Display the specified lens type.
     */
    public function show(LensType $lensType)
    {
        $lensType = LensType::select('id', 'name', 'description')
            ->where('id', $lensType->id)
            ->firstOrFail();

        return response()->json($lensType, 200);
    }

    /**
     * Update the specified lens type in storage.
     */
    public function update(Request $request, LensType $lensType)
    {
        $request->validate([
            'name' => 'required|string|unique:lens_types,name,' . $lensType->id . '|max:255',
            'description' => 'required|string|max:255',
        ]);
        $lensType->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);
    
        return response()->json($lensType, 200);
    }    

    /**
     * Remove the specified lens type from storage.
     */
    public function destroy(LensType $lensType)
    {
        $lensType->delete();
        return response()->json(['message' => 'Lens type deleted successfully'], 200);
    }
}
