<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Email verification token untuk verification link
            $table->string('email_verification_token')->nullable()->unique()->after('email');
            
            // Password reset token untuk reset password link
            $table->string('password_reset_token')->nullable()->unique()->after('password');
            
            // Expires at untuk token expiration (24 jam)
            $table->timestamp('token_expires_at')->nullable()->after('password_reset_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_verification_token', 'password_reset_token', 'token_expires_at']);
        });
    }
};
