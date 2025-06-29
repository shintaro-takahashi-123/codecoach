<?php

namespace App\Http\Controllers;

use App\Http\Resources\GoalCollection;
use App\Http\Resources\GoalResource;
//use App\Http\Responses\ApiResponse;
use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    //use ApiResponse;

    /** 一覧（ページネーション10件） */
    public function index()
    {
        $goals = Goal::with('user')->paginate(10);
        return new GoalCollection($goals);
    }

    /** 詳細 */
    public function show(Goal $goal)
    {
        return $this->success(new GoalResource($goal->load('user')), 'Goal fetched');
    }

    /** 作成 */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'job_title'      => 'required|string|max:255',
            'target_salary'  => 'required|integer',
            'target_company' => 'nullable|string|max:255',
        ]);

        $goal = Goal::create($data);
        return $this->created(new GoalResource($goal), 'Goal created');
    }

    /** 更新 */
    public function update(Request $request, Goal $goal)
    {
        $data = $request->validate([
            'job_title'      => 'sometimes|required|string|max:255',
            'target_salary'  => 'sometimes|required|integer',
            'target_company' => 'nullable|string|max:255',
        ]);

        $goal->update($data);
        return $this->success(new GoalResource($goal), 'Goal updated');
    }

    /** 削除 */
    public function destroy(Goal $goal)
    {
        $goal->delete();
        return $this->success(null, 'Goal deleted', [], 204);
    }
}
