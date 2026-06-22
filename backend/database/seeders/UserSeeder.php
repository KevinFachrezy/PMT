<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Manager — Mitra Firma Widianto & Sumbogo
        User::create([
            'name'       => 'Widianto Prasetyo',
            'email'      => 'manager@wspmt.com',
            'password'   => Hash::make('password123'),
            'role'       => 'manager',
            'is_active'  => true,
        ]);

        // Project Handlers — Staf Akuntansi
        User::create([
            'name'       => 'Rina Sumbogo',
            'email'      => 'rina@wspmt.com',
            'password'   => Hash::make('password123'),
            'role'       => 'project_handler',
            'is_active'  => true,
        ]);

        User::create([
            'name'       => 'Agus Haryanto',
            'email'      => 'agus@wspmt.com',
            'password'   => Hash::make('password123'),
            'role'       => 'project_handler',
            'is_active'  => true,
        ]);

        User::create([
            'name'       => 'Dina Kusumawati',
            'email'      => 'dina@wspmt.com',
            'password'   => Hash::make('password123'),
            'role'       => 'project_handler',
            'is_active'  => true,
        ]);

        User::create([
            'name'       => 'Reza Firmansyah',
            'email'      => 'reza@wspmt.com',
            'password'   => Hash::make('password123'),
            'role'       => 'project_handler',
            'is_active'  => true,
        ]);
    }
}
