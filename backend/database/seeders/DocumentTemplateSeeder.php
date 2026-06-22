<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentTemplate;
use App\Models\User;

class DocumentTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $manager = User::where('role', 'manager')->first();

        // 1. Laporan Keuangan Template
        DocumentTemplate::create([
            'name' => 'Laporan Keuangan Bulanan',
            'category' => 'financial',
            'description' => 'Template untuk laporan keuangan bulanan klien',
            'content' => "LAPORAN KEUANGAN BULANAN\n\n" .
                        "Nama Klien: {{CLIENT_NAME}}\n" .
                        "Periode: {{PERIOD}}\n" .
                        "Tanggal: {{DATE}}\n\n" .
                        "=== RINGKASAN KEUANGAN ===\n\n" .
                        "Total Pendapatan: {{TOTAL_INCOME}}\n" .
                        "Total Pengeluaran: {{TOTAL_EXPENSES}}\n" .
                        "Laba/Rugi Bersih: {{NET_PROFIT}}\n\n" .
                        "=== CATATAN ===\n" .
                        "{{NOTES}}\n\n" .
                        "Disiapkan oleh: {{MANAGER_NAME}}\n" .
                        "Widianto & Sumbogo\n" .
                        "Firma Akuntansi",
            'variables' => [
                'client_name' => 'Nama Klien',
                'period' => 'Periode Laporan',
                'date' => 'Tanggal Laporan',
                'total_income' => 'Total Pendapatan',
                'total_expenses' => 'Total Pengeluaran',
                'net_profit' => 'Laba/Rugi Bersih',
                'notes' => 'Catatan Tambahan',
                'manager_name' => 'Nama Manager',
            ],
            'file_extension' => 'txt',
            'is_active' => true,
            'created_by' => $manager->id,
        ]);

        // 2. Invoice Template
        DocumentTemplate::create([
            'name' => 'Invoice/Faktur',
            'category' => 'financial',
            'description' => 'Template invoice untuk tagihan jasa akuntansi',
            'content' => "INVOICE\n\n" .
                        "WIDIANTO & SUMBOGO\n" .
                        "Firma Akuntansi\n\n" .
                        "Invoice No: {{INVOICE_NUMBER}}\n" .
                        "Tanggal: {{DATE}}\n\n" .
                        "Kepada:\n" .
                        "{{CLIENT_NAME}}\n" .
                        "{{CLIENT_ADDRESS}}\n\n" .
                        "=== DETAIL LAYANAN ===\n\n" .
                        "Project: {{PROJECT_NAME}}\n" .
                        "Deskripsi: {{SERVICE_DESCRIPTION}}\n" .
                        "Periode: {{PERIOD}}\n\n" .
                        "Subtotal: {{SUBTOTAL}}\n" .
                        "PPN 11%: {{TAX}}\n" .
                        "Total: {{TOTAL}}\n\n" .
                        "Pembayaran harap ditransfer ke:\n" .
                        "Bank: BCA\n" .
                        "No. Rek: 1234567890\n" .
                        "A/N: Widianto & Sumbogo\n\n" .
                        "Terima kasih atas kepercayaan Anda.",
            'variables' => [
                'invoice_number' => 'Nomor Invoice',
                'date' => 'Tanggal Invoice',
                'client_name' => 'Nama Klien',
                'client_address' => 'Alamat Klien',
                'project_name' => 'Nama Proyek',
                'service_description' => 'Deskripsi Layanan',
                'period' => 'Periode Layanan',
                'subtotal' => 'Subtotal',
                'tax' => 'Pajak',
                'total' => 'Total',
            ],
            'file_extension' => 'txt',
            'is_active' => true,
            'created_by' => $manager->id,
        ]);

        // 3. Surat Tugas Template
        DocumentTemplate::create([
            'name' => 'Surat Tugas',
            'category' => 'legal',
            'description' => 'Template surat tugas untuk staff',
            'content' => "SURAT TUGAS\n\n" .
                        "WIDIANTO & SUMBOGO\n" .
                        "Firma Akuntansi\n\n" .
                        "Nomor: {{LETTER_NUMBER}}\n" .
                        "Tanggal: {{DATE}}\n\n" .
                        "Yang bertanda tangan di bawah ini:\n\n" .
                        "Nama: {{MANAGER_NAME}}\n" .
                        "Jabatan: Manager\n\n" .
                        "Dengan ini menugaskan:\n\n" .
                        "Nama: {{HANDLER_NAME}}\n" .
                        "Jabatan: Project Handler\n\n" .
                        "Untuk melaksanakan tugas:\n" .
                        "Project: {{PROJECT_NAME}}\n" .
                        "Deskripsi: {{TASK_DESCRIPTION}}\n" .
                        "Periode: {{START_DATE}} s/d {{END_DATE}}\n" .
                        "Lokasi: {{LOCATION}}\n\n" .
                        "Demikian surat tugas ini dibuat untuk dapat dilaksanakan dengan sebaik-baiknya.\n\n" .
                        "Manager,\n\n\n" .
                        "{{MANAGER_NAME}}",
            'variables' => [
                'letter_number' => 'Nomor Surat',
                'date' => 'Tanggal Surat',
                'manager_name' => 'Nama Manager',
                'handler_name' => 'Nama Handler',
                'project_name' => 'Nama Proyek',
                'task_description' => 'Deskripsi Tugas',
                'start_date' => 'Tanggal Mulai',
                'end_date' => 'Tanggal Selesai',
                'location' => 'Lokasi',
            ],
            'file_extension' => 'txt',
            'is_active' => true,
            'created_by' => $manager->id,
        ]);

        // 4. Project Brief Template
        DocumentTemplate::create([
            'name' => 'Project Brief',
            'category' => 'project',
            'description' => 'Template ringkasan project untuk klien',
            'content' => "PROJECT BRIEF\n\n" .
                        "Widianto & Sumbogo - Firma Akuntansi\n\n" .
                        "=== INFORMASI PROJECT ===\n\n" .
                        "Nama Project: {{PROJECT_NAME}}\n" .
                        "Klien: {{CLIENT_NAME}}\n" .
                        "Manager: {{MANAGER_NAME}}\n" .
                        "Periode: {{START_DATE}} - {{END_DATE}}\n\n" .
                        "=== OBJEKTIF ===\n" .
                        "{{OBJECTIVES}}\n\n" .
                        "=== RUANG LINGKUP ===\n" .
                        "{{SCOPE}}\n\n" .
                        "=== DELIVERABLES ===\n" .
                        "{{DELIVERABLES}}\n\n" .
                        "=== TIMELINE ===\n" .
                        "{{TIMELINE}}\n\n" .
                        "=== TIM PROJECT ===\n" .
                        "{{TEAM_MEMBERS}}\n\n" .
                        "Tanggal dibuat: {{DATE}}",
            'variables' => [
                'project_name' => 'Nama Proyek',
                'client_name' => 'Nama Klien',
                'manager_name' => 'Nama Manager',
                'start_date' => 'Tanggal Mulai',
                'end_date' => 'Tanggal Selesai',
                'objectives' => 'Tujuan Proyek',
                'scope' => 'Ruang Lingkup',
                'deliverables' => 'Hasil yang Diharapkan',
                'timeline' => 'Timeline',
                'team_members' => 'Anggota Tim',
                'date' => 'Tanggal',
            ],
            'file_extension' => 'txt',
            'is_active' => true,
            'created_by' => $manager->id,
        ]);

        // 5. Meeting Notes Template
        DocumentTemplate::create([
            'name' => 'Notulen Rapat',
            'category' => 'general',
            'description' => 'Template notulen rapat dengan klien atau internal',
            'content' => "NOTULEN RAPAT\n\n" .
                        "Widianto & Sumbogo\n\n" .
                        "Tanggal: {{DATE}}\n" .
                        "Waktu: {{TIME}}\n" .
                        "Lokasi: {{LOCATION}}\n" .
                        "Project: {{PROJECT_NAME}}\n\n" .
                        "=== PESERTA ===\n" .
                        "{{ATTENDEES}}\n\n" .
                        "=== AGENDA ===\n" .
                        "{{AGENDA}}\n\n" .
                        "=== PEMBAHASAN ===\n" .
                        "{{DISCUSSION}}\n\n" .
                        "=== KEPUTUSAN ===\n" .
                        "{{DECISIONS}}\n\n" .
                        "=== ACTION ITEMS ===\n" .
                        "{{ACTION_ITEMS}}\n\n" .
                        "=== RAPAT SELANJUTNYA ===\n" .
                        "{{NEXT_MEETING}}\n\n" .
                        "Notulis: {{MANAGER_NAME}}",
            'variables' => [
                'date' => 'Tanggal',
                'time' => 'Waktu',
                'location' => 'Lokasi',
                'project_name' => 'Nama Proyek',
                'attendees' => 'Peserta Rapat',
                'agenda' => 'Agenda',
                'discussion' => 'Pembahasan',
                'decisions' => 'Keputusan',
                'action_items' => 'Action Items',
                'next_meeting' => 'Rapat Selanjutnya',
                'manager_name' => 'Nama Notulis',
            ],
            'file_extension' => 'txt',
            'is_active' => true,
            'created_by' => $manager->id,
        ]);

        // 6. Status Report Template
        DocumentTemplate::create([
            'name' => 'Laporan Status Project',
            'category' => 'project',
            'description' => 'Template laporan perkembangan project',
            'content' => "LAPORAN STATUS PROJECT\n\n" .
                        "Widianto & Sumbogo\n\n" .
                        "Project: {{PROJECT_NAME}}\n" .
                        "Periode Laporan: {{PERIOD}}\n" .
                        "Tanggal: {{DATE}}\n" .
                        "Dibuat oleh: {{MANAGER_NAME}}\n\n" .
                        "=== STATUS KESELURUHAN ===\n" .
                        "Status: {{OVERALL_STATUS}}\n" .
                        "Progress: {{PROGRESS_PERCENTAGE}}%\n\n" .
                        "=== PENCAPAIAN PERIODE INI ===\n" .
                        "{{ACHIEVEMENTS}}\n\n" .
                        "=== KENDALA ===\n" .
                        "{{ISSUES}}\n\n" .
                        "=== RENCANA SELANJUTNYA ===\n" .
                        "{{NEXT_STEPS}}\n\n" .
                        "=== CATATAN ===\n" .
                        "{{NOTES}}",
            'variables' => [
                'project_name' => 'Nama Proyek',
                'period' => 'Periode',
                'date' => 'Tanggal',
                'manager_name' => 'Nama Manager',
                'overall_status' => 'Status (On Track/At Risk/Delayed)',
                'progress_percentage' => 'Persentase Progress',
                'achievements' => 'Pencapaian',
                'issues' => 'Kendala',
                'next_steps' => 'Langkah Selanjutnya',
                'notes' => 'Catatan',
            ],
            'file_extension' => 'txt',
            'is_active' => true,
            'created_by' => $manager->id,
        ]);
    }
}
