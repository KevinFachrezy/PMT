<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CalendarDemoSeeder extends Seeder
{
    public function run(): void
    {
        $today = Carbon::today();

        $manager = User::where('role', 'manager')->first();
        $handlers = User::where('role', 'project_handler')->get();

        if (!$manager || $handlers->isEmpty()) {
            return;
        }

        $projectA = Project::updateOrCreate(
            ['title' => 'Calendar Demo - Deadline Sprint A'],
            [
                'description' => 'Project demo kalender dengan milestone dekat deadline.',
                'client_id' => $handlers[0]->id,
                'client_name' => $handlers[0]->name,
                'manager_id' => $manager->id,
                'status' => 'in_progress',
                'start_date' => $today->copy()->subDays(10)->toDateString(),
                'due_date' => $today->copy()->addDays(3)->toDateString(),
            ]
        );

        $projectB = Project::updateOrCreate(
            ['title' => 'Calendar Demo - Deadline Sprint B'],
            [
                'description' => 'Project demo kalender dengan due date minggu depan.',
                'client_id' => $handlers[1]->id,
                'client_name' => $handlers[1]->name,
                'manager_id' => $manager->id,
                'status' => 'pending',
                'start_date' => $today->copy()->subDays(5)->toDateString(),
                'due_date' => $today->copy()->addDays(7)->toDateString(),
            ]
        );

        $projectC = Project::updateOrCreate(
            ['title' => 'Calendar Demo - Overdue Rescue'],
            [
                'description' => 'Project demo kalender yang sudah melewati deadline.',
                'client_id' => $handlers[2]->id,
                'client_name' => $handlers[2]->name,
                'manager_id' => $manager->id,
                'status' => 'in_progress',
                'start_date' => $today->copy()->subDays(20)->toDateString(),
                'due_date' => $today->copy()->subDays(2)->toDateString(),
            ]
        );

        $projectA->handlers()->syncWithoutDetaching([$handlers[0]->id, $handlers[3]->id]);
        $projectB->handlers()->syncWithoutDetaching([$handlers[1]->id]);
        $projectC->handlers()->syncWithoutDetaching([$handlers[2]->id]);

        $tasks = [
            [
                'project_id' => $projectA->id,
                'assigned_to' => $handlers[0]->id,
                'title' => 'Calendar Demo - Final Review Draft',
                'description' => 'Final review dokumen untuk sprint A.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => $today->copy()->addDay()->toDateString(),
            ],
            [
                'project_id' => $projectA->id,
                'assigned_to' => $handlers[3]->id,
                'title' => 'Calendar Demo - Upload Supporting Docs',
                'description' => 'Upload seluruh dokumen pendukung audit.',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => $today->copy()->addDays(2)->toDateString(),
            ],
            [
                'project_id' => $projectB->id,
                'assigned_to' => $handlers[1]->id,
                'title' => 'Calendar Demo - Tax Reconciliation',
                'description' => 'Rekonsiliasi data pajak untuk sprint B.',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => $today->copy()->addDays(4)->toDateString(),
            ],
            [
                'project_id' => $projectC->id,
                'assigned_to' => $handlers[2]->id,
                'title' => 'Calendar Demo - Resolve Overdue Findings',
                'description' => 'Perbaiki temuan yang sudah overdue.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => $today->copy()->subDay()->toDateString(),
            ],
            [
                'project_id' => $projectC->id,
                'assigned_to' => $handlers[2]->id,
                'title' => 'Calendar Demo - Escalation Report',
                'description' => 'Laporan eskalasi untuk task overdue.',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => $today->copy()->addDays(1)->toDateString(),
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::updateOrCreate(
                [
                    'project_id' => $taskData['project_id'],
                    'title' => $taskData['title'],
                ],
                $taskData
            );
        }
    }
}
