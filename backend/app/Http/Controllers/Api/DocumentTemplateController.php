<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use Illuminate\Http\Request;

class DocumentTemplateController extends Controller
{
    /**
     * Get all templates
     */
    public function index(Request $request)
    {
        $query = DocumentTemplate::query();

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Only active templates by default
        if (!$request->has('include_inactive')) {
            $query->where('is_active', true);
        }

        $templates = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * Get single template
     */
    public function show($id)
    {
        $template = DocumentTemplate::with('creator')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $template,
        ]);
    }

    /**
     * Create new template (Manager only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:financial,legal,project,general',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'variables' => 'nullable|array',
            'file_extension' => 'nullable|string|in:docx,pdf,txt',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['created_by'] = $request->user()->id;

        $template = DocumentTemplate::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Template created successfully',
            'data' => $template,
        ], 201);
    }

    /**
     * Update template
     */
    public function update(Request $request, $id)
    {
        $template = DocumentTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:financial,legal,project,general',
            'description' => 'nullable|string',
            'content' => 'sometimes|string',
            'variables' => 'nullable|array',
            'file_extension' => 'nullable|string|in:docx,pdf,txt',
            'is_active' => 'nullable|boolean',
        ]);

        $template->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Template updated successfully',
            'data' => $template,
        ]);
    }

    /**
     * Delete template
     */
    public function destroy($id)
    {
        $template = DocumentTemplate::findOrFail($id);
        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'Template deleted successfully',
        ]);
    }

    /**
     * Generate document from template
     */
    public function generate(Request $request, $id)
    {
        $template = DocumentTemplate::findOrFail($id);

        $validated = $request->validate([
            'data' => 'required|array',
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
        ]);

        // Generate content from template
        $content = $template->generate($validated['data']);

        // Create document file
        $fileName = $validated['title'] . '_' . time() . '.' . $template->file_extension;
        $filePath = 'documents/' . $fileName;

        // Save to storage
        \Storage::disk('public')->put($filePath, $content);

        // Create document record
        $document = \App\Models\Document::create([
            'project_id' => $validated['project_id'],
            'title' => $validated['title'],
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_type' => $template->file_extension,
            'file_size' => strlen($content),
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document generated successfully',
            'data' => $document,
        ], 201);
    }

    /**
     * Get template categories
     */
    public function categories()
    {
        $categories = [
            ['value' => 'financial', 'label' => 'Financial Reports'],
            ['value' => 'legal', 'label' => 'Legal Documents'],
            ['value' => 'project', 'label' => 'Project Documents'],
            ['value' => 'general', 'label' => 'General Documents'],
        ];

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
