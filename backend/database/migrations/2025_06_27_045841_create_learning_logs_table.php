<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('learning_logs', function (Blueprint $table) {
            $table->bigIncrements('id');// ✅ PRIMARY KEY
            $table->unsignedBigInteger('user_id')->nullable();          // ユーザーIDをnull許容
            $table->text('model_answer')->nullable();                  // 模範解答
            $table->text('explanation')->nullable();                   // 解説
            $table->string('problem_title', 255)->nullable();          // タイトルもnull許容に変更
            $table->text('problem_desc')->nullable();                  // 説明
            $table->string('status')->nullable();                      // ステータス
            $table->timestamps();              // 更新日時（すでにnullable）
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_logs');
    }
};
