<?php

namespace App\Http\Controllers;

use App\Models\UserSkill;
use App\Models\Skill;
use Illuminate\Http\Request;

class UserSkillController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'skill_id' => 'required|exists:skills,id',
            'level' => 'required|in:beginner,intermediate,advanced',
        ]);

        $userSkill = UserSkill::create($validated)->load('skill');

        return response()->json([
            'status' => 'success',
            'data' => $userSkill,
            'message' => 'Skill added'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'level' => 'required|in:beginner,intermediate,advanced',
        ]);

        $userSkill = UserSkill::findOrFail($id);
        $userSkill->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $userSkill->load('skill'),
            'message' => 'Skill updated'
        ]);
    }
}
