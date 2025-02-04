<?php

namespace App\Http\Controllers;

use App\Models\Coating;
use Illuminate\Http\Request;

class CoatingController extends Controller
{
    /**
     * Display a listing of the lens coatings.
     */
    public function index()
    {
        $coatings = Coating::select('id', 'name', 'description')->get();
        return response()->json($coatings, 200);
    }

    /**
     * Store a newly created lens coating in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:coatings,name|max:255',
            'description' => 'nullable|string|max:255',
        ]);
        $coating = Coating::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($coating, 201);
    }

    /**
     * Display the specified lens coating.
     */
    public function show($id)
    {
        $coating = Coating::select('id', 'name', 'description')
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($coating, 200);
    }

    /**
     * Update the specified lens coating in storage.
     */
    public function updateCoating(Request $request, Coating $coating)
    {
        $request->validate([
            'name' => 'required|string|unique:coatings,name,' . $coating->id . '|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $coating->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($coating, 200);
    }

    /**
     * Remove the specified Coating coating from storage.
     */
    public function deleteCoating(Coating $coating)
    {
        $coating->delete();
        return response()->json(['message' => 'Coating deleted successfully'], 200);
    }
}
