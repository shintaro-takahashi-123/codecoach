<?php

namespace App\Http\Controllers;

use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::all(['id', 'name']);
        return response()->json([
            'status' => 'success',
            'data' => $skills
        ]);
    }
}
