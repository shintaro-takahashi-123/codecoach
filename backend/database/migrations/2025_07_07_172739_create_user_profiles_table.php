<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();

            $table->string('annual_income'); // 希望年収
            $table->string('job_type');      // 職種
            $table->json('skills')->nullable(); // スキルとレベル（例: {"React": 3, "AWS": 1}）
            $table->json('gpt_result')->nullable(); // GPTの分析結果（JSON）

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
