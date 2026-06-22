<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');          // created, updated, deleted, uploaded, downloaded, etc.
            $table->string('model_type');      // Project, Task, Document, User
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('model_name');      // human-readable name of the subject
            $table->text('description');       // full sentence e.g. "Created project X"
            $table->json('properties')->nullable(); // extra data (old/new values)
            $table->timestamps();

            $table->index(['model_type', 'model_id']);
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
