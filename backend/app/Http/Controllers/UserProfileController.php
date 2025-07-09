<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function show(Request $request)
{
    return response()->json([
        'annual_income' => optional($request->user()->profile)->annual_income,
    ]);
}

}
