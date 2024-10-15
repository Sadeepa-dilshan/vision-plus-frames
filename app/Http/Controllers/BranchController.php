<?php
// app/Http/Controllers/BranchController.php
namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    // GET /api/branches
    public function index()
    {
        // Select only necessary fields for efficiency
        $branches = Branch::select('id', 'name', 'location')->get();

        return response()->json([
            'success' => true,
            'data' => $branches,
        ], 200);
    }

    // GET /api/branches/{id}
    public function show($id)
    {
        // Fetch branch by id with selected fields
        $branch = Branch::select('id', 'name', 'location')
                        ->find($id);

        if (!$branch) {
            return response()->json([
                'success' => false,
                'message' => 'Branch not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $branch,
        ], 200);
    }

    // POST /api/branches
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        // Create branch
        $branch = Branch::create($request->only('name', 'location'));

        return response()->json([
            'success' => true,
            'data' => $branch,
        ], 201);
    }

    // PUT /api/branches/{id}
    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return response()->json([
                'success' => false,
                'message' => 'Branch not found',
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        // Update branch
        $branch->update($request->only('name', 'location'));

        return response()->json([
            'success' => true,
            'data' => $branch,
        ], 200);
    }

    // DELETE /api/branches/{id}
    public function destroy($id)
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return response()->json([
                'success' => false,
                'message' => 'Branch not found',
            ], 404);
        }

        // Delete branch and cascade delete its stock changes
        $branch->delete();

        return response()->json([
            'success' => true,
            'message' => 'Branch deleted successfully',
        ], 200);
    }
}
