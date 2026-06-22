<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Document;
use App\Models\Notification;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Document::with(['project', 'uploader']);

        // Filter by project_id
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by file type
        if ($request->has('file_type')) {
            $query->where('file_type', $request->file_type);
        }

        // Search by title or filename
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $documents = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    /**
     * Store a newly created resource in storage (File Upload).
     */
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,txt'
        ]);

        // Check if user has access to this project
        $project = Project::findOrFail($request->project_id);
        $user = Auth::user();

        if ($user->role !== 'manager' && $project->manager_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to upload documents to this project'
            ], 403);
        }

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('documents', $fileName, 'public');

            // Create document record
            $document = Document::create([
                'project_id' => $request->project_id,
                'title' => $request->title,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'uploaded_by' => $user->id
            ]);

            $document->load(['project', 'uploader']);

            $notifyUserIds = collect([$project->manager_id, $document->uploaded_by])
                ->filter()
                ->unique();

            foreach ($notifyUserIds as $userId) {
                Notification::create([
                    'user_id' => $userId,
                    'type' => 'document_uploaded',
                    'title' => 'Document uploaded',
                    'message' => 'Document "' . $document->title . '" was uploaded to project "' . ($project->title ?? '-') . '".',
                    'data' => [
                        'document_id' => $document->id,
                        'project_id' => $project->id,
                        'url' => '/documents?project_id=' . $project->id . '&highlight_doc=' . $document->id,
                    ],
                ]);
            }

            Activity::log('uploaded', 'Document', $document->id, $document->title,
                'Uploaded document "' . $document->title . '"',
                ['project' => $project->title, 'file' => $document->file_name]);

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => $document
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded'
        ], 400);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $document = Document::with(['project', 'uploader'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $document
        ]);
    }

    /**
     * Preview the specified document (inline, no download).
     */
    public function preview(string $id)
    {
        $document = Document::findOrFail($id);

        $filePath = storage_path('app/public/' . $document->file_path);

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        $mimeType = mime_content_type($filePath);

        return response()->file($filePath, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $document->file_name . '"',
        ]);
    }

    /**
     * Download the specified document.
     */
    public function download(string $id)
    {
        $document = Document::findOrFail($id);

        $filePath = storage_path('app/public/' . $document->file_path);

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        Activity::log('downloaded', 'Document', $document->id, $document->title,
            'Downloaded document "' . $document->title . '"');

        return response()->download($filePath, $document->file_name);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $document = Document::findOrFail($id);
        $user = Auth::user();

        // Only uploader or project manager can delete
        if ($document->uploaded_by !== $user->id && 
            $document->project->manager_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this document'
            ], 403);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $docTitle = $document->title;
        $document->delete();

        Activity::log('deleted', 'Document', null, $docTitle,
            'Deleted document "' . $docTitle . '"');

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }
}
