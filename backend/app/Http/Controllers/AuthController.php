<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user); // ← ここでログイン状態にする

        return response()->json([
            'status'  => 'success',
            'data'    => $user,
            'message' => 'Registration completed',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            \Log::warning('ログイン失敗', $credentials);
            return response()->json([
                'status' => 'fail',
                'message' => 'Invalid credentials',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => Auth::user(), // ← 追加
        ]);
    }



    public function user(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Not authenticated'
            ], 401);
        }

        return response()->json([
            'status'  => 'success',
            'data'    => $request->user(),
        ]);
    }

}
