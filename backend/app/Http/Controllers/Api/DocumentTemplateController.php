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
     * Generate proposal from docx template
     */
    public function generateProposal(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'folder_name' => 'nullable|string',
            'title' => 'required|string|max:255',
            'tanggal' => 'required|string',
            'nomor_surat' => 'required|string',
            'perihal_proposal' => 'required|string',
            'nama_perusahaan' => 'required|string',
            'alamat_perusahaan' => 'required|string',
            'salutation' => 'required|string',
            'nama_client' => 'required|string',
            'jabatan' => 'required|string',
            'periode_tahun_buku' => 'required|string',
            'nominal_uang' => 'required|string',
            'nominal_dalam_alphabet' => 'required|string',
        ]);

        $templatePath = storage_path('app/templates/Proposal Template - Copy.docx');
        if (!file_exists($templatePath)) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        $fileName = $validated['title'] . '_' . time() . '.docx';
        $filePath = 'documents/' . $fileName;
        $tempPath = tempnam(sys_get_temp_dir(), 'prop_') . '.docx';

        copy($templatePath, $tempPath);

        $zip = new \ZipArchive();
        if ($zip->open($tempPath) === true) {
            $documentXml = $zip->getFromName('word/document.xml');

            $replacements = [
                '&lt;TANGGAL&gt;' => htmlspecialchars($validated['tanggal']),
                '&lt;NOMOR SURAT&gt;' => htmlspecialchars($validated['nomor_surat']),
                '&lt;PERIHAL PROPOSAL&gt;' => htmlspecialchars($validated['perihal_proposal']),
                '&lt;NAMA PERUSAHAAN&gt;' => htmlspecialchars($validated['nama_perusahaan']),
                '&lt;NAMA PERSUSAHAAN&gt;' => htmlspecialchars($validated['nama_perusahaan']), // Typo in template
                '&lt;ALAMAT PERUSAHAAN&gt;' => htmlspecialchars($validated['alamat_perusahaan']),
                '&lt;Bapak/Ibu&gt;' => htmlspecialchars($validated['salutation']),
                '&lt;NAMA CLIENT&gt;' => htmlspecialchars($validated['nama_client']),
                '&lt;JABATAN&gt;' => htmlspecialchars($validated['jabatan']),
                '&lt;PERIODE TAHUN BUKU&gt;' => htmlspecialchars($validated['periode_tahun_buku']),
                '&lt;NOMINAL UANG&gt;' => htmlspecialchars($validated['nominal_uang']),
                '&lt;NOMINAL DALAM ALPHABET&gt;' => htmlspecialchars($validated['nominal_dalam_alphabet']),
            ];

            foreach ($replacements as $search => $replace) {
                $documentXml = str_replace($search, $replace, $documentXml);
            }

            $zip->addFromString('word/document.xml', $documentXml);
            $zip->close();

            $content = file_get_contents($tempPath);
            \Storage::disk('public')->put($filePath, $content);
            @unlink($tempPath);
        } else {
            return response()->json(['success' => false, 'message' => 'Failed to process template'], 500);
        }

        $document = \App\Models\Document::create([
            'project_id' => $validated['project_id'],
            'folder_name' => $validated['folder_name'] ?? 'REPORT',
            'title' => $validated['title'],
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_type' => 'docx',
            'file_size' => \Storage::disk('public')->size($filePath),
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Proposal generated successfully',
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
