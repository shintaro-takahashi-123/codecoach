<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id'); // ユーザーID（PK, AUTO_INCREMENT）
            $table->string('name', 255); // ユーザー名
            $table->string('email', 255)->unique(); // メールアドレス（ユニーク）
            $table->string('password', 255); // ハッシュ化されたパスワード
            $table->timestamp('created_at')->useCurrent(); // 作成日時（デフォルト現在時刻）
            $table->timestamp('updated_at')->nullable(); // 更新日時（NULL許可）
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
