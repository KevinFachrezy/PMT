<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Overall summary: counts + completion rates
     */
    public function summary(Request $request)
    {
        $totalProjects  = Project::count();
        $totalTasks     = Task::count();
        $completedTasks = Task::where('status', 'completed')->count();
        $inProgressTasks = Task::where('status', 'in_progress')->count();
        $todoTasks      = Task::where('status', 'todo')->count();

        $overdueTasks = Task::whereNotNull('due_date')
            ->whereDate('due_date', '<', now())
            ->where('status', '!=', 'completed')
            ->count();

        $activeProjects    = Project::where('status', 'in_progress')->count();
        $completedProjects = Project::where('status', 'completed')->count();

        $completionRate = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100, 1)
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'projects' => [
                    'total'     => $totalProjects,
                    'active'    => $activeProjects,
                    'completed' => $completedProjects,
                    'planning'  => Project::where('status', 'planning')->count(),
                ],
                'tasks' => [
                    'total'       => $totalTasks,
                    'completed'   => $completedTasks,
                    'in_progress' => $inProgressTasks,
                    'todo'        => $todoTasks,
                    'overdue'     => $overdueTasks,
                    'completion_rate' => $completionRate,
                ],
            ],
        ]);
    }

    /**
     * Task breakdown by status – for pie/donut chart
     */
    public function tasksByStatus(Request $request)
    {
        $projectId = $request->query('project_id');

        $query = Task::select('status', DB::raw('count(*) as count'))
            ->groupBy('status');

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $rows = $query->get();

        $map = ['todo' => 0, 'in_progress' => 0, 'completed' => 0];
        foreach ($rows as $row) {
            $map[$row->status] = $row->count;
        }

        $data = [
            ['name' => 'To Do',       'value' => $map['todo'],        'color' => '#EF4444'],
            ['name' => 'In Progress',  'value' => $map['in_progress'], 'color' => '#F59E0B'],
            ['name' => 'Done',         'value' => $map['completed'],   'color' => '#10B981'],
        ];

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Task breakdown by priority – for bar chart
     */
    public function tasksByPriority(Request $request)
    {
        $projectId = $request->query('project_id');

        $query = Task::select('priority', 'status', DB::raw('count(*) as count'))
            ->groupBy('priority', 'status');

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $rows = $query->get();

        $priorities = ['high', 'medium', 'low'];
        $statuses   = ['todo', 'in_progress', 'completed'];

        $map = [];
        foreach ($priorities as $p) {
            $map[$p] = ['priority' => ucfirst($p), 'todo' => 0, 'in_progress' => 0, 'completed' => 0];
        }

        foreach ($rows as $row) {
            if (isset($map[$row->priority])) {
                $map[$row->priority][$row->status] = $row->count;
            }
        }

        return response()->json(['success' => true, 'data' => array_values($map)]);
    }

    /**
     * Workload per user – for bar chart
     */
    public function userWorkload(Request $request)
    {
        $users = User::withCount([
            'assignedTasks',
            'assignedTasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'completed');
            },
            'assignedTasks as in_progress_tasks_count' => function ($q) {
                $q->where('status', 'in_progress');
            },
            'assignedTasks as todo_tasks_count' => function ($q) {
                $q->where('status', 'todo');
            },
        ])->get();

        $data = $users->map(function ($user) {
            $total = $user->assigned_tasks_count;
            return [
                'name'        => $user->name,
                'role'        => $user->role === 'manager' ? 'Manager' : 'Handler',
                'total'       => $total,
                'completed'   => $user->completed_tasks_count,
                'in_progress' => $user->in_progress_tasks_count,
                'todo'        => $user->todo_tasks_count,
                'completion_rate' => $total > 0 ? round(($user->completed_tasks_count / $total) * 100, 1) : 0,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Project progress list – for progress bar table
     */
    public function projectProgress(Request $request)
    {
        $projects = Project::withCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'completed');
            },
        ])->get();

        $data = $projects->map(function ($project) {
            $total = $project->tasks_count;
            return [
                'id'          => $project->id,
                'title'       => $project->title,
                'status'      => $project->status,
                'total_tasks' => $total,
                'completed'   => $project->completed_tasks_count,
                'progress'    => $total > 0 ? round(($project->completed_tasks_count / $total) * 100, 1) : 0,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Tasks created/completed per month (last 6 months) – for line chart
     */
    public function taskTrend(Request $request)
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $months->push(now()->subMonths($i)->format('Y-m'));
        }

        $created = Task::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('count', 'month');

        $completed = Task::select(
                DB::raw("DATE_FORMAT(updated_at, '%Y-%m') as month"),
                DB::raw('count(*) as count')
            )
            ->where('status', 'completed')
            ->where('updated_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('count', 'month');

        $data = $months->map(function ($month) use ($created, $completed) {
            return [
                'month'     => date('M Y', strtotime($month . '-01')),
                'created'   => $created->get($month, 0),
                'completed' => $completed->get($month, 0),
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }
}
