<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hints', function (Blueprint $table) {
            $table->bigIncrements('id');                    // ヒントID（PK, AUTO_INCREMENT）
            $table->unsignedBigInteger('learning_log_id'); // 学習履歴ID（FK）

            $table->integer('step');                        // 段階番号
            $table->text('hint_text');                      // ヒント内容

            $table->timestamp('created_at')->useCurrent(); // 作成日時

            // 外部キー制約
            $table->foreign('learning_log_id')
                  ->references('id')->on('learning_logs')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hints');
    }
};
