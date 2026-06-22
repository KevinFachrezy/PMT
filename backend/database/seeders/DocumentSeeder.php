<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\Project;
use App\Models\User;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $manager  = User::where('role', 'manager')->first();
        $handlers = User::where('role', 'project_handler')->get();
        $projects = Project::all();

        $p1 = $projects->filter(fn($p) => str_contains($p->title, 'PT Maju Bersama'))->first();
        $p2 = $projects->filter(fn($p) => str_contains($p->title, 'CV Cahaya Niaga'))->first();
        $p4 = $projects->filter(fn($p) => str_contains($p->title, 'UD Karya Mandiri'))->first();
        $p5 = $projects->filter(fn($p) => str_contains($p->title, 'Yayasan Pendidikan'))->first();
        $p7 = $projects->filter(fn($p) => str_contains($p->title, 'PT Global Teknindo'))->first();
        $p8 = $projects->filter(fn($p) => str_contains($p->title, 'Koperasi Simpan Pinjam'))->first();

        // Audit PT Maju Bersama
        Document::create([
            'title'       => 'Engagement Letter - PT Maju Bersama',
            'file_name'   => 'engagement-letter-maju-bersama.pdf',
            'file_path'   => 'documents/engagement-letter-maju-bersama.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 245760,
            'project_id'  => $p1->id,
            'uploaded_by' => $manager->id,
        ]);
        Document::create([
            'title'       => 'Neraca PT Maju Bersama 2025',
            'file_name'   => 'neraca-maju-bersama-2025.xlsx',
            'file_path'   => 'documents/neraca-maju-bersama-2025.xlsx',
            'file_type'   => 'xlsx',
            'file_size'   => 512000,
            'project_id'  => $p1->id,
            'uploaded_by' => $handlers[0]->id,
        ]);
        Document::create([
            'title'       => 'Program Audit - PT Maju Bersama',
            'file_name'   => 'program-audit-maju-bersama.pdf',
            'file_path'   => 'documents/program-audit-maju-bersama.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 389120,
            'project_id'  => $p1->id,
            'uploaded_by' => $handlers[1]->id,
        ]);

        // SPT CV Cahaya Niaga
        Document::create([
            'title'       => 'Laporan Laba Rugi CV Cahaya Niaga 2025',
            'file_name'   => 'laba-rugi-cahaya-niaga-2025.xlsx',
            'file_path'   => 'documents/laba-rugi-cahaya-niaga-2025.xlsx',
            'file_type'   => 'xlsx',
            'file_size'   => 430080,
            'project_id'  => $p2->id,
            'uploaded_by' => $handlers[1]->id,
        ]);
        Document::create([
            'title'       => 'Bukti Potong PPh 23 - CV Cahaya Niaga',
            'file_name'   => 'bukti-potong-pph23-cahaya-niaga.pdf',
            'file_path'   => 'documents/bukti-potong-pph23-cahaya-niaga.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 204800,
            'project_id'  => $p2->id,
            'uploaded_by' => $handlers[2]->id,
        ]);

        // Pembukuan UD Karya Mandiri
        Document::create([
            'title'       => 'Rekap Transaksi Januari 2026 - UD Karya Mandiri',
            'file_name'   => 'rekap-jan-2026-karya-mandiri.xlsx',
            'file_path'   => 'documents/rekap-jan-2026-karya-mandiri.xlsx',
            'file_type'   => 'xlsx',
            'file_size'   => 327680,
            'project_id'  => $p4->id,
            'uploaded_by' => $handlers[3]->id,
        ]);
        Document::create([
            'title'       => 'Laporan Keuangan Feb 2026 - UD Karya Mandiri',
            'file_name'   => 'lapkeu-feb-2026-karya-mandiri.pdf',
            'file_path'   => 'documents/lapkeu-feb-2026-karya-mandiri.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 614400,
            'project_id'  => $p4->id,
            'uploaded_by' => $handlers[3]->id,
        ]);

        // Review Yayasan Pendidikan Harapan (selesai)
        Document::create([
            'title'       => 'Laporan Review Yayasan Pendidikan Harapan 2025',
            'file_name'   => 'laporan-review-yayasan-harapan-2025.pdf',
            'file_path'   => 'documents/laporan-review-yayasan-harapan-2025.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 819200,
            'project_id'  => $p5->id,
            'uploaded_by' => $manager->id,
        ]);
        Document::create([
            'title'       => 'Kertas Kerja Review - Yayasan Harapan',
            'file_name'   => 'kkr-yayasan-harapan.xlsx',
            'file_path'   => 'documents/kkr-yayasan-harapan.xlsx',
            'file_type'   => 'xlsx',
            'file_size'   => 655360,
            'project_id'  => $p5->id,
            'uploaded_by' => $handlers[2]->id,
        ]);

        // Transfer Pricing PT Global Teknindo
        Document::create([
            'title'       => 'Daftar Transaksi Afiliasi 2025 - PT Global Teknindo',
            'file_name'   => 'transaksi-afiliasi-global-teknindo-2025.xlsx',
            'file_path'   => 'documents/transaksi-afiliasi-global-teknindo-2025.xlsx',
            'file_type'   => 'xlsx',
            'file_size'   => 491520,
            'project_id'  => $p7->id,
            'uploaded_by' => $handlers[2]->id,
        ]);

        // Audit Internal KSP Sejahtera (selesai)
        Document::create([
            'title'       => 'Laporan Audit Internal - KSP Sejahtera 2025',
            'file_name'   => 'laporan-audit-ksp-sejahtera-2025.pdf',
            'file_path'   => 'documents/laporan-audit-ksp-sejahtera-2025.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 921600,
            'project_id'  => $p8->id,
            'uploaded_by' => $manager->id,
        ]);
        Document::create([
            'title'       => 'Temuan dan Rekomendasi - KSP Sejahtera',
            'file_name'   => 'temuan-rekomendasi-ksp-sejahtera.pdf',
            'file_path'   => 'documents/temuan-rekomendasi-ksp-sejahtera.pdf',
            'file_type'   => 'pdf',
            'file_size'   => 368640,
            'project_id'  => $p8->id,
            'uploaded_by' => $handlers[0]->id,
        ]);
    }
}
