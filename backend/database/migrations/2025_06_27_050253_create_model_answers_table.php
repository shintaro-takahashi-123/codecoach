<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('model_answers', function (Blueprint $table) {
            $table->bigIncrements('id');                    // 模範解答ID（PK, AUTO_INCREMENT）
            $table->unsignedBigInteger('learning_log_id'); // 学習履歴ID（FK）

            $table->text('answer_text');                    // 模範解答
            $table->text('explanation')->nullable();       // 解説・補足（nullable）

            $table->timestamp('created_at')->useCurrent(); // 作成日時

            // 外部キー制約
            $table->foreign('learning_log_id')
                  ->references('id')->on('learning_logs')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('model_answers');
    }
};
