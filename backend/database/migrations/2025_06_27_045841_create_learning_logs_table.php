<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('learning_logs', function (Blueprint $table) {
            $table->bigIncrements('id');                   // ログID（PK, AUTO_INCREMENT）
            $table->unsignedBigInteger('user_id');         // ユーザーID（FK）

            $table->string('problem_title', 255);          // 問題タイトル
            $table->text('problem_desc')->nullable();      // 問題の説明（nullable）

            // ENUM型はLaravelでは直接対応が難しいので文字列型で代用し、制約はアプリ側で管理する場合が多いです。
            // もしDBレベルで制約を入れたい場合はRaw文を使う方法もありますがここではstringにしています。
            $table->string('status')->default('in_progress');  // ステータス（'in_progress'がデフォルト）

            $table->timestamp('created_at')->useCurrent();    // 作成日時
            $table->timestamp('updated_at')->nullable();      // 更新日時

            // 外部キー制約
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_logs');
    }
};
