<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── projects ────────────────────────────────────────────
        // Queried: WHERE status, ORDER BY created_at
        // (manager_id, client_id already indexed by FK in MySQL)
        Schema::table('projects', function (Blueprint $table) {
            $table->index('status', 'projects_status_idx');
            $table->index('created_at', 'projects_created_at_idx');
        });

        // ── tasks ───────────────────────────────────────────────
        // Queried: WHERE status, WHERE priority, WHERE due_date (overdue)
        //          ORDER BY created_at
        //          Composite (project_id, status) – very common
        //          Composite (assigned_to, status) – handler dashboard
        // (project_id, assigned_to already indexed by FK in MySQL)
        Schema::table('tasks', function (Blueprint $table) {
            $table->index('status',     'tasks_status_idx');
            $table->index('priority',   'tasks_priority_idx');
            $table->index('due_date',   'tasks_due_date_idx');
            $table->index('created_at', 'tasks_created_at_idx');
            $table->index(['project_id', 'status'],   'tasks_project_status_idx');
            $table->index(['assigned_to', 'status'],  'tasks_assigned_status_idx');
        });

        // ── documents ───────────────────────────────────────────
        // Queried: WHERE project_id (FK), WHERE uploaded_by (FK) – already indexed
        // Extra: ORDER BY created_at
        Schema::table('documents', function (Blueprint $table) {
            $table->index('created_at', 'documents_created_at_idx');
        });

        // ── notifications ───────────────────────────────────────
        // Queried: WHERE user_id + is_read, ORDER BY created_at
        // Composite (user_id, is_read) covers both WHERE user_id and WHERE is_read
        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['user_id', 'is_read'], 'notifications_user_read_idx');
            $table->index('created_at',           'notifications_created_at_idx');
        });

        // ── activities ──────────────────────────────────────────
        // Already has: (model_type, model_id), user_id, created_at
        // Extra: WHERE action, WHERE model_type (single), composite (user_id, created_at)
        Schema::table('activities', function (Blueprint $table) {
            $table->index('action',               'activities_action_idx');
            $table->index('model_type',           'activities_model_type_idx');
            $table->index(['user_id', 'created_at'], 'activities_user_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_status_idx');
            $table->dropIndex('projects_created_at_idx');
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_status_idx');
            $table->dropIndex('tasks_priority_idx');
            $table->dropIndex('tasks_due_date_idx');
            $table->dropIndex('tasks_created_at_idx');
            $table->dropIndex('tasks_project_status_idx');
            $table->dropIndex('tasks_assigned_status_idx');
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex('documents_created_at_idx');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_user_read_idx');
            $table->dropIndex('notifications_created_at_idx');
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex('activities_action_idx');
            $table->dropIndex('activities_model_type_idx');
            $table->dropIndex('activities_user_created_idx');
        });
    }
};
