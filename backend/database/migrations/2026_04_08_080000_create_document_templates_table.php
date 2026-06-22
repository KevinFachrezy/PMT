<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Template name (e.g., "Laporan Keuangan", "Invoice")
            $table->string('category'); // Category: financial, legal, project, general
            $table->text('description')->nullable();
            $table->longText('content'); // Template content with placeholders
            $table->json('variables')->nullable(); // JSON array of available placeholders
            $table->string('file_extension')->default('docx'); // Output file type
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_templates');
    }
};
