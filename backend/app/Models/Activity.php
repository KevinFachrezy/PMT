<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'model_name',
        'description',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Static helper: log an activity ────────────────────────────────────

    /**
     * Log an activity.
     *
     * @param  string  $action      e.g. 'created', 'updated', 'deleted'
     * @param  string  $modelType   e.g. 'Project', 'Task', 'Document'
     * @param  int|null $modelId
     * @param  string  $modelName   Human-readable subject name
     * @param  string  $description Full sentence description
     * @param  array   $properties  Optional extra data
     */
    public static function log(
        string $action,
        string $modelType,
        ?int   $modelId,
        string $modelName,
        string $description,
        array  $properties = []
    ): void {
        try {
            static::create([
                'user_id'     => auth()->id(),
                'action'      => $action,
                'model_type'  => $modelType,
                'model_id'    => $modelId,
                'model_name'  => $modelName,
                'description' => $description,
                'properties'  => empty($properties) ? null : $properties,
            ]);
        } catch (\Throwable $e) {
            // Never let logging break the main request
            \Log::error('Activity log failed: ' . $e->getMessage());
        }
    }
}
