<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'job_title'       => 'required|string|max:255',
            'target_salary'   => 'required|integer|min:0',
            'target_company'  => 'nullable|string|max:255',
        ]);

        $goal = Goal::create([
            'user_id'         => $request->user()->id,
            'job_title'       => $request->job_title,
            'target_salary'   => $request->target_salary,
            'target_company'  => $request->target_company,
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $goal,
            'message' => 'Goal created',
        ], 201);
    }

    public function index(Request $request)
    {
        $goals = Goal::where('user_id', $request->user()->id)
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data'   => $goals->items(),
            'meta'   => [
                'current_page' => $goals->currentPage(),
                'per_page'     => $goals->perPage(),
                'total'        => $goals->total(),
                'last_page'    => $goals->lastPage(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $goal = Goal::where('user_id', $request->user()->id)->find($id);

        if (!$goal) {
            return response()->json([
                'status' => 'fail',
                'errors' => [['field' => 'id', 'message' => 'Goal not found or access denied']],
            ], 404);
        }

        $request->validate([
            'job_title'       => 'required|string|max:255',
            'target_salary'   => 'required|integer|min:0',
            'target_company'  => 'nullable|string|max:255',
        ]);

        $goal->update($request->only(['job_title', 'target_salary', 'target_company']));

        return response()->json([
            'status' => 'success',
            'data'   => $goal,
            'message' => 'Goal updated',
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $goal = Goal::where('user_id', $request->user()->id)->find($id);

        if (!$goal) {
            return response()->json([
                'status' => 'fail',
                'errors' => [['field' => 'id', 'message' => 'Goal not found or access denied']],
            ], 404);
        }

        $goal->delete();

        return response()->json(null, 204);
    }
}
