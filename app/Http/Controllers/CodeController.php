<?php

namespace App\Http\Controllers;

use App\Models\Code;
use Illuminate\Http\Request;

class CodeController extends Controller
{
    public function index()
    {
        return response()->json(Code::with('brand')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'code_name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
        ]);

        $code = Code::create($request->all());

        return response()->json($code, 201);
    }

    public function show(Code $code)
    {
        return response()->json($code);
    }

    public function update(Request $request, Code $code)
    {
        $request->validate([
            'code_name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
        ]);

        $code->update($request->all());

        return response()->json($code);
    }

    public function destroy(Code $code)
    {
        $code->delete();

        return response()->json(null, 204);
    }
}
