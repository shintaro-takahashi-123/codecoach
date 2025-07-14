<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('type')->nullable();
            $table->string('job_title')->nullable();
            $table->string('location')->nullable(); // ← これを追加
            $table->string('tech')->nullable();      // 技術スタックその1
            $table->string('tech_stack')->nullable(); // 技術スタックその2（複数表記用）
            $table->integer('min_income')->nullable();// 最低年収
            $table->integer('max_income')->nullable(); // 最高年収
            $table->string('job_type')->nullable();
            $table->text('notes')->nullable(); // 推奨理由や補足情報
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('companies');
    }
};
