<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth; // Authファサードを追記

class AuthController extends Controller
{
    /**
     * 新規ユーザーを登録する
     */
    public function register(Request $request)
    {
        // (registerメソッドの中身は変更なし)
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => 'Registration completed'
        ], 201);
    }

    /**
     * ユーザーを認証し、トークンを発行する (ここから追記)
     */
    public function login(Request $request)
    {
        // 1. バリデーション
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. 認証試行
        if (!Auth::attempt($request->only('email', 'password'))) {
            // 認証失敗
            return response()->json([
                'status' => 'fail',
                'message' => 'Invalid login details'
            ], 401); // 401 Unauthorized
        }

        // 3. ユーザー情報を取得し、トークンを発行
        $user = User::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. JSONレスポンス
        return response()->json([
            'status' => 'success',
            'data' => [
                'token' => $token,
            ],
            'message' => 'Logged-in'
        ]);
    }
}