<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Notification;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    private function notifyHandlersAboutProjectAssignment(Project $project, array $handlerIds): void
    {
        $uniqueHandlerIds = collect($handlerIds)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        foreach ($uniqueHandlerIds as $handlerId) {
            Notification::create([
                'user_id' => $handlerId,
                'type' => 'project_assigned',
                'title' => 'New project assigned',
                'message' => 'You have been assigned to project "' . $project->title . '".',
                'data' => [
                    'project_id' => $project->id,
                    'manager_id' => $project->manager_id,
                    'url' => '/projects/' . $project->id,
                ],
            ]);
        }
    }

    private function notifyHandlersAboutProjectUnassignment(Project $project, array $handlerIds): void
    {
        $uniqueHandlerIds = collect($handlerIds)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        foreach ($uniqueHandlerIds as $handlerId) {
            Notification::create([
                'user_id' => $handlerId,
                'type' => 'project_unassigned',
                'title' => 'Project assignment removed',
                'message' => 'You are no longer assigned to project "' . $project->title . '".',
                'data' => [
                    'project_id' => $project->id,
                    'manager_id' => $project->manager_id,
                ],
            ]);
        }
    }

    /**
     * Display a listing of the resource.
     * GET /api/projects
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Project::with(['manager', 'client', 'handlers', 'tasks', 'documents']);

        // Project handlers can only see projects they are involved in
        // Involved means: selected as project handler (client_id) OR assigned to any task in the project
        if ($user->role !== 'manager') {
            $query->where(function ($q) use ($user) {
                $q->where('client_id', $user->id)
                    ->orWhereHas('handlers', function ($handlerQuery) use ($user) {
                        $handlerQuery->where('users.id', $user->id);
                    })
                    ->orWhereHas('tasks', function ($taskQuery) use ($user) {
                        $taskQuery->where('assigned_to', $user->id);
                    });
            });
        }

        // Filter by manager
        if ($request->has('manager_id')) {
            $query->where('manager_id', $request->manager_id);
        }

        // Filter by client
        if ($request->has('client_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('client_id', $request->client_id)
                    ->orWhereHas('handlers', function ($handlerQuery) use ($request) {
                        $handlerQuery->where('users.id', $request->client_id);
                    });
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
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
            $projects = $query->paginate($request->per_page);
        } else {
            $projects = $query->get();
        }

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/projects
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id' => 'nullable|exists:users,id',
            'handler_ids' => 'sometimes|array|min:1',
            'handler_ids.*' => 'required|integer|exists:users,id',
            'client_name' => 'nullable|string|max:255',
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'on_hold'])],
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
        ]);

        $handlerIds = $validated['handler_ids'] ?? null;
        unset($validated['handler_ids']);

        if (isset($handlerIds)) {
            $validHandlerCount = \App\Models\User::whereIn('id', $handlerIds)
                ->where('role', 'project_handler')
                ->count();

            if ($validHandlerCount !== count($handlerIds)) {
                return response()->json([
                    'message' => 'Invalid project handler selection.',
                    'errors' => [
                        'handler_ids' => ['All assigned handlers must have project_handler role.'],
                    ],
                ], 422);
            }

            // Keep existing client_id field for backward compatibility in UI/API.
            $validated['client_id'] = $handlerIds[0];
        }

        // Auto-set manager_id from authenticated user
        $validated['manager_id'] = Auth::id();

        // Create project
        $project = Project::create($validated);

        $assignedHandlerIds = [];

        if (isset($handlerIds)) {
            $project->handlers()->sync($handlerIds);
            $assignedHandlerIds = $handlerIds;
        } elseif (!empty($validated['client_id'])) {
            $project->handlers()->sync([$validated['client_id']]);
            $assignedHandlerIds = [$validated['client_id']];
        }

        $this->notifyHandlersAboutProjectAssignment($project, $assignedHandlerIds);

        // Load relationships
        $project->load(['manager', 'client', 'handlers', 'tasks', 'documents']);

        Activity::log('created', 'Project', $project->id, $project->title,
            'Created project "' . $project->title . '"');

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);
    }

    /**
     * Display the specified resource.
     * GET /api/projects/{id}
     */
    public function show($id)
    {
        $project = Project::with(['manager', 'client', 'handlers', 'tasks.assignedUser', 'documents.uploader'])
            ->findOrFail($id);

        $user = Auth::user();
        if ($user->role !== 'manager') {
            $isInvolved =
                $project->client_id === $user->id ||
                $project->handlers()->where('users.id', $user->id)->exists() ||
                $project->tasks()->where('assigned_to', $user->id)->exists();

            if (!$isInvolved) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You are not involved in this project.',
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $project,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /api/projects/{id}
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $originalStatus = $project->status;

        // Validate request
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'client_id' => 'sometimes|nullable|exists:users,id',
            'handler_ids' => 'sometimes|array|min:1',
            'handler_ids.*' => 'required|integer|exists:users,id',
            'client_name' => 'sometimes|nullable|string|max:255',
            'status' => ['sometimes', 'required', Rule::in(['pending', 'in_progress', 'completed', 'on_hold'])],
            'start_date' => 'sometimes|required|date',
            'due_date' => 'sometimes|required|date|after_or_equal:start_date',
        ]);

        $currentHandlerIds = $project->handlers()->pluck('users.id')->all();
        $handlerIds = $validated['handler_ids'] ?? null;
        unset($validated['handler_ids']);

        if (isset($handlerIds)) {
            $validHandlerCount = \App\Models\User::whereIn('id', $handlerIds)
                ->where('role', 'project_handler')
                ->count();

            if ($validHandlerCount !== count($handlerIds)) {
                return response()->json([
                    'message' => 'Invalid project handler selection.',
                    'errors' => [
                        'handler_ids' => ['All assigned handlers must have project_handler role.'],
                    ],
                ], 422);
            }

            // Keep existing client_id field for backward compatibility in UI/API.
            $validated['client_id'] = $handlerIds[0];
        }

        // Update project
        $project->update($validated);

        $assignedHandlerIds = $currentHandlerIds;

        if (isset($handlerIds)) {
            $project->handlers()->sync($handlerIds);
            $assignedHandlerIds = $handlerIds;
        } elseif (array_key_exists('client_id', $validated) && !empty($validated['client_id'])) {
            $project->handlers()->sync([$validated['client_id']]);
            $assignedHandlerIds = [$validated['client_id']];
        }

        $newlyAssignedHandlerIds = array_values(array_diff($assignedHandlerIds, $currentHandlerIds));
        $this->notifyHandlersAboutProjectAssignment($project, $newlyAssignedHandlerIds);

        $removedHandlerIds = array_values(array_diff($currentHandlerIds, $assignedHandlerIds));
        $this->notifyHandlersAboutProjectUnassignment($project, $removedHandlerIds);

        // Reload relationships
        $project->load(['manager', 'client', 'handlers', 'tasks', 'documents']);

        if (array_key_exists('status', $validated) && $validated['status'] !== $originalStatus) {
            Notification::create([
                'user_id' => $project->manager_id,
                'type' => 'status_changed',
                'title' => 'Project status updated',
                'message' => 'Project "' . $project->title . '" changed from ' . str_replace('_', ' ', $originalStatus) . ' to ' . str_replace('_', ' ', $project->status) . '.',
                'data' => [
                    'project_id' => $project->id,
                    'from' => $originalStatus,
                    'to' => $project->status,
                    'url' => '/projects/' . $project->id,
                ],
            ]);

            Activity::log('status_changed', 'Project', $project->id, $project->title,
                'Changed project status for "' . $project->title . '" from ' . $originalStatus . ' to ' . $project->status,
                ['from' => $originalStatus, 'to' => $project->status]);
        }

        Activity::log('updated', 'Project', $project->id, $project->title,
            'Updated project "' . $project->title . '"', ['fields' => array_keys($validated)]);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project,
        ]);
    }

    /**
     * Allow project handlers to request completion approval from manager.
     * POST /api/projects/{id}/request-completion
     */
    public function requestCompletion($id)
    {
        $project = Project::with('handlers')->findOrFail($id);
        $user = Auth::user();

        if ($user->role !== 'project_handler') {
            return response()->json([
                'success' => false,
                'message' => 'Only project handlers can request project completion.',
            ], 403);
        }

        $isInvolved =
            $project->client_id === $user->id ||
            $project->handlers->contains('id', $user->id) ||
            $project->tasks()->where('assigned_to', $user->id)->exists();

        if (!$isInvolved) {
            return response()->json([
                'success' => false,
                'message' => 'You are not assigned to this project.',
            ], 403);
        }

        if ($project->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Project is already completed.',
            ], 422);
        }

        $alreadyRequested = Notification::where('user_id', $project->manager_id)
            ->where('type', 'project_completion_requested')
            ->where('is_read', false)
            ->where('data->project_id', $project->id)
            ->exists();

        if ($alreadyRequested) {
            return response()->json([
                'success' => true,
                'message' => 'Completion request already sent to manager.',
            ]);
        }

        Notification::create([
            'user_id' => $project->manager_id,
            'type' => 'project_completion_requested',
            'title' => 'Project completion requested',
            'message' => $user->name . ' requested completion review for project "' . $project->title . '".',
            'data' => [
                'project_id' => $project->id,
                'requested_by' => $user->id,
                'requested_by_name' => $user->name,
                'url' => '/projects/' . $project->id,
            ],
        ]);

        Activity::log(
            'completion_requested',
            'Project',
            $project->id,
            $project->title,
            $user->name . ' requested project completion approval.',
            ['requested_by' => $user->id]
        );

        return response()->json([
            'success' => true,
            'message' => 'Completion request sent to manager.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/projects/{id}
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Check authorization (only manager can delete)
        $user = Auth::user();
        if ($user->role !== 'manager' && $project->manager_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only the project manager can delete this project.',
            ], 403);
        }

        $title = $project->title;
        $project->delete();

        Activity::log('deleted', 'Project', null, $title,
            'Deleted project "' . $title . '"');

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);
    }
}
