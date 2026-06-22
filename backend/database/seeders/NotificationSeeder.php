<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Task;
use App\Models\Project;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $handlers = User::where('role', 'project_handler')->get();
        $tasks    = Task::with('project')->get();
        $projects = Project::all();

        if ($handlers->isEmpty() || $tasks->isEmpty()) {
            return;
        }

        // Rina Sumbogo
        $rina = $handlers[0];
        $rinaTask = $tasks->where('assigned_to', $rina->id)->where('status', 'in_progress')->first()
                 ?? $tasks->where('assigned_to', $rina->id)->first();

        Notification::create([
            'user_id' => $rina->id,
            'type'    => 'task_assigned',
            'title'   => 'Tugas Baru Ditetapkan',
            'message' => 'Anda ditugaskan untuk: ' . ($rinaTask->title ?? 'Pengujian Substantif Kas dan Bank'),
            'data'    => ['task_id' => $rinaTask->id ?? null, 'project_id' => $rinaTask->project_id ?? null],
            'is_read' => false,
        ]);
        Notification::create([
            'user_id' => $rina->id,
            'type'    => 'deadline_approaching',
            'title'   => 'Tenggat Waktu Mendekat',
            'message' => "Tugas '{$rinaTask->title}' jatuh tempo pada " . ($rinaTask->due_date ?? '-'),
            'data'    => ['task_id' => $rinaTask->id ?? null, 'due_date' => $rinaTask->due_date ?? null],
            'is_read' => false,
        ]);
        Notification::create([
            'user_id'  => $rina->id,
            'type'     => 'document_uploaded',
            'title'    => 'Dokumen Baru Diunggah',
            'message'  => 'Dokumen baru telah diunggah ke proyek Audit PT Maju Bersama 2025',
            'data'     => ['project_id' => $projects->filter(fn($p) => str_contains($p->title, 'PT Maju Bersama'))->first()->id ?? null],
            'is_read'  => true,
            'read_at'  => now()->subHours(3),
        ]);

        // Agus Haryanto
        $agus = $handlers[1];
        $agusTask = $tasks->where('assigned_to', $agus->id)->where('status', 'in_progress')->first()
                 ?? $tasks->where('assigned_to', $agus->id)->first();

        Notification::create([
            'user_id' => $agus->id,
            'type'    => 'task_assigned',
            'title'   => 'Tugas Baru Ditetapkan',
            'message' => 'Anda ditugaskan untuk: ' . ($agusTask->title ?? 'Analisis Risiko dan Perencanaan Audit'),
            'data'    => ['task_id' => $agusTask->id ?? null],
            'is_read' => false,
        ]);
        Notification::create([
            'user_id'  => $agus->id,
            'type'     => 'status_changed',
            'title'    => 'Status Tugas Diperbarui',
            'message'  => 'Status tugas "Pengisian Formulir SPT 1771" diubah menjadi In Progress',
            'data'     => ['old_status' => 'todo', 'new_status' => 'in_progress'],
            'is_read'  => true,
            'read_at'  => now()->subHours(5),
        ]);

        // Dina Kusumawati
        $dina = $handlers[2];
        $dinaTask = $tasks->where('assigned_to', $dina->id)->where('status', 'in_progress')->first()
                 ?? $tasks->where('assigned_to', $dina->id)->first();

        Notification::create([
            'user_id' => $dina->id,
            'type'    => 'task_assigned',
            'title'   => 'Tugas Baru Ditetapkan',
            'message' => 'Anda ditugaskan untuk: ' . ($dinaTask->title ?? 'Pengujian Substantif Piutang dan Persediaan'),
            'data'    => ['task_id' => $dinaTask->id ?? null],
            'is_read' => false,
        ]);
        Notification::create([
            'user_id'  => $dina->id,
            'type'     => 'deadline_approaching',
            'title'    => 'Tenggat Waktu Mendekat',
            'message'  => 'Pengujian Substantif Piutang harus selesai sebelum 20 April 2026',
            'data'     => ['due_date' => '2026-04-20'],
            'is_read'  => false,
        ]);

        // Reza Firmansyah
        $reza = $handlers[3];
        $rezaTask = $tasks->where('assigned_to', $reza->id)->where('status', 'todo')->first()
                 ?? $tasks->where('assigned_to', $reza->id)->first();

        Notification::create([
            'user_id' => $reza->id,
            'type'    => 'task_assigned',
            'title'   => 'Tugas Baru Ditetapkan',
            'message' => 'Anda ditugaskan untuk: ' . ($rezaTask->title ?? 'Penyusunan dan Review Laporan Audit'),
            'data'    => ['task_id' => $rezaTask->id ?? null],
            'is_read' => false,
        ]);
        Notification::create([
            'user_id'  => $reza->id,
            'type'     => 'document_uploaded',
            'title'    => 'Dokumen Baru Diunggah',
            'message'  => 'Dokumen "Laporan Keuangan Feb 2026" diunggah ke UD Karya Mandiri',
            'data'     => ['project_id' => $projects->filter(fn($p) => str_contains($p->title, 'UD Karya Mandiri'))->first()->id ?? null],
            'is_read'  => true,
            'read_at'  => now()->subDay(),
        ]);
    }
}
