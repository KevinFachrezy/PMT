<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $handlers = User::where('role', 'project_handler')->get();
        $projects = Project::all();

        // ── 1. Audit Laporan Keuangan – PT Maju Bersama ─────────────────────
        $p1 = $projects->filter(fn($p) => str_contains($p->title, 'PT Maju Bersama'))->first();

        Task::create([
            'title'       => 'Pengumpulan Dokumen Pendukung Klien',
            'description' => 'Minta dan verifikasi dokumen dari klien: buku besar, mutasi bank, bukti transaksi, dan saldo awal periode.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-02-15',
            'project_id'  => $p1->id,
            'assigned_to' => $handlers[0]->id,
        ]);
        Task::create([
            'title'       => 'Analisis Risiko dan Perencanaan Audit',
            'description' => 'Identifikasi area berisiko tinggi, tentukan materialitas, dan susun program audit.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-02-28',
            'project_id'  => $p1->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Pengujian Substantif Kas dan Bank',
            'description' => 'Rekonsiliasi bank, konfirmasi saldo bank, dan pengujian penerimaan serta pengeluaran kas.',
            'status'      => 'in_progress',
            'priority'    => 'high',
            'due_date'    => '2026-04-10',
            'project_id'  => $p1->id,
            'assigned_to' => $handlers[0]->id,
        ]);
        Task::create([
            'title'       => 'Pengujian Substantif Piutang dan Persediaan',
            'description' => 'Konfirmasi piutang eksternal, stock opname, dan pengujian cut-off transaksi.',
            'status'      => 'in_progress',
            'priority'    => 'high',
            'due_date'    => '2026-04-20',
            'project_id'  => $p1->id,
            'assigned_to' => $handlers[2]->id,
        ]);
        Task::create([
            'title'       => 'Penyusunan Kertas Kerja Audit',
            'description' => 'Dokumentasikan seluruh prosedur audit, temuan, dan kesimpulan dalam kertas kerja standar.',
            'status'      => 'todo',
            'priority'    => 'medium',
            'due_date'    => '2026-05-10',
            'project_id'  => $p1->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Penyusunan dan Review Laporan Audit',
            'description' => 'Susun draf laporan auditor independen, review oleh manajer, dan finalisasi opini.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-05-25',
            'project_id'  => $p1->id,
            'assigned_to' => $handlers[3]->id,
        ]);

        // ── 2. Penyusunan SPT Tahunan – CV Cahaya Niaga ─────────────────────
        $p2 = $projects->filter(fn($p) => str_contains($p->title, 'CV Cahaya Niaga'))->first();

        Task::create([
            'title'       => 'Rekap Penghasilan dan Biaya Tahun 2025',
            'description' => 'Kumpulkan dan rekap seluruh penghasilan bruto dan biaya fiskal yang diperkenankan untuk CV Cahaya Niaga.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-02-10',
            'project_id'  => $p2->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Koreksi Fiskal dan Perhitungan PPh Badan',
            'description' => 'Lakukan koreksi fiskal positif/negatif, hitung PKP, dan kalkulasi PPh Badan terutang.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-03-01',
            'project_id'  => $p2->id,
            'assigned_to' => $handlers[2]->id,
        ]);
        Task::create([
            'title'       => 'Pengisian Formulir SPT 1771',
            'description' => 'Isi formulir SPT Tahunan PPh Badan 1771 beserta lampiran-lampirannya secara lengkap dan benar.',
            'status'      => 'in_progress',
            'priority'    => 'high',
            'due_date'    => '2026-04-15',
            'project_id'  => $p2->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Review Final dan Pelaporan ke KPP',
            'description' => 'Review akhir dokumen SPT oleh manager, tanda tangan klien, dan e-filing ke Kantor Pelayanan Pajak.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-04-28',
            'project_id'  => $p2->id,
            'assigned_to' => $handlers[3]->id,
        ]);

        // ── 3. Konsultasi Restrukturisasi Pajak – PT Sinar Abadi ────────────
        $p3 = $projects->filter(fn($p) => str_contains($p->title, 'PT Sinar Abadi'))->first();

        Task::create([
            'title'       => 'FGD Awal dengan Manajemen PT Sinar Abadi',
            'description' => 'Pertemuan awal untuk memahami rencana restrukturisasi, entitas terlibat, dan timeline yang diinginkan klien.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-05-10',
            'project_id'  => $p3->id,
            'assigned_to' => $handlers[2]->id,
        ]);
        Task::create([
            'title'       => 'Analisis Dampak Pajak Restrukturisasi',
            'description' => 'Analisis konsekuensi PPh atas pengalihan aset, PPn BM, dan potensi pajak daerah dalam skema merger.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-06-15',
            'project_id'  => $p3->id,
            'assigned_to' => $handlers[0]->id,
        ]);
        Task::create([
            'title'       => 'Penyusunan Memo Konsultasi Pajak',
            'description' => 'Buat memo tertulis berisi rekomendasi struktur pajak yang optimal dan risiko yang perlu dimitigasi.',
            'status'      => 'todo',
            'priority'    => 'medium',
            'due_date'    => '2026-07-15',
            'project_id'  => $p3->id,
            'assigned_to' => $handlers[2]->id,
        ]);

        // ── 4. Pembukuan Bulanan – UD Karya Mandiri ──────────────────────────
        $p4 = $projects->filter(fn($p) => str_contains($p->title, 'UD Karya Mandiri'))->first();

        Task::create([
            'title'       => 'Jurnal Transaksi Januari-Maret 2026',
            'description' => 'Input dan verifikasi seluruh jurnal transaksi pembelian, penjualan, dan biaya umum triwulan I.',
            'status'      => 'completed',
            'priority'    => 'medium',
            'due_date'    => '2026-04-05',
            'project_id'  => $p4->id,
            'assigned_to' => $handlers[3]->id,
        ]);
        Task::create([
            'title'       => 'Rekonsiliasi Bank Maret 2026',
            'description' => 'Rekonsiliasi mutasi rekening bank vs catatan pembukuan per 31 Maret 2026.',
            'status'      => 'in_progress',
            'priority'    => 'medium',
            'due_date'    => '2026-04-10',
            'project_id'  => $p4->id,
            'assigned_to' => $handlers[3]->id,
        ]);
        Task::create([
            'title'       => 'Laporan Keuangan Triwulan I 2026',
            'description' => 'Susun neraca saldo, laporan laba rugi, dan arus kas untuk periode Januari-Maret 2026.',
            'status'      => 'todo',
            'priority'    => 'medium',
            'due_date'    => '2026-04-20',
            'project_id'  => $p4->id,
            'assigned_to' => $handlers[0]->id,
        ]);

        // ── 5. Review – Yayasan Pendidikan Harapan (Completed) ──────────────
        $p5 = $projects->filter(fn($p) => str_contains($p->title, 'Yayasan Pendidikan'))->first();

        Task::create([
            'title'       => 'Permintaan dan Penelaahan Dokumen Yayasan',
            'description' => 'Kumpulkan laporan keuangan yayasan, risalah rapat, dan dokumen anggaran.',
            'status'      => 'completed',
            'priority'    => 'medium',
            'due_date'    => '2025-11-20',
            'project_id'  => $p5->id,
            'assigned_to' => $handlers[0]->id,
        ]);
        Task::create([
            'title'       => 'Prosedur Review Analitis',
            'description' => 'Bandingkan laporan keuangan tahun berjalan vs tahun lalu, analisis rasio dan tren.',
            'status'      => 'completed',
            'priority'    => 'medium',
            'due_date'    => '2025-12-15',
            'project_id'  => $p5->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Penerbitan Laporan Review',
            'description' => 'Susun dan terbitkan laporan hasil review disertai simpulan akuntan.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-01-25',
            'project_id'  => $p5->id,
            'assigned_to' => $handlers[2]->id,
        ]);

        // ── 6. Due Diligence – PT Nusantara Logistik ─────────────────────────
        $p6 = $projects->filter(fn($p) => str_contains($p->title, 'PT Nusantara Logistik'))->first();

        Task::create([
            'title'       => 'Perencanaan Ruang Lingkup Due Diligence',
            'description' => 'Tentukan cakupan DD: keuangan, pajak, hukum, dan operasional serta buat data request list.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-06-10',
            'project_id'  => $p6->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Analisis Laporan Keuangan 3 Tahun Terakhir',
            'description' => 'Review dan analisis laporan keuangan PT Nusantara Logistik 2023-2025: kualitas aset, utang, dan profitabilitas.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-07-10',
            'project_id'  => $p6->id,
            'assigned_to' => $handlers[2]->id,
        ]);
        Task::create([
            'title'       => 'Penyusunan Laporan Due Diligence',
            'description' => 'Kompilasi seluruh temuan menjadi laporan DD komprehensif untuk investor.',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-08-10',
            'project_id'  => $p6->id,
            'assigned_to' => $handlers[3]->id,
        ]);

        // ── 7. Transfer Pricing – PT Global Teknindo (On Hold) ───────────────
        $p7 = $projects->filter(fn($p) => str_contains($p->title, 'PT Global Teknindo'))->first();

        Task::create([
            'title'       => 'Identifikasi Transaksi Afiliasi 2025',
            'description' => 'Identifikasi dan klasifikasikan seluruh transaksi dengan pihak berelasi yang wajib didokumentasikan.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-03-20',
            'project_id'  => $p7->id,
            'assigned_to' => $handlers[2]->id,
        ]);
        Task::create([
            'title'       => 'Analisis Comparability dan Pemilihan Metode TP',
            'description' => 'Lakukan analisis keterbandingan dan pilih metode transfer pricing yang paling sesuai (CUP/RPM/CPM).',
            'status'      => 'todo',
            'priority'    => 'high',
            'due_date'    => '2026-06-15',
            'project_id'  => $p7->id,
            'assigned_to' => $handlers[0]->id,
        ]);

        // ── 8. Audit Internal – Koperasi Simpan Pinjam Sejahtera (Completed) ─
        $p8 = $projects->filter(fn($p) => str_contains($p->title, 'Koperasi Simpan Pinjam'))->first();

        Task::create([
            'title'       => 'Audit SPI (Sistem Pengendalian Internal)',
            'description' => 'Evaluasi efektivitas pengendalian internal atas perhimpunan simpanan dan penyaluran pinjaman.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2025-12-20',
            'project_id'  => $p8->id,
            'assigned_to' => $handlers[3]->id,
        ]);
        Task::create([
            'title'       => 'Pengujian Portofolio Pinjaman',
            'description' => 'Uji sampel pinjaman yang disalurkan, verifikasi kelengkapan dokumen, dan kualitas kolektibilitas.',
            'status'      => 'completed',
            'priority'    => 'high',
            'due_date'    => '2026-01-20',
            'project_id'  => $p8->id,
            'assigned_to' => $handlers[1]->id,
        ]);
        Task::create([
            'title'       => 'Penyusunan Laporan Audit Internal',
            'description' => 'Susun laporan audit internal beserta rekomendasi perbaikan kepada pengurus koperasi.',
            'status'      => 'completed',
            'priority'    => 'medium',
            'due_date'    => '2026-02-20',
            'project_id'  => $p8->id,
            'assigned_to' => $handlers[0]->id,
        ]);
    }
}
