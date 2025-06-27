<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->bigIncrements('id');                 // 目標ID（PK, AUTO_INCREMENT）
            $table->unsignedBigInteger('user_id');       // ユーザーID（FK）

            $table->string('job_title', 255);            // 目標職種・タイトル
            $table->integer('target_salary')->nullable(); // 目指す年収（任意）
            $table->string('target_company', 255)->nullable(); // 目指す企業名（任意）

            $table->timestamp('created_at')->useCurrent(); // 作成日時
            $table->timestamp('updated_at')->nullable();   // 更新日時

            // 外部キー制約
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
