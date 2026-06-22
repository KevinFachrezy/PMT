<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * GET /api/activities
     * Supports filters: action, model_type, user_id, search, date_from, date_to
     * Paginated: 30 per page
     */
    public function index(Request $request)
    {
        $query = Activity::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by action (created / updated / deleted / uploaded / downloaded)
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by model type (Project / Task / Document / User)
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Full-text search in description / model_name
        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', $search)
                  ->orWhere('model_name', 'like', $search);
            });
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $activities = $query->paginate(30);

        return response()->json([
            'success' => true,
            'data'    => $activities->items(),
            'meta'    => [
                'current_page' => $activities->currentPage(),
                'last_page'    => $activities->lastPage(),
                'total'        => $activities->total(),
                'per_page'     => $activities->perPage(),
            ],
        ]);
    }

    /**
     * GET /api/activities/stats
     * Counts grouped by action and model_type (for filter badges)
     */
    public function stats()
    {
        $byAction = Activity::selectRaw('action, count(*) as count')
            ->groupBy('action')
            ->pluck('count', 'action');

        $byModel = Activity::selectRaw('model_type, count(*) as count')
            ->groupBy('model_type')
            ->pluck('count', 'model_type');

        return response()->json([
            'success' => true,
            'data'    => [
                'total'    => Activity::count(),
                'by_action' => $byAction,
                'by_model'  => $byModel,
            ],
        ]);
    }
}
