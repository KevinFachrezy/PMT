<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add folder_name column to documents table
        if (!Schema::hasColumn('documents', 'folder_name')) {
            Schema::table('documents', function (Blueprint $table) {
                $table->string('folder_name')->nullable()->after('project_id');
            });
        }

        // 2. Modify status enum in tasks table using raw SQL
        DB::statement("ALTER TABLE tasks MODIFY COLUMN status ENUM('todo', 'in_progress', 'review', 'completed', 'meeting_offline', 'meeting_online') NOT NULL DEFAULT 'todo'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Remove folder_name column from documents table
        if (Schema::hasColumn('documents', 'folder_name')) {
            Schema::table('documents', function (Blueprint $table) {
                $table->dropColumn('folder_name');
            });
        }

        // 2. Revert status enum in tasks table using raw SQL
        DB::statement("ALTER TABLE tasks MODIFY COLUMN status ENUM('todo', 'in_progress', 'review', 'completed') NOT NULL DEFAULT 'todo'");
    }
};
