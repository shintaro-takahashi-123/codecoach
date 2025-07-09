<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * 新規登録
     */
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

        // 登録後に自動ログイン（セッションベース）
        Auth::login($user);

        return response()->json([
            'status'  => 'success',
            'message' => 'Registration completed',
            'data'    => $user,
        ], 201);
    }

    /**
     * ログイン
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            \Log::warning('ログイン失敗', ['email' => $request->email]);

            return response()->json([
                'status'  => 'fail',
                'message' => 'Invalid credentials',
            ], 401);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Login successful',
            'data'    => Auth::user(),
        ]);
    }

    /**
     * ログイン中のユーザー情報取得
     */
    public function user(Request $request)
    {
        $user = $request->user(); // Sanctum に対応

        if (!$user) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'Not authenticated',
            ], 401);
        }

        return response()->json([
            'status'  => 'success',
            'data'    => $user,
        ]);
    }
}
