/*
 Navicat Premium Data Transfer

 Source Server         : VPS HARIS 2026
 Source Server Type    : MySQL
 Source Server Version : 101116 (10.11.16-MariaDB-ubu2204)
 Source Host           : 103.82.240.178:3306
 Source Schema         : pmtk_pmt

 Target Server Type    : MySQL
 Target Server Version : 101116 (10.11.16-MariaDB-ubu2204)
 File Encoding         : 65001

 Date: 22/06/2026 17:40:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned DEFAULT NULL,
  `model_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `activities_model_type_model_id_index` (`model_type`,`model_id`) USING BTREE,
  KEY `activities_user_id_index` (`user_id`) USING BTREE,
  KEY `activities_created_at_index` (`created_at`) USING BTREE,
  KEY `activities_action_idx` (`action`) USING BTREE,
  KEY `activities_model_type_idx` (`model_type`) USING BTREE,
  KEY `activities_user_created_idx` (`user_id`,`created_at`) USING BTREE,
  CONSTRAINT `activities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of activities
-- ----------------------------
BEGIN;
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (1, 1, 'status_changed', 'Task', 29, 'Calendar Demo - Upload Supporting Docs', 'Moved task \"Calendar Demo - Upload Supporting Docs\" from todo to in_progress', '{\"from\":\"todo\",\"to\":\"in_progress\"}', '2026-05-22 08:40:24', '2026-05-22 08:40:24');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (2, 1, 'created', 'Task', 33, 'task 1', 'Created task \"task 1\"', '{\"project\":\"Calendar Demo - Deadline Sprint B\"}', '2026-05-22 08:51:59', '2026-05-22 08:51:59');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (3, 1, 'status_changed', 'Task', 30, 'Calendar Demo - Tax Reconciliation', 'Moved task \"Calendar Demo - Tax Reconciliation\" from todo to in_progress', '{\"from\":\"todo\",\"to\":\"in_progress\"}', '2026-05-22 08:52:11', '2026-05-22 08:52:11');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (4, 1, 'status_changed', 'Task', 30, 'Calendar Demo - Tax Reconciliation', 'Moved task \"Calendar Demo - Tax Reconciliation\" from in_progress to todo', '{\"from\":\"in_progress\",\"to\":\"todo\"}', '2026-05-22 08:52:16', '2026-05-22 08:52:16');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (5, 1, 'status_changed', 'Task', 33, 'task 1', 'Moved task \"task 1\" from in_progress to completed', '{\"from\":\"in_progress\",\"to\":\"completed\"}', '2026-05-22 08:52:20', '2026-05-22 08:52:20');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (6, 1, 'status_changed', 'Task', 33, 'task 1', 'Moved task \"task 1\" from completed to in_progress', '{\"from\":\"completed\",\"to\":\"in_progress\"}', '2026-05-22 08:52:23', '2026-05-22 08:52:23');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (7, 1, 'status_changed', 'Task', 30, 'Calendar Demo - Tax Reconciliation', 'Moved task \"Calendar Demo - Tax Reconciliation\" from todo to in_progress', '{\"from\":\"todo\",\"to\":\"in_progress\"}', '2026-05-22 08:52:26', '2026-05-22 08:52:26');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (8, 1, 'status_changed', 'Task', 32, 'Calendar Demo - Escalation Report', 'Moved task \"Calendar Demo - Escalation Report\" from todo to completed', '{\"from\":\"todo\",\"to\":\"completed\"}', '2026-05-25 02:35:59', '2026-05-25 02:35:59');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (9, 1, 'updated', 'Task', 6, 'Penyusunan dan Review Laporan Audit', 'Updated task \"Penyusunan dan Review Laporan Audit\"', '{\"fields\":[\"title\",\"description\",\"assigned_to\",\"status\",\"priority\",\"due_date\"]}', '2026-05-25 03:11:09', '2026-05-25 03:11:09');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (10, 1, 'updated', 'Task', 3, 'Pengujian Substantif Kas dan Bank', 'Updated task \"Pengujian Substantif Kas dan Bank\"', '{\"fields\":[\"title\",\"description\",\"assigned_to\",\"status\",\"priority\",\"due_date\"]}', '2026-05-25 03:11:29', '2026-05-25 03:11:29');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (11, 1, 'created', 'Task', 34, 'new task', 'Created task \"new task\"', '{\"project\":\"Audit Laporan Keuangan \\u2013 PT Maju Bersama 2025\"}', '2026-06-12 01:28:22', '2026-06-12 01:28:22');
INSERT INTO `activities` (`id`, `user_id`, `action`, `model_type`, `model_id`, `model_name`, `description`, `properties`, `created_at`, `updated_at`) VALUES (12, 1, 'deleted', 'Task', NULL, 'new task', 'Deleted task \"new task\"', NULL, '2026-06-12 01:28:26', '2026-06-12 01:28:26');
COMMIT;

-- ----------------------------
-- Table structure for document_templates
-- ----------------------------
DROP TABLE IF EXISTS `document_templates`;
CREATE TABLE `document_templates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `file_extension` varchar(255) NOT NULL DEFAULT 'docx',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `document_templates_created_by_foreign` (`created_by`) USING BTREE,
  CONSTRAINT `document_templates_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of document_templates
-- ----------------------------
BEGIN;
INSERT INTO `document_templates` (`id`, `name`, `category`, `description`, `content`, `variables`, `file_extension`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES (1, 'Laporan Keuangan Bulanan', 'financial', 'Template untuk laporan keuangan bulanan klien', 'LAPORAN KEUANGAN BULANAN\n\nNama Klien: {{CLIENT_NAME}}\nPeriode: {{PERIOD}}\nTanggal: {{DATE}}\n\n=== RINGKASAN KEUANGAN ===\n\nTotal Pendapatan: {{TOTAL_INCOME}}\nTotal Pengeluaran: {{TOTAL_EXPENSES}}\nLaba/Rugi Bersih: {{NET_PROFIT}}\n\n=== CATATAN ===\n{{NOTES}}\n\nDisiapkan oleh: {{MANAGER_NAME}}\nWidianto & Sumbogo\nFirma Akuntansi', '{\"client_name\":\"Nama Klien\",\"period\":\"Periode Laporan\",\"date\":\"Tanggal Laporan\",\"total_income\":\"Total Pendapatan\",\"total_expenses\":\"Total Pengeluaran\",\"net_profit\":\"Laba\\/Rugi Bersih\",\"notes\":\"Catatan Tambahan\",\"manager_name\":\"Nama Manager\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` (`id`, `name`, `category`, `description`, `content`, `variables`, `file_extension`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES (2, 'Invoice/Faktur', 'financial', 'Template invoice untuk tagihan jasa akuntansi', 'INVOICE\n\nWIDIANTO & SUMBOGO\nFirma Akuntansi\n\nInvoice No: {{INVOICE_NUMBER}}\nTanggal: {{DATE}}\n\nKepada:\n{{CLIENT_NAME}}\n{{CLIENT_ADDRESS}}\n\n=== DETAIL LAYANAN ===\n\nProject: {{PROJECT_NAME}}\nDeskripsi: {{SERVICE_DESCRIPTION}}\nPeriode: {{PERIOD}}\n\nSubtotal: {{SUBTOTAL}}\nPPN 11%: {{TAX}}\nTotal: {{TOTAL}}\n\nPembayaran harap ditransfer ke:\nBank: BCA\nNo. Rek: 1234567890\nA/N: Widianto & Sumbogo\n\nTerima kasih atas kepercayaan Anda.', '{\"invoice_number\":\"Nomor Invoice\",\"date\":\"Tanggal Invoice\",\"client_name\":\"Nama Klien\",\"client_address\":\"Alamat Klien\",\"project_name\":\"Nama Proyek\",\"service_description\":\"Deskripsi Layanan\",\"period\":\"Periode Layanan\",\"subtotal\":\"Subtotal\",\"tax\":\"Pajak\",\"total\":\"Total\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` (`id`, `name`, `category`, `description`, `content`, `variables`, `file_extension`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES (3, 'Surat Tugas', 'legal', 'Template surat tugas untuk staff', 'SURAT TUGAS\n\nWIDIANTO & SUMBOGO\nFirma Akuntansi\n\nNomor: {{LETTER_NUMBER}}\nTanggal: {{DATE}}\n\nYang bertanda tangan di bawah ini:\n\nNama: {{MANAGER_NAME}}\nJabatan: Manager\n\nDengan ini menugaskan:\n\nNama: {{HANDLER_NAME}}\nJabatan: Project Handler\n\nUntuk melaksanakan tugas:\nProject: {{PROJECT_NAME}}\nDeskripsi: {{TASK_DESCRIPTION}}\nPeriode: {{START_DATE}} s/d {{END_DATE}}\nLokasi: {{LOCATION}}\n\nDemikian surat tugas ini dibuat untuk dapat dilaksanakan dengan sebaik-baiknya.\n\nManager,\n\n\n{{MANAGER_NAME}}', '{\"letter_number\":\"Nomor Surat\",\"date\":\"Tanggal Surat\",\"manager_name\":\"Nama Manager\",\"handler_name\":\"Nama Handler\",\"project_name\":\"Nama Proyek\",\"task_description\":\"Deskripsi Tugas\",\"start_date\":\"Tanggal Mulai\",\"end_date\":\"Tanggal Selesai\",\"location\":\"Lokasi\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` (`id`, `name`, `category`, `description`, `content`, `variables`, `file_extension`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES (4, 'Project Brief', 'project', 'Template ringkasan project untuk klien', 'PROJECT BRIEF\n\nWidianto & Sumbogo - Firma Akuntansi\n\n=== INFORMASI PROJECT ===\n\nNama Project: {{PROJECT_NAME}}\nKlien: {{CLIENT_NAME}}\nManager: {{MANAGER_NAME}}\nPeriode: {{START_DATE}} - {{END_DATE}}\n\n=== OBJEKTIF ===\n{{OBJECTIVES}}\n\n=== RUANG LINGKUP ===\n{{SCOPE}}\n\n=== DELIVERABLES ===\n{{DELIVERABLES}}\n\n=== TIMELINE ===\n{{TIMELINE}}\n\n=== TIM PROJECT ===\n{{TEAM_MEMBERS}}\n\nTanggal dibuat: {{DATE}}', '{\"project_name\":\"Nama Proyek\",\"client_name\":\"Nama Klien\",\"manager_name\":\"Nama Manager\",\"start_date\":\"Tanggal Mulai\",\"end_date\":\"Tanggal Selesai\",\"objectives\":\"Tujuan Proyek\",\"scope\":\"Ruang Lingkup\",\"deliverables\":\"Hasil yang Diharapkan\",\"timeline\":\"Timeline\",\"team_members\":\"Anggota Tim\",\"date\":\"Tanggal\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` (`id`, `name`, `category`, `description`, `content`, `variables`, `file_extension`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES (5, 'Notulen Rapat', 'general', 'Template notulen rapat dengan klien atau internal', 'NOTULEN RAPAT\n\nWidianto & Sumbogo\n\nTanggal: {{DATE}}\nWaktu: {{TIME}}\nLokasi: {{LOCATION}}\nProject: {{PROJECT_NAME}}\n\n=== PESERTA ===\n{{ATTENDEES}}\n\n=== AGENDA ===\n{{AGENDA}}\n\n=== PEMBAHASAN ===\n{{DISCUSSION}}\n\n=== KEPUTUSAN ===\n{{DECISIONS}}\n\n=== ACTION ITEMS ===\n{{ACTION_ITEMS}}\n\n=== RAPAT SELANJUTNYA ===\n{{NEXT_MEETING}}\n\nNotulis: {{MANAGER_NAME}}', '{\"date\":\"Tanggal\",\"time\":\"Waktu\",\"location\":\"Lokasi\",\"project_name\":\"Nama Proyek\",\"attendees\":\"Peserta Rapat\",\"agenda\":\"Agenda\",\"discussion\":\"Pembahasan\",\"decisions\":\"Keputusan\",\"action_items\":\"Action Items\",\"next_meeting\":\"Rapat Selanjutnya\",\"manager_name\":\"Nama Notulis\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` (`id`, `name`, `category`, `description`, `content`, `variables`, `file_extension`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES (6, 'Laporan Status Project', 'project', 'Template laporan perkembangan project', 'LAPORAN STATUS PROJECT\n\nWidianto & Sumbogo\n\nProject: {{PROJECT_NAME}}\nPeriode Laporan: {{PERIOD}}\nTanggal: {{DATE}}\nDibuat oleh: {{MANAGER_NAME}}\n\n=== STATUS KESELURUHAN ===\nStatus: {{OVERALL_STATUS}}\nProgress: {{PROGRESS_PERCENTAGE}}%\n\n=== PENCAPAIAN PERIODE INI ===\n{{ACHIEVEMENTS}}\n\n=== KENDALA ===\n{{ISSUES}}\n\n=== RENCANA SELANJUTNYA ===\n{{NEXT_STEPS}}\n\n=== CATATAN ===\n{{NOTES}}', '{\"project_name\":\"Nama Proyek\",\"period\":\"Periode\",\"date\":\"Tanggal\",\"manager_name\":\"Nama Manager\",\"overall_status\":\"Status (On Track\\/At Risk\\/Delayed)\",\"progress_percentage\":\"Persentase Progress\",\"achievements\":\"Pencapaian\",\"issues\":\"Kendala\",\"next_steps\":\"Langkah Selanjutnya\",\"notes\":\"Catatan\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
COMMIT;

-- ----------------------------
-- Table structure for documents
-- ----------------------------
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `documents_project_id_foreign` (`project_id`) USING BTREE,
  KEY `documents_uploaded_by_foreign` (`uploaded_by`) USING BTREE,
  KEY `documents_created_at_idx` (`created_at`) USING BTREE,
  CONSTRAINT `documents_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `documents_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of documents
-- ----------------------------
BEGIN;
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (1, 1, 'Engagement Letter - PT Maju Bersama', 'engagement-letter-maju-bersama.pdf', 'documents/engagement-letter-maju-bersama.pdf', 'pdf', 245760, 1, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (2, 1, 'Neraca PT Maju Bersama 2025', 'neraca-maju-bersama-2025.xlsx', 'documents/neraca-maju-bersama-2025.xlsx', 'xlsx', 512000, 2, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (3, 1, 'Program Audit - PT Maju Bersama', 'program-audit-maju-bersama.pdf', 'documents/program-audit-maju-bersama.pdf', 'pdf', 389120, 3, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (4, 2, 'Laporan Laba Rugi CV Cahaya Niaga 2025', 'laba-rugi-cahaya-niaga-2025.xlsx', 'documents/laba-rugi-cahaya-niaga-2025.xlsx', 'xlsx', 430080, 3, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (5, 2, 'Bukti Potong PPh 23 - CV Cahaya Niaga', 'bukti-potong-pph23-cahaya-niaga.pdf', 'documents/bukti-potong-pph23-cahaya-niaga.pdf', 'pdf', 204800, 4, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (6, 4, 'Rekap Transaksi Januari 2026 - UD Karya Mandiri', 'rekap-jan-2026-karya-mandiri.xlsx', 'documents/rekap-jan-2026-karya-mandiri.xlsx', 'xlsx', 327680, 5, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (7, 4, 'Laporan Keuangan Feb 2026 - UD Karya Mandiri', 'lapkeu-feb-2026-karya-mandiri.pdf', 'documents/lapkeu-feb-2026-karya-mandiri.pdf', 'pdf', 614400, 5, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (8, 5, 'Laporan Review Yayasan Pendidikan Harapan 2025', 'laporan-review-yayasan-harapan-2025.pdf', 'documents/laporan-review-yayasan-harapan-2025.pdf', 'pdf', 819200, 1, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (9, 5, 'Kertas Kerja Review - Yayasan Harapan', 'kkr-yayasan-harapan.xlsx', 'documents/kkr-yayasan-harapan.xlsx', 'xlsx', 655360, 4, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (10, 7, 'Daftar Transaksi Afiliasi 2025 - PT Global Teknindo', 'transaksi-afiliasi-global-teknindo-2025.xlsx', 'documents/transaksi-afiliasi-global-teknindo-2025.xlsx', 'xlsx', 491520, 4, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (11, 8, 'Laporan Audit Internal - KSP Sejahtera 2025', 'laporan-audit-ksp-sejahtera-2025.pdf', 'documents/laporan-audit-ksp-sejahtera-2025.pdf', 'pdf', 921600, 1, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` (`id`, `project_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_by`, `created_at`, `updated_at`) VALUES (12, 8, 'Temuan dan Rekomendasi - KSP Sejahtera', 'temuan-rekomendasi-ksp-sejahtera.pdf', 'documents/temuan-rekomendasi-ksp-sejahtera.pdf', 'pdf', 368640, 2, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
COMMIT;

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of migrations
-- ----------------------------
BEGIN;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1, '2014_10_12_000000_create_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2, '2014_10_12_100000_create_password_reset_tokens_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3, '2019_08_19_000000_create_failed_jobs_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4, '2019_12_14_000001_create_personal_access_tokens_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5, '2026_04_08_054027_create_projects_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6, '2026_04_08_054034_create_documents_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7, '2026_04_08_054034_create_tasks_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8, '2026_04_08_073000_create_notifications_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9, '2026_04_08_080000_create_document_templates_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10, '2026_04_08_090000_add_is_active_to_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11, '2026_04_08_100000_create_activities_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12, '2026_04_08_200000_add_indexes_to_all_tables', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13, '2026_04_19_000001_add_client_name_to_projects_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14, '2026_04_19_044941_add_client_name_to_projects_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15, '2026_04_19_120000_create_project_handlers_table', 1);
COMMIT;

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `notifications_user_read_idx` (`user_id`,`is_read`) USING BTREE,
  KEY `notifications_created_at_idx` (`created_at`) USING BTREE,
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of notifications
-- ----------------------------
BEGIN;
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (1, 2, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Pengujian Substantif Kas dan Bank', '{\"task_id\":3,\"project_id\":1}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (2, 2, 'deadline_approaching', 'Tenggat Waktu Mendekat', 'Tugas \'Pengujian Substantif Kas dan Bank\' jatuh tempo pada 2026-04-10 00:00:00', '{\"task_id\":3,\"due_date\":\"2026-04-10T00:00:00.000000Z\"}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (3, 2, 'document_uploaded', 'Dokumen Baru Diunggah', 'Dokumen baru telah diunggah ke proyek Audit PT Maju Bersama 2025', '{\"project_id\":1}', 1, '2026-05-21 02:14:28', '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (4, 3, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Pengisian Formulir SPT 1771', '{\"task_id\":9}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (5, 3, 'status_changed', 'Status Tugas Diperbarui', 'Status tugas \"Pengisian Formulir SPT 1771\" diubah menjadi In Progress', '{\"old_status\":\"todo\",\"new_status\":\"in_progress\"}', 1, '2026-05-21 00:14:28', '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (6, 4, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Pengujian Substantif Piutang dan Persediaan', '{\"task_id\":4}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (7, 4, 'deadline_approaching', 'Tenggat Waktu Mendekat', 'Pengujian Substantif Piutang harus selesai sebelum 20 April 2026', '{\"due_date\":\"2026-04-20\"}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (8, 5, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Penyusunan dan Review Laporan Audit', '{\"task_id\":6}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (9, 5, 'document_uploaded', 'Dokumen Baru Diunggah', 'Dokumen \"Laporan Keuangan Feb 2026\" diunggah ke UD Karya Mandiri', '{\"project_id\":4}', 1, '2026-05-20 05:14:28', '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (10, 3, 'task_assigned', 'New task assigned', 'You were assigned to task \"task 1\" in project \"Calendar Demo - Deadline Sprint B\".', '{\"task_id\":33,\"project_id\":\"10\",\"url\":\"\\/projects\\/10?focus_task=33\"}', 0, NULL, '2026-05-22 08:51:59', '2026-05-22 08:51:59');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES (11, 2, 'task_assigned', 'New task assigned', 'You were assigned to task \"new task\" in project \"Audit Laporan Keuangan – PT Maju Bersama 2025\".', '{\"task_id\":34,\"project_id\":\"1\",\"url\":\"\\/projects\\/1?focus_task=34\"}', 0, NULL, '2026-06-12 01:28:22', '2026-06-12 01:28:22');
COMMIT;

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`) USING BTREE,
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of personal_access_tokens
-- ----------------------------
BEGIN;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (1, 'App\\Models\\User', 1, 'auth-token', '60f242862a8027273d3b2fdc05f154ae9602730c7ed8a1a00696ab72870a718f', '[\"*\"]', '2026-05-21 05:33:55', NULL, '2026-05-21 05:22:13', '2026-05-21 05:33:55');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (2, 'App\\Models\\User', 1, 'auth-token', '82aab82922570c383d759abc0e93eabfead94415a5e717e3d8c98fca45d39371', '[\"*\"]', '2026-05-23 06:10:16', NULL, '2026-05-22 08:39:31', '2026-05-23 06:10:16');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (3, 'App\\Models\\User', 1, 'auth-token', 'ccd5573195cc1551a164385f49d2303b044719c477b936cda101806930c931f9', '[\"*\"]', '2026-05-25 03:12:39', NULL, '2026-05-25 02:35:13', '2026-05-25 03:12:39');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (4, 'App\\Models\\User', 1, 'auth-token', 'd78795967c65b0d62bb6d2b5752b74a49fadeb70ab0003459099988bc1a41431', '[\"*\"]', '2026-06-11 09:22:40', NULL, '2026-06-11 09:15:53', '2026-06-11 09:22:40');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (5, 'App\\Models\\User', 1, 'auth-token', '62898557aeeeb3959a0697fe83dcec2b7a622942b81d8816c59a181889349723', '[\"*\"]', '2026-06-11 09:27:08', NULL, '2026-06-11 09:23:00', '2026-06-11 09:27:08');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (6, 'App\\Models\\User', 1, 'auth-token', '4f7801d9c17956e8e20d332dba2979f48c11ba4b8d51d0236f426b55c20116d0', '[\"*\"]', '2026-06-11 10:26:05', NULL, '2026-06-11 10:26:05', '2026-06-11 10:26:05');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (7, 'App\\Models\\User', 1, 'auth-token', '8465e1fd82bccdcc200b8b877804dde9b68bbe32c88f8436b5cdd4e9e31c48da', '[\"*\"]', '2026-06-11 16:23:14', NULL, '2026-06-11 16:22:25', '2026-06-11 16:23:14');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (8, 'App\\Models\\User', 1, 'auth-token', '5fbc8d58387256ced1d85b01acb25bc7155f707cd477c1c06388242ec5b14ce6', '[\"*\"]', '2026-06-11 16:24:55', NULL, '2026-06-11 16:23:48', '2026-06-11 16:24:55');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (9, 'App\\Models\\User', 1, 'auth-token', '9a4f494eb093415cd5b01ecfea1d9f3c12beb45b74521b199dc3cd9690e85140', '[\"*\"]', '2026-06-12 01:29:45', NULL, '2026-06-12 01:26:26', '2026-06-12 01:29:45');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (10, 'App\\Models\\User', 1, 'auth-token', '1712180ba9ca26067af6fb8f68451d1eaac43895e033fc755f4a0fcd4e2bcc28', '[\"*\"]', '2026-06-16 15:34:19', NULL, '2026-06-16 15:33:37', '2026-06-16 15:34:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (11, 'App\\Models\\User', 1, 'auth-token', '8c2dc43f452ff81b5f58a18166b00bd1869b9cdd20a145634d81038e481619c5', '[\"*\"]', '2026-06-16 15:49:41', NULL, '2026-06-16 15:42:09', '2026-06-16 15:49:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (12, 'App\\Models\\User', 1, 'auth-token', '2b575fcc20ea838cc75800b6999d9f06d0e0778508012c9695ee2f8f3fcff54f', '[\"*\"]', '2026-06-16 16:04:58', NULL, '2026-06-16 15:50:15', '2026-06-16 16:04:58');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (13, 'App\\Models\\User', 1, 'auth-token', '48a9c326a87233faea732bd4c77efad9d8388311cf6ade807e856606d2d230b3', '[\"*\"]', '2026-06-17 05:44:02', NULL, '2026-06-17 05:40:43', '2026-06-17 05:44:02');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (14, 'App\\Models\\User', 1, 'auth-token', '765096ed28bb56566eaf043c093b5bbc167dbaecee54792ec566e60fbd2bceef', '[\"*\"]', '2026-06-17 05:44:17', NULL, '2026-06-17 05:44:17', '2026-06-17 05:44:17');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (15, 'App\\Models\\User', 1, 'auth-token', '0b75f90ac8e7fde30e57361f0cfe6a7955d20e5ca45f33aba4aeed250dd4020f', '[\"*\"]', '2026-06-17 05:45:42', NULL, '2026-06-17 05:44:34', '2026-06-17 05:45:42');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (16, 'App\\Models\\User', 1, 'auth-token', '08b2c2aa25a76addc5f8115851a97bd881371a03e3626739af0772d4b5d85105', '[\"*\"]', '2026-06-17 05:48:46', NULL, '2026-06-17 05:48:10', '2026-06-17 05:48:46');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (17, 'App\\Models\\User', 9, 'auth-token', '5db1e19c07f47d9857905ea68a0358bd483d6dcd0074fa868295335c88be419b', '[\"*\"]', '2026-06-17 06:08:13', NULL, '2026-06-17 06:08:13', '2026-06-17 06:08:13');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (18, 'App\\Models\\User', 11, 'auth-token', 'bbe1749d786ada52394efe2dc4d8d95a8cf0ab05216c33f03c343ae1e1543e9c', '[\"*\"]', '2026-06-17 06:51:47', NULL, '2026-06-17 06:48:16', '2026-06-17 06:51:47');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (19, 'App\\Models\\User', 1, 'auth-token', '307b161c4ec72b281b621310c90109ee3eaefea90040a648376cebc4e7e06156', '[\"*\"]', '2026-06-18 09:01:26', NULL, '2026-06-18 09:00:20', '2026-06-18 09:01:26');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (20, 'App\\Models\\User', 1, 'auth-token', 'f5994d2cf6e3fa4143e3d0438aa0e4fa85991522a803436d083854c7861f88e7', '[\"*\"]', '2026-06-19 10:54:37', NULL, '2026-06-19 10:28:04', '2026-06-19 10:54:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (21, 'App\\Models\\User', 1, 'auth-token', 'b21fa252fd13555103b55ae0a2cf71430897b46336e7149e4ea5bb41b8aa27c2', '[\"*\"]', '2026-06-19 10:54:54', NULL, '2026-06-19 10:54:42', '2026-06-19 10:54:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (22, 'App\\Models\\User', 1, 'auth-token', 'e536a853e8461e30ddfc47771701dcf6d4d72a4004a62e40e33bcadc46f16dcc', '[\"*\"]', '2026-06-19 10:55:27', NULL, '2026-06-19 10:54:56', '2026-06-19 10:55:27');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (23, 'App\\Models\\User', 1, 'auth-token', 'e205a8f2865f80d64b12ae562b3a41cf057aff8a1ea79cafe2072fc17315504f', '[\"*\"]', '2026-06-22 05:59:11', NULL, '2026-06-22 05:41:06', '2026-06-22 05:59:11');
COMMIT;

-- ----------------------------
-- Table structure for project_handlers
-- ----------------------------
DROP TABLE IF EXISTS `project_handlers`;
CREATE TABLE `project_handlers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `project_handlers_project_id_user_id_unique` (`project_id`,`user_id`) USING BTREE,
  KEY `project_handlers_user_id_foreign` (`user_id`) USING BTREE,
  CONSTRAINT `project_handlers_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_handlers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of project_handlers
-- ----------------------------
BEGIN;
INSERT INTO `project_handlers` (`id`, `project_id`, `user_id`, `created_at`, `updated_at`) VALUES (1, 9, 2, NULL, NULL);
INSERT INTO `project_handlers` (`id`, `project_id`, `user_id`, `created_at`, `updated_at`) VALUES (2, 9, 5, NULL, NULL);
INSERT INTO `project_handlers` (`id`, `project_id`, `user_id`, `created_at`, `updated_at`) VALUES (3, 10, 3, NULL, NULL);
INSERT INTO `project_handlers` (`id`, `project_id`, `user_id`, `created_at`, `updated_at`) VALUES (4, 11, 4, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `client_id` bigint(20) unsigned DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `manager_id` bigint(20) unsigned NOT NULL,
  `status` enum('pending','in_progress','completed','on_hold') NOT NULL DEFAULT 'pending',
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `projects_client_id_foreign` (`client_id`) USING BTREE,
  KEY `projects_manager_id_foreign` (`manager_id`) USING BTREE,
  KEY `projects_status_idx` (`status`) USING BTREE,
  KEY `projects_created_at_idx` (`created_at`) USING BTREE,
  CONSTRAINT `projects_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projects_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of projects
-- ----------------------------
BEGIN;
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (1, 'Audit Laporan Keuangan – PT Maju Bersama 2025', 'Pemeriksaan dan audit laporan keuangan tahunan PT Maju Bersama untuk periode fiskal 2025. Mencakup neraca, laporan laba rugi, dan catatan atas laporan keuangan.', 2, NULL, 1, 'in_progress', '2026-02-01', '2026-05-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (2, 'Penyusunan SPT Tahunan – CV Cahaya Niaga', 'Penyusunan dan pelaporan Surat Pemberitahuan (SPT) Tahunan Pajak Penghasilan Badan CV Cahaya Niaga tahun pajak 2025.', 3, NULL, 1, 'in_progress', '2026-01-15', '2026-04-30', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (3, 'Konsultasi Restrukturisasi Pajak – PT Sinar Abadi', 'Konsultasi dan perencanaan pajak terkait rencana restrukturisasi bisnis PT Sinar Abadi, termasuk analisis dampak pajak atas merger dan akuisisi aset.', 4, NULL, 1, 'pending', '2026-05-01', '2026-07-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (4, 'Pembukuan Bulanan – UD Karya Mandiri', 'Pengelolaan pembukuan bulanan UD Karya Mandiri meliputi jurnal transaksi, rekonsiliasi bank, dan penyusunan laporan keuangan ringkas setiap bulan.', 5, NULL, 1, 'in_progress', '2026-01-01', '2026-12-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (5, 'Review Laporan Keuangan – Yayasan Pendidikan Harapan', 'Review independen atas laporan keuangan Yayasan Pendidikan Harapan untuk keperluan pelaporan kepada donatur dan badan pengawas.', 2, NULL, 1, 'completed', '2025-11-01', '2026-01-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (6, 'Due Diligence Keuangan – Akuisisi PT Nusantara Logistik', 'Pelaksanaan uji tuntas keuangan (financial due diligence) dalam rangka rencana akuisisi PT Nusantara Logistik oleh investor strategis.', 3, NULL, 1, 'pending', '2026-06-01', '2026-08-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (7, 'Penyusunan Laporan Transfer Pricing – PT Global Teknindo', 'Penyusunan dokumentasi transfer pricing sesuai Peraturan Dirjen Pajak PER-32/PJ/2011 untuk transaksi afiliasi PT Global Teknindo tahun 2025.', 4, NULL, 1, 'on_hold', '2026-03-01', '2026-06-30', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (8, 'Audit Internal – Koperasi Simpan Pinjam Sejahtera', 'Audit internal atas pengelolaan keuangan dan operasional Koperasi Simpan Pinjam Sejahtera untuk periode Januari–Desember 2025.', 5, NULL, 1, 'completed', '2025-12-01', '2026-02-28', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (9, 'Calendar Demo - Deadline Sprint A', 'Project demo kalender dengan milestone dekat deadline.', 2, 'Rina Sumbogo', 1, 'in_progress', '2026-05-11', '2026-05-24', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (10, 'Calendar Demo - Deadline Sprint B', 'Project demo kalender dengan due date minggu depan.', 3, 'Agus Haryanto', 1, 'pending', '2026-05-16', '2026-05-28', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `projects` (`id`, `title`, `description`, `client_id`, `client_name`, `manager_id`, `status`, `start_date`, `due_date`, `created_at`, `updated_at`) VALUES (11, 'Calendar Demo - Overdue Rescue', 'Project demo kalender yang sudah melewati deadline.', 4, 'Dina Kusumawati', 1, 'in_progress', '2026-05-01', '2026-05-19', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
COMMIT;

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `assigned_to` bigint(20) unsigned DEFAULT NULL,
  `status` enum('todo','in_progress','review','completed') NOT NULL DEFAULT 'todo',
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `tasks_status_idx` (`status`) USING BTREE,
  KEY `tasks_priority_idx` (`priority`) USING BTREE,
  KEY `tasks_due_date_idx` (`due_date`) USING BTREE,
  KEY `tasks_created_at_idx` (`created_at`) USING BTREE,
  KEY `tasks_project_status_idx` (`project_id`,`status`) USING BTREE,
  KEY `tasks_assigned_status_idx` (`assigned_to`,`status`) USING BTREE,
  CONSTRAINT `tasks_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of tasks
-- ----------------------------
BEGIN;
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (1, 1, 'Pengumpulan Dokumen Pendukung Klien', 'Minta dan verifikasi dokumen dari klien: buku besar, mutasi bank, bukti transaksi, dan saldo awal periode.', 2, 'completed', 'high', '2026-02-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (2, 1, 'Analisis Risiko dan Perencanaan Audit', 'Identifikasi area berisiko tinggi, tentukan materialitas, dan susun program audit.', 3, 'completed', 'high', '2026-02-28', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (3, 1, 'Pengujian Substantif Kas dan Bank', 'Rekonsiliasi bank, konfirmasi saldo bank, dan pengujian penerimaan serta pengeluaran kas.', 2, 'in_progress', 'low', '2026-04-10', '2026-05-21 05:14:27', '2026-05-25 03:11:29');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (4, 1, 'Pengujian Substantif Piutang dan Persediaan', 'Konfirmasi piutang eksternal, stock opname, dan pengujian cut-off transaksi.', 4, 'in_progress', 'high', '2026-04-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (5, 1, 'Penyusunan Kertas Kerja Audit', 'Dokumentasikan seluruh prosedur audit, temuan, dan kesimpulan dalam kertas kerja standar.', 3, 'todo', 'medium', '2026-05-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (6, 1, 'Penyusunan dan Review Laporan Audit', 'Susun draf laporan auditor independen, review oleh manajer, dan finalisasi opini.', 5, 'todo', 'medium', '2026-05-25', '2026-05-21 05:14:27', '2026-05-25 03:11:09');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (7, 2, 'Rekap Penghasilan dan Biaya Tahun 2025', 'Kumpulkan dan rekap seluruh penghasilan bruto dan biaya fiskal yang diperkenankan untuk CV Cahaya Niaga.', 3, 'completed', 'high', '2026-02-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (8, 2, 'Koreksi Fiskal dan Perhitungan PPh Badan', 'Lakukan koreksi fiskal positif/negatif, hitung PKP, dan kalkulasi PPh Badan terutang.', 4, 'completed', 'high', '2026-03-01', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (9, 2, 'Pengisian Formulir SPT 1771', 'Isi formulir SPT Tahunan PPh Badan 1771 beserta lampiran-lampirannya secara lengkap dan benar.', 3, 'in_progress', 'high', '2026-04-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (10, 2, 'Review Final dan Pelaporan ke KPP', 'Review akhir dokumen SPT oleh manager, tanda tangan klien, dan e-filing ke Kantor Pelayanan Pajak.', 5, 'todo', 'high', '2026-04-28', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (11, 3, 'FGD Awal dengan Manajemen PT Sinar Abadi', 'Pertemuan awal untuk memahami rencana restrukturisasi, entitas terlibat, dan timeline yang diinginkan klien.', 4, 'todo', 'high', '2026-05-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (12, 3, 'Analisis Dampak Pajak Restrukturisasi', 'Analisis konsekuensi PPh atas pengalihan aset, PPn BM, dan potensi pajak daerah dalam skema merger.', 2, 'todo', 'high', '2026-06-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (13, 3, 'Penyusunan Memo Konsultasi Pajak', 'Buat memo tertulis berisi rekomendasi struktur pajak yang optimal dan risiko yang perlu dimitigasi.', 4, 'todo', 'medium', '2026-07-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (14, 4, 'Jurnal Transaksi Januari-Maret 2026', 'Input dan verifikasi seluruh jurnal transaksi pembelian, penjualan, dan biaya umum triwulan I.', 5, 'completed', 'medium', '2026-04-05', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (15, 4, 'Rekonsiliasi Bank Maret 2026', 'Rekonsiliasi mutasi rekening bank vs catatan pembukuan per 31 Maret 2026.', 5, 'in_progress', 'medium', '2026-04-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (16, 4, 'Laporan Keuangan Triwulan I 2026', 'Susun neraca saldo, laporan laba rugi, dan arus kas untuk periode Januari-Maret 2026.', 2, 'todo', 'medium', '2026-04-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (17, 5, 'Permintaan dan Penelaahan Dokumen Yayasan', 'Kumpulkan laporan keuangan yayasan, risalah rapat, dan dokumen anggaran.', 2, 'completed', 'medium', '2025-11-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (18, 5, 'Prosedur Review Analitis', 'Bandingkan laporan keuangan tahun berjalan vs tahun lalu, analisis rasio dan tren.', 3, 'completed', 'medium', '2025-12-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (19, 5, 'Penerbitan Laporan Review', 'Susun dan terbitkan laporan hasil review disertai simpulan akuntan.', 4, 'completed', 'high', '2026-01-25', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (20, 6, 'Perencanaan Ruang Lingkup Due Diligence', 'Tentukan cakupan DD: keuangan, pajak, hukum, dan operasional serta buat data request list.', 3, 'todo', 'high', '2026-06-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (21, 6, 'Analisis Laporan Keuangan 3 Tahun Terakhir', 'Review dan analisis laporan keuangan PT Nusantara Logistik 2023-2025: kualitas aset, utang, dan profitabilitas.', 4, 'todo', 'high', '2026-07-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (22, 6, 'Penyusunan Laporan Due Diligence', 'Kompilasi seluruh temuan menjadi laporan DD komprehensif untuk investor.', 5, 'todo', 'high', '2026-08-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (23, 7, 'Identifikasi Transaksi Afiliasi 2025', 'Identifikasi dan klasifikasikan seluruh transaksi dengan pihak berelasi yang wajib didokumentasikan.', 4, 'completed', 'high', '2026-03-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (24, 7, 'Analisis Comparability dan Pemilihan Metode TP', 'Lakukan analisis keterbandingan dan pilih metode transfer pricing yang paling sesuai (CUP/RPM/CPM).', 2, 'todo', 'high', '2026-06-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (25, 8, 'Audit SPI (Sistem Pengendalian Internal)', 'Evaluasi efektivitas pengendalian internal atas perhimpunan simpanan dan penyaluran pinjaman.', 5, 'completed', 'high', '2025-12-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (26, 8, 'Pengujian Portofolio Pinjaman', 'Uji sampel pinjaman yang disalurkan, verifikasi kelengkapan dokumen, dan kualitas kolektibilitas.', 3, 'completed', 'high', '2026-01-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (27, 8, 'Penyusunan Laporan Audit Internal', 'Susun laporan audit internal beserta rekomendasi perbaikan kepada pengurus koperasi.', 2, 'completed', 'medium', '2026-02-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (28, 9, 'Calendar Demo - Final Review Draft', 'Final review dokumen untuk sprint A.', 2, 'in_progress', 'high', '2026-05-22', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (29, 9, 'Calendar Demo - Upload Supporting Docs', 'Upload seluruh dokumen pendukung audit.', 5, 'in_progress', 'medium', '2026-05-23', '2026-05-21 05:18:15', '2026-05-22 08:40:24');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (30, 10, 'Calendar Demo - Tax Reconciliation', 'Rekonsiliasi data pajak untuk sprint B.', 3, 'in_progress', 'high', '2026-05-25', '2026-05-21 05:18:15', '2026-05-22 08:52:26');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (31, 11, 'Calendar Demo - Resolve Overdue Findings', 'Perbaiki temuan yang sudah overdue.', 4, 'in_progress', 'high', '2026-05-20', '2026-05-21 05:19:10', '2026-05-21 05:19:10');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (32, 11, 'Calendar Demo - Escalation Report', 'Laporan eskalasi untuk task overdue.', 4, 'completed', 'high', '2026-05-22', '2026-05-21 05:19:10', '2026-05-25 02:35:59');
INSERT INTO `tasks` (`id`, `project_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES (33, 10, 'task 1', 'desc', 3, 'in_progress', 'high', '2026-05-26', '2026-05-22 08:51:59', '2026-05-22 08:52:23');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `token_expires_at` timestamp NULL DEFAULT NULL,
  `role` enum('manager','project_handler') NOT NULL DEFAULT 'project_handler',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `users_email_unique` (`email`) USING BTREE,
  UNIQUE KEY `email_verification_token` (`email_verification_token`),
  UNIQUE KEY `password_reset_token` (`password_reset_token`),
  KEY `idx_email_verification_token` (`email_verification_token`),
  KEY `idx_password_reset_token` (`password_reset_token`),
  KEY `idx_token_expires_at` (`token_expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (1, 'Widianto Prasetyo', 'manager@wspmt.com', NULL, '2026-06-16 22:33:29', '$2y$10$jXCceGYwv8QXWmPHteoZkuqzES3lfeciXflRO.PVU2eyFWSpu9Glq', NULL, NULL, 'manager', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (2, 'Rina Sumbogo', 'rina@wspmt.com', NULL, NULL, '$2y$10$w.xG5Cx3Sx2PQ6/SeBqKF.saGmmxLA3TN/Q1/.Fw6jevDPqLJhsfe', NULL, NULL, 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (3, 'Agus Haryanto', 'agus@wspmt.com', NULL, NULL, '$2y$10$JxsDZwEFFp06MREQVnOFd.B5E7fd5QUQgphjR0vN5nEmqAOOGfXk6', NULL, NULL, 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (4, 'Dina Kusumawati', 'dina@wspmt.com', NULL, NULL, '$2y$10$7WYMQL.jWZ3NZrnl1Gnmvucxe7c8FbsLgKjviAqprSsdIlUffoRXi', NULL, NULL, 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (5, 'Reza Firmansyah', 'reza@wspmt.com', NULL, NULL, '$2y$10$b.4KASNhsX5OBlBWX/hhK.Hy41L4eew8EWwlMApkyCbYrnaxqQ6Ja', NULL, NULL, 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (9, 'haris', 'harrisselmi@gmail.com', NULL, '2026-06-17 06:25:54', '$2y$10$LvnS9u3MbnOcb.0gAWConuQDfYABG6As8f.ViVOPkC1WpbSdz/PAy', NULL, NULL, 'project_handler', 1, NULL, '2026-06-16 15:50:41', '2026-06-17 06:25:54');
INSERT INTO `users` (`id`, `name`, `email`, `email_verification_token`, `email_verified_at`, `password`, `password_reset_token`, `token_expires_at`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES (11, 'Test New User', 'kevinfachrezy21@gmail.com', NULL, '2026-06-17 06:48:05', '$2y$10$adfkqjsMdAKBfqfxvPKH2e1al2nkByaW3nH72hF5HVmJx.1k4MTVu', NULL, NULL, 'project_handler', 1, NULL, '2026-06-17 05:44:56', '2026-06-17 06:48:05');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
