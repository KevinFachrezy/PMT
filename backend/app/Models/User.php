<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'email_verification_token',
        'password_reset_token',
        'token_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function managedProjects()
    {
        return $this->hasMany(Project::class, 'manager_id');
    }

    public function handledProjects()
    {
        return $this->belongsToMany(Project::class, 'project_handlers', 'user_id', 'project_id');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function uploadedDocuments()
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Generate unique email verification token
     */
    public function generateEmailVerificationToken()
    {
        $token = bin2hex(random_bytes(32));
        $this->update([
            'email_verification_token' => $token,
            'token_expires_at' => now()->addHours(24),
        ]);
        return $token;
    }

    /**
     * Verify email with token
     */
    public function verifyEmail($token)
    {
        if ($this->email_verification_token !== $token) {
            return false;
        }

        if ($this->token_expires_at && $this->token_expires_at->isPast()) {
            return false;
        }

        $this->update([
            'email_verified_at' => now(),
            'email_verification_token' => null,
            'token_expires_at' => null,
        ]);

        return true;
    }

    /**
     * Generate password reset token
     */
    public function generatePasswordResetToken()
    {
        $token = bin2hex(random_bytes(32));
        $this->update([
            'password_reset_token' => $token,
            'token_expires_at' => now()->addHours(24),
        ]);
        return $token;
    }

    /**
     * Verify and reset password with token
     */
    public function resetPasswordWithToken($token, $newPassword)
    {
        if ($this->password_reset_token !== $token) {
            return false;
        }

        if ($this->token_expires_at && $this->token_expires_at->isPast()) {
            return false;
        }

        $this->update([
            'password' => Hash::make($newPassword),
            'password_reset_token' => null,
            'token_expires_at' => null,
        ]);

        return true;
    }

    /**
     * Check if email is verified
     */
    public function isEmailVerified()
    {
        return $this->email_verified_at !== null;
    }
}
