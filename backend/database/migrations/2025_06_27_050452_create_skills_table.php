<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->bigIncrements('id');               // スキルID（PK, AUTO_INCREMENT）
            $table->string('name', 255)->unique();    // スキル名（ユニーク）
            $table->text('description')->nullable();  // スキル説明（nullable）
            $table->timestamp('created_at')->useCurrent(); // 作成日時
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
