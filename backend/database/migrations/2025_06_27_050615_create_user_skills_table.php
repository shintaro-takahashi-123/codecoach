<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_skills', function (Blueprint $table) {
            $table->bigIncrements('id');             // レコードID（PK, AUTO_INCREMENT）
            $table->unsignedBigInteger('user_id');   // ユーザーID（FK）
            $table->unsignedBigInteger('skill_id');  // スキルID（FK）
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])->default('beginner'); // 習得レベル
            $table->timestamp('created_at')->useCurrent(); // 作成日時

            // 外部キー制約
            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');

            $table->foreign('skill_id')
                  ->references('id')->on('skills')
                  ->onDelete('cascade');

            // ユニーク制約（同じユーザーとスキルの組み合わせは1件だけ）
            $table->unique(['user_id', 'skill_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_skills');
    }
};
