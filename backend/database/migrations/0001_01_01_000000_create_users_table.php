<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
             // 主キー：自動インクリメントID（bigint型）
             $table->id();

             // ユーザー名（255文字まで）
             $table->string('name');
 
             // メールアドレス（ユニーク制約付き、255文字まで）
             $table->string('email')->unique();
 
             // メール認証日時（未認証時はnull）
             $table->timestamp('email_verified_at')->nullable();
 
             // パスワード（ハッシュ化された文字列）
             $table->string('password');
 
             // 「次回もログイン状態を維持する」ためのトークン
             $table->rememberToken();
 
             // 作成日時・更新日時（Laravelが自動で管理）
             $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
