<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    /**
     * Global search across Projects, Tasks, and Documents.
     * GET /api/search?q={query}&limit={limit}
     */
    public function search(Request $request)
    {
        $q     = trim($request->get('q', ''));
        $limit = (int) $request->get('limit', 5);

        if (strlen($q) < 2) {
            return response()->json([
                'success' => true,
                'data'    => ['projects' => [], 'tasks' => [], 'documents' => []],
                'total'   => 0,
            ]);
        }

        $user    = Auth::user();
        $like    = "%{$q}%";

        // ── Projects ────────────────────────────────────────────
        $projectQuery = Project::with('manager:id,name')
            ->where(function ($query) use ($like) {
                $query->where('title', 'like', $like)
                      ->orWhere('description', 'like', $like);
            });

        // Non-managers only see their own projects
        if ($user->role !== 'manager') {
            $projectQuery->where(function ($q2) use ($user) {
                $q2->where('manager_id', $user->id)
                   ->orWhereHas('tasks', function ($t) use ($user) {
                       $t->where('assigned_to', $user->id);
                   });
            });
        }

        $projects = $projectQuery->limit($limit)->get()->map(function ($p) {
            return [
                'id'          => $p->id,
                'type'        => 'project',
                'title'       => $p->title,
                'description' => $p->description,
                'status'      => $p->status,
                'manager'     => $p->manager?->name,
                'url'         => '/projects/' . $p->id,
            ];
        });

        // ── Tasks ────────────────────────────────────────────────
        $taskQuery = Task::with(['project:id,title', 'assignee:id,name'])
            ->where(function ($query) use ($like) {
                $query->where('title', 'like', $like)
                      ->orWhere('description', 'like', $like);
            });

        if ($user->role !== 'manager') {
            $taskQuery->where('assigned_to', $user->id);
        }

        $tasks = $taskQuery->limit($limit)->get()->map(function ($t) {
            return [
                'id'          => $t->id,
                'type'        => 'task',
                'title'       => $t->title,
                'description' => $t->description,
                'status'      => $t->status,
                'priority'    => $t->priority,
                'project'     => $t->project?->title,
                'project_id'  => $t->project_id,
                'assignee'    => $t->assignee?->name,
                'url'         => '/projects/' . $t->project_id,
            ];
        });

        // ── Documents ────────────────────────────────────────────
        $docQuery = Document::with(['project:id,title', 'uploader:id,name'])
            ->where(function ($query) use ($like) {
                $query->where('title', 'like', $like)
                      ->orWhere('file_name', 'like', $like);
            });

        $documents = $docQuery->limit($limit)->get()->map(function ($d) {
            return [
                'id'        => $d->id,
                'type'      => 'document',
                'title'     => $d->title,
                'file_name' => $d->file_name,
                'file_type' => $d->file_type,
                'project'   => $d->project?->title,
                'uploader'  => $d->uploader?->name,
                'url'       => '/documents',
            ];
        });

        $total = $projects->count() + $tasks->count() + $documents->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'projects'  => $projects,
                'tasks'     => $tasks,
                'documents' => $documents,
            ],
            'total' => $total,
        ]);
    }
}
