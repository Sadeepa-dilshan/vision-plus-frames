<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function index()
    {
        return response()->json(Color::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'color_name' => 'required|string|max:255',
        ]);

        $color = Color::create($request->all());

        return response()->json($color, 201);
    }

    public function show(Color $color)
    {
        return response()->json($color);
    }

    public function update(Request $request, Color $color)
    {
        $request->validate([
            'color_name' => 'required|string|max:255',
        ]);

        $color->update($request->all());

        return response()->json($color);
    }

    public function destroy(Color $color)
    {
        $color->delete();

        return response()->json(null, 204);
    }
}
