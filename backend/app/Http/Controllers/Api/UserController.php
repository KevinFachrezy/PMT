<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private function authorizeManager()
    {
        if (auth()->user()?->role !== 'manager') {
            return response()->json([
                'success' => false,
                'message' => 'Only managers can access user management.',
            ], 403);
        }

        return null;
    }

    /**
     * Create user from user management.
     */
    public function store(Request $request)
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:manager,project_handler',
            'is_active' => 'sometimes|boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user,
        ], 201);
    }

    /**
     * Get all users (Manager only)
     */
    public function index(Request $request)
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $query = User::query();

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $users = $query->withCount(['assignedTasks', 'managedProjects', 'uploadedDocuments'])
                       ->orderBy('created_at', 'desc')
                       ->get();

        // Add computed fields
        $users->each(function($user) {
            $completedTasks = $user->assignedTasks()->where('status', 'completed')->count();
            $totalTasks = $user->assignedTasks()->count();
            $user->completion_rate = $totalTasks > 0 
                ? round(($completedTasks / $totalTasks) * 100) 
                : 0;
        });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Get single user
     */
    public function show($id)
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $user = User::withCount(['assignedTasks', 'managedProjects', 'uploadedDocuments'])
                    ->findOrFail($id);

        // Get task statistics
        $completedTasks = $user->assignedTasks()->where('status', 'completed')->count();
        $inProgressTasks = $user->assignedTasks()->where('status', 'in_progress')->count();
        $todoTasks = $user->assignedTasks()->where('status', 'todo')->count();

        $user->task_stats = [
            'completed' => $completedTasks,
            'in_progress' => $inProgressTasks,
            'todo' => $todoTasks,
            'total' => $user->assigned_tasks_count,
            'completion_rate' => $user->assigned_tasks_count > 0 
                ? round(($completedTasks / $user->assigned_tasks_count) * 100) 
                : 0,
        ];

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'role' => 'sometimes|in:manager,project_handler',
            'is_active' => 'sometimes|boolean',
            'password' => 'sometimes|string|min:8',
        ]);

        // Hash password if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user->fresh(),
        ]);
    }

    /**
     * Toggle user active status
     */
    public function toggleActive($id)
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $user = User::findOrFail($id);

        // Prevent deactivating yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot deactivate yourself',
            ], 400);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        return response()->json([
            'success' => true,
            'message' => "User {$status} successfully",
            'data' => $user,
        ]);
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete yourself',
            ], 400);
        }

        // Check if user has active tasks
        $activeTasks = $user->assignedTasks()
                           ->whereIn('status', ['todo', 'in_progress'])
                           ->count();

        if ($activeTasks > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete user with {$activeTasks} active task(s). Reassign tasks first.",
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Get user statistics
     */
    public function statistics()
    {
        if ($unauthorized = $this->authorizeManager()) {
            return $unauthorized;
        }

        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $managers = User::where('role', 'manager')->count();
        $handlers = User::where('role', 'project_handler')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'inactive' => $totalUsers - $activeUsers,
                'managers' => $managers,
                'handlers' => $handlers,
            ],
        ]);
    }
}
