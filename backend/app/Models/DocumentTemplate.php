<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
        'content',
        'variables',
        'file_extension',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Generate document from template
    public function generate(array $data)
    {
        $content = $this->content;

        // Replace placeholders with actual data
        foreach ($data as $key => $value) {
            $placeholder = '{{' . strtoupper($key) . '}}';
            $content = str_replace($placeholder, $value, $content);
        }

        return $content;
    }

    // Get list of available variables
    public function getAvailableVariables()
    {
        $variables = $this->variables ?? [];
        
        // Add common variables if not already set
        $commonVars = [
            'project_name' => 'Project Name',
            'client_name' => 'Client Name',
            'company_name' => 'Company Name',
            'date' => 'Current Date',
            'manager_name' => 'Manager Name',
            'handler_name' => 'Handler Name',
        ];

        return array_merge($commonVars, $variables);
    }
}
