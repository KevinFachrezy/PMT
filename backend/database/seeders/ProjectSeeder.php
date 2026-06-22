<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $manager  = User::where('role', 'manager')->first();
        $handlers = User::where('role', 'project_handler')->get();

        // Klien = handler yang menjadi kontak utama klien (disimulasikan sebagai user)
        // Di sini client_id diarahkan ke handler sebagai representasi klien

        Project::create([
            'title'       => 'Audit Laporan Keuangan – PT Maju Bersama 2025',
            'description' => 'Pemeriksaan dan audit laporan keuangan tahunan PT Maju Bersama untuk periode fiskal 2025. Mencakup neraca, laporan laba rugi, dan catatan atas laporan keuangan.',
            'status'      => 'in_progress',
            'start_date'  => '2026-02-01',
            'due_date'    => '2026-05-31',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[0]->id,
        ]);

        Project::create([
            'title'       => 'Penyusunan SPT Tahunan – CV Cahaya Niaga',
            'description' => 'Penyusunan dan pelaporan Surat Pemberitahuan (SPT) Tahunan Pajak Penghasilan Badan CV Cahaya Niaga tahun pajak 2025.',
            'status'      => 'in_progress',
            'start_date'  => '2026-01-15',
            'due_date'    => '2026-04-30',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[1]->id,
        ]);

        Project::create([
            'title'       => 'Konsultasi Restrukturisasi Pajak – PT Sinar Abadi',
            'description' => 'Konsultasi dan perencanaan pajak terkait rencana restrukturisasi bisnis PT Sinar Abadi, termasuk analisis dampak pajak atas merger dan akuisisi aset.',
            'status'      => 'pending',
            'start_date'  => '2026-05-01',
            'due_date'    => '2026-07-31',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[2]->id,
        ]);

        Project::create([
            'title'       => 'Pembukuan Bulanan – UD Karya Mandiri',
            'description' => 'Pengelolaan pembukuan bulanan UD Karya Mandiri meliputi jurnal transaksi, rekonsiliasi bank, dan penyusunan laporan keuangan ringkas setiap bulan.',
            'status'      => 'in_progress',
            'start_date'  => '2026-01-01',
            'due_date'    => '2026-12-31',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[3]->id,
        ]);

        Project::create([
            'title'       => 'Review Laporan Keuangan – Yayasan Pendidikan Harapan',
            'description' => 'Review independen atas laporan keuangan Yayasan Pendidikan Harapan untuk keperluan pelaporan kepada donatur dan badan pengawas.',
            'status'      => 'completed',
            'start_date'  => '2025-11-01',
            'due_date'    => '2026-01-31',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[0]->id,
        ]);

        Project::create([
            'title'       => 'Due Diligence Keuangan – Akuisisi PT Nusantara Logistik',
            'description' => 'Pelaksanaan uji tuntas keuangan (financial due diligence) dalam rangka rencana akuisisi PT Nusantara Logistik oleh investor strategis.',
            'status'      => 'pending',
            'start_date'  => '2026-06-01',
            'due_date'    => '2026-08-15',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[1]->id,
        ]);

        Project::create([
            'title'       => 'Penyusunan Laporan Transfer Pricing – PT Global Teknindo',
            'description' => 'Penyusunan dokumentasi transfer pricing sesuai Peraturan Dirjen Pajak PER-32/PJ/2011 untuk transaksi afiliasi PT Global Teknindo tahun 2025.',
            'status'      => 'on_hold',
            'start_date'  => '2026-03-01',
            'due_date'    => '2026-06-30',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[2]->id,
        ]);

        Project::create([
            'title'       => 'Audit Internal – Koperasi Simpan Pinjam Sejahtera',
            'description' => 'Audit internal atas pengelolaan keuangan dan operasional Koperasi Simpan Pinjam Sejahtera untuk periode Januari–Desember 2025.',
            'status'      => 'completed',
            'start_date'  => '2025-12-01',
            'due_date'    => '2026-02-28',
            'manager_id'  => $manager->id,
            'client_id'   => $handlers[3]->id,
        ]);
    }
}
