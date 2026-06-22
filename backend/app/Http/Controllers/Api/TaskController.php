<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Notification;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    private function ensureProjectIsEditable(Project $project)
    {
        if ($project->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Tasks in a completed project are locked and cannot be modified.',
            ], 422);
        }

        return null;
    }

    /**
     * Display a listing of the resource.
     * GET /api/tasks
     */
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignedUser']);

        // Filter by project
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by assigned user
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination or all
        if ($request->has('per_page')) {
            $tasks = $query->paginate($request->per_page);
        } else {
            $tasks = $query->get();
        }

        return response()->json([
            'success' => true,
            'data' => $tasks,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/tasks
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:users,id',
            'status' => ['required', Rule::in(['todo', 'in_progress', 'review', 'completed'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'required|date',
        ]);

        $project = Project::findOrFail($validated['project_id']);
        if ($lockedResponse = $this->ensureProjectIsEditable($project)) {
            return $lockedResponse;
        }

        // Create task
        $task = Task::create($validated);

        // Load relationships
        $task->load(['project', 'assignedUser']);

        if (!empty($task->assigned_to)) {
            Notification::create([
                'user_id' => $task->assigned_to,
                'type' => 'task_assigned',
                'title' => 'New task assigned',
                'message' => 'You were assigned to task "' . $task->title . '" in project "' . ($task->project->title ?? '-') . '".',
                'data' => [
                    'task_id' => $task->id,
                    'project_id' => $task->project_id,
                    'url' => '/projects/' . $task->project_id . '?focus_task=' . $task->id,
                ],
            ]);
        }

        Activity::log('created', 'Task', $task->id, $task->title,
            'Created task "' . $task->title . '"',
            ['project' => $task->project->title ?? '']);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task,
        ], 201);
    }

    /**
     * Display the specified resource.
     * GET /api/tasks/{id}
     */
    public function show($id)
    {
        $task = Task::with(['project', 'assignedUser'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /api/tasks/{id}
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $project = $task->project;

        if ($lockedResponse = $this->ensureProjectIsEditable($project)) {
            return $lockedResponse;
        }

        $oldStatus = $task->status;

        // Validate request
        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'sometimes|required|exists:users,id',
            'status' => ['sometimes', 'required', Rule::in(['todo', 'in_progress', 'review', 'completed'])],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'sometimes|required|date',
        ]);

        if (isset($validated['project_id']) && (int) $validated['project_id'] !== (int) $project->id) {
            $targetProject = Project::findOrFail($validated['project_id']);
            if ($lockedResponse = $this->ensureProjectIsEditable($targetProject)) {
                return $lockedResponse;
            }
        }

        // Update task
        $task->update($validated);

        // Reload relationships
        $task->load(['project', 'assignedUser']);

        // Detect status change
        $newStatus = $task->status;
        if ($oldStatus && $oldStatus !== $newStatus) {
            Activity::log('status_changed', 'Task', $task->id, $task->title,
                'Moved task "' . $task->title . '" from ' . $oldStatus . ' to ' . $newStatus,
                ['from' => $oldStatus, 'to' => $newStatus]);
        } else {
            Activity::log('updated', 'Task', $task->id, $task->title,
                'Updated task "' . $task->title . '"',
                ['fields' => array_keys($validated)]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/tasks/{id}
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $project = $task->project;

        if ($lockedResponse = $this->ensureProjectIsEditable($project)) {
            return $lockedResponse;
        }

        // Check authorization
        $user = Auth::user();
        
        if ($user->role !== 'manager' && $project->manager_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only the project manager can delete tasks.',
            ], 403);
        }

        $title = $task->title;
        $task->delete();

        Activity::log('deleted', 'Task', null, $title,
            'Deleted task "' . $title . '"');

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }
}
