<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Notification;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserManagementAndTaskLockTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(array $overrides = []): User
    {
        return User::create(array_merge([
            'name' => 'Test User',
            'email' => 'user' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'role' => 'project_handler',
            'is_active' => true,
        ], $overrides));
    }

    public function test_manager_can_create_user_from_user_management(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager One',
            'email' => 'manager@example.com',
            'role' => 'manager',
        ]);

        Sanctum::actingAs($manager);

        $response = $this->postJson('/api/users', [
            'name' => 'New Handler',
            'email' => 'new-handler@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'project_handler',
            'is_active' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', 'new-handler@example.com');

        $this->assertDatabaseHas('users', [
            'email' => 'new-handler@example.com',
            'role' => 'project_handler',
        ]);
    }

    public function test_project_handler_cannot_create_user_from_user_management(): void
    {
        $handler = $this->makeUser([
            'name' => 'Handler One',
            'email' => 'handler@example.com',
            'role' => 'project_handler',
        ]);

        Sanctum::actingAs($handler);

        $response = $this->postJson('/api/users', [
            'name' => 'Blocked User',
            'email' => 'blocked-user@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'project_handler',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);

        $this->assertDatabaseMissing('users', [
            'email' => 'blocked-user@example.com',
        ]);
    }

    public function test_cannot_update_task_when_project_is_completed(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Two',
            'email' => 'manager-two@example.com',
            'role' => 'manager',
        ]);

        $handler = $this->makeUser([
            'name' => 'Handler Two',
            'email' => 'handler-two@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Locked Project',
            'description' => 'Project for lock test',
            'manager_id' => $manager->id,
            'client_id' => $handler->id,
            'client_name' => 'Test Client',
            'status' => 'in_progress',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(10)->toDateString(),
        ]);

        $task = Task::create([
            'project_id' => $project->id,
            'title' => 'Locked Task',
            'description' => 'Should not be editable after completion',
            'assigned_to' => $handler->id,
            'status' => 'todo',
            'priority' => 'medium',
            'due_date' => now()->addDays(3)->toDateString(),
        ]);

        $project->update(['status' => 'completed']);

        Sanctum::actingAs($manager);

        $response = $this->putJson('/api/tasks/' . $task->id, [
            'status' => 'completed',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'todo',
        ]);
    }

    public function test_creating_task_creates_assignment_notification_with_deeplink(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Three',
            'email' => 'manager-three@example.com',
            'role' => 'manager',
        ]);

        $handler = $this->makeUser([
            'name' => 'Handler Three',
            'email' => 'handler-three@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Notification Project',
            'description' => 'Project for notification deeplink test',
            'manager_id' => $manager->id,
            'client_id' => $handler->id,
            'client_name' => 'Client A',
            'status' => 'in_progress',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(7)->toDateString(),
        ]);

        Sanctum::actingAs($manager);

        $response = $this->postJson('/api/tasks', [
            'project_id' => $project->id,
            'title' => 'Assigned Task',
            'description' => 'Testing notification payload',
            'assigned_to' => $handler->id,
            'status' => 'todo',
            'priority' => 'high',
            'due_date' => now()->addDays(2)->toDateString(),
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);

        $taskId = $response->json('data.id');

        $notification = Notification::where('user_id', $handler->id)
            ->where('type', 'task_assigned')
            ->latest('id')
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals('/projects/' . $project->id . '?focus_task=' . $taskId, $notification->data['url']);
    }

    public function test_project_status_change_creates_notification_with_project_url(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Four',
            'email' => 'manager-four@example.com',
            'role' => 'manager',
        ]);

        $handler = $this->makeUser([
            'name' => 'Handler Four',
            'email' => 'handler-four@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Status Notification Project',
            'description' => 'Project for status notification deeplink test',
            'manager_id' => $manager->id,
            'client_id' => $handler->id,
            'client_name' => 'Client B',
            'status' => 'pending',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(14)->toDateString(),
        ]);

        Sanctum::actingAs($manager);

        $response = $this->putJson('/api/projects/' . $project->id, [
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200)->assertJsonPath('success', true);

        $notification = Notification::where('user_id', $manager->id)
            ->where('type', 'status_changed')
            ->latest('id')
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals('/projects/' . $project->id, $notification->data['url']);
        $this->assertEquals('pending', $notification->data['from']);
        $this->assertEquals('in_progress', $notification->data['to']);
    }

    public function test_project_creation_notifies_assigned_handlers(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Five',
            'email' => 'manager-five@example.com',
            'role' => 'manager',
        ]);

        $handlerOne = $this->makeUser([
            'name' => 'Handler Five A',
            'email' => 'handler-five-a@example.com',
            'role' => 'project_handler',
        ]);

        $handlerTwo = $this->makeUser([
            'name' => 'Handler Five B',
            'email' => 'handler-five-b@example.com',
            'role' => 'project_handler',
        ]);

        Sanctum::actingAs($manager);

        $response = $this->postJson('/api/projects', [
            'title' => 'Assigned Project Notification',
            'description' => 'Project should notify assigned handlers',
            'handler_ids' => [$handlerOne->id, $handlerTwo->id],
            'client_name' => 'Client C',
            'status' => 'pending',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(10)->toDateString(),
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);

        $projectId = $response->json('data.id');

        $this->assertDatabaseHas('notifications', [
            'user_id' => $handlerOne->id,
            'type' => 'project_assigned',
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $handlerTwo->id,
            'type' => 'project_assigned',
        ]);

        $notification = Notification::where('user_id', $handlerOne->id)
            ->where('type', 'project_assigned')
            ->latest('id')
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals('/projects/' . $projectId, $notification->data['url']);
        $this->assertEquals($projectId, $notification->data['project_id']);
    }

    public function test_project_update_only_notifies_newly_added_handlers(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Six',
            'email' => 'manager-six@example.com',
            'role' => 'manager',
        ]);

        $existingHandler = $this->makeUser([
            'name' => 'Handler Six A',
            'email' => 'handler-six-a@example.com',
            'role' => 'project_handler',
        ]);

        $newHandler = $this->makeUser([
            'name' => 'Handler Six B',
            'email' => 'handler-six-b@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Project Update Notification',
            'description' => 'Project for handler update notifications',
            'manager_id' => $manager->id,
            'client_id' => $existingHandler->id,
            'client_name' => 'Client D',
            'status' => 'pending',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(12)->toDateString(),
        ]);

        $project->handlers()->sync([$existingHandler->id]);

        Sanctum::actingAs($manager);

        $response = $this->putJson('/api/projects/' . $project->id, [
            'handler_ids' => [$existingHandler->id, $newHandler->id],
        ]);

        $response->assertStatus(200)->assertJsonPath('success', true);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $newHandler->id,
            'type' => 'project_assigned',
        ]);

        $this->assertDatabaseCount('notifications', 1);

        $notification = Notification::where('user_id', $newHandler->id)
            ->where('type', 'project_assigned')
            ->latest('id')
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals('/projects/' . $project->id, $notification->data['url']);
    }

    public function test_project_update_notifies_removed_handlers(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Seven',
            'email' => 'manager-seven@example.com',
            'role' => 'manager',
        ]);

        $removedHandler = $this->makeUser([
            'name' => 'Handler Seven A',
            'email' => 'handler-seven-a@example.com',
            'role' => 'project_handler',
        ]);

        $remainingHandler = $this->makeUser([
            'name' => 'Handler Seven B',
            'email' => 'handler-seven-b@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Project Removal Notification',
            'description' => 'Project for handler removal notifications',
            'manager_id' => $manager->id,
            'client_id' => $removedHandler->id,
            'client_name' => 'Client E',
            'status' => 'pending',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(12)->toDateString(),
        ]);

        $project->handlers()->sync([$removedHandler->id, $remainingHandler->id]);

        Sanctum::actingAs($manager);

        $response = $this->putJson('/api/projects/' . $project->id, [
            'handler_ids' => [$remainingHandler->id],
        ]);

        $response->assertStatus(200)->assertJsonPath('success', true);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $removedHandler->id,
            'type' => 'project_unassigned',
        ]);

        $notification = Notification::where('user_id', $removedHandler->id)
            ->where('type', 'project_unassigned')
            ->latest('id')
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals($project->id, $notification->data['project_id']);
    }

    public function test_project_handler_can_request_project_completion_and_notify_manager(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Eight',
            'email' => 'manager-eight@example.com',
            'role' => 'manager',
        ]);

        $handler = $this->makeUser([
            'name' => 'Handler Eight',
            'email' => 'handler-eight@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Completion Request Project',
            'description' => 'Project for completion request test',
            'manager_id' => $manager->id,
            'client_id' => $handler->id,
            'client_name' => 'Client F',
            'status' => 'in_progress',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(7)->toDateString(),
        ]);

        $project->handlers()->sync([$handler->id]);

        Sanctum::actingAs($handler);

        $response = $this->postJson('/api/projects/' . $project->id . '/request-completion');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Completion request sent to manager.');

        $notification = Notification::where('user_id', $manager->id)
            ->where('type', 'project_completion_requested')
            ->latest('id')
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals('/projects/' . $project->id, $notification->data['url']);
        $this->assertEquals($handler->id, $notification->data['requested_by']);
    }

    public function test_manager_cannot_request_project_completion(): void
    {
        $manager = $this->makeUser([
            'name' => 'Manager Nine',
            'email' => 'manager-nine@example.com',
            'role' => 'manager',
        ]);

        $handler = $this->makeUser([
            'name' => 'Handler Nine',
            'email' => 'handler-nine@example.com',
            'role' => 'project_handler',
        ]);

        $project = Project::create([
            'title' => 'Manager Cannot Request Completion',
            'description' => 'Project for role authorization test',
            'manager_id' => $manager->id,
            'client_id' => $handler->id,
            'client_name' => 'Client G',
            'status' => 'in_progress',
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(7)->toDateString(),
        ]);

        Sanctum::actingAs($manager);

        $response = $this->postJson('/api/projects/' . $project->id . '/request-completion');

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }
}