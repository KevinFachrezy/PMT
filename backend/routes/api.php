<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DocumentTemplateController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Email verification and password reset routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/verify-email', [UserController::class, 'verifyEmail']);
    Route::post('/request-password-reset', [UserController::class, 'requestPasswordReset']);
    Route::post('/reset-password', [UserController::class, 'resetPassword']);
    Route::post('/resend-verification-email', [UserController::class, 'resendVerificationEmail']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });

    // Project routes
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{id}/request-completion', [ProjectController::class, 'requestCompletion']);

    // Task routes
    Route::apiResource('tasks', TaskController::class);

    // Document routes
    Route::apiResource('documents', DocumentController::class);
    Route::get('documents/{id}/download', [DocumentController::class, 'download']);
    Route::get('documents/{id}/preview', [DocumentController::class, 'preview']);

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::post('/', [NotificationController::class, 'store']); // For testing
    });

    // Document Template routes
    Route::prefix('templates')->group(function () {
        Route::get('/', [DocumentTemplateController::class, 'index']);
        Route::get('/categories', [DocumentTemplateController::class, 'categories']);
        Route::get('/{id}', [DocumentTemplateController::class, 'show']);
        Route::post('/', [DocumentTemplateController::class, 'store']);
        Route::put('/{id}', [DocumentTemplateController::class, 'update']);
        Route::delete('/{id}', [DocumentTemplateController::class, 'destroy']);
        Route::post('/{id}/generate', [DocumentTemplateController::class, 'generate']);
    });

    // User Management routes (Manager only)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/statistics', [UserController::class, 'statistics']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::post('/{id}/toggle-active', [UserController::class, 'toggleActive']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // Analytics routes
    Route::prefix('analytics')->group(function () {
        Route::get('/summary', [AnalyticsController::class, 'summary']);
        Route::get('/tasks-by-status', [AnalyticsController::class, 'tasksByStatus']);
        Route::get('/tasks-by-priority', [AnalyticsController::class, 'tasksByPriority']);
        Route::get('/user-workload', [AnalyticsController::class, 'userWorkload']);
        Route::get('/project-progress', [AnalyticsController::class, 'projectProgress']);
        Route::get('/task-trend', [AnalyticsController::class, 'taskTrend']);
    });

    // Activity Log routes
    Route::prefix('activities')->group(function () {
        Route::get('/', [ActivityController::class, 'index']);
        Route::get('/stats', [ActivityController::class, 'stats']);
    });

    // Global Search
    Route::get('/search', [SearchController::class, 'search']);
});
