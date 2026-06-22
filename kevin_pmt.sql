/*
 Navicat Premium Data Transfer

 Source Server         : LOCALHOST
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : kevin_pmt

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 21/05/2026 12:30:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NULL DEFAULT NULL,
  `model_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `activities_model_type_model_id_index`(`model_type` ASC, `model_id` ASC) USING BTREE,
  INDEX `activities_user_id_index`(`user_id` ASC) USING BTREE,
  INDEX `activities_created_at_index`(`created_at` ASC) USING BTREE,
  INDEX `activities_action_idx`(`action` ASC) USING BTREE,
  INDEX `activities_model_type_idx`(`model_type` ASC) USING BTREE,
  INDEX `activities_user_created_idx`(`user_id` ASC, `created_at` ASC) USING BTREE,
  CONSTRAINT `activities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activities
-- ----------------------------

-- ----------------------------
-- Table structure for document_templates
-- ----------------------------
DROP TABLE IF EXISTS `document_templates`;
CREATE TABLE `document_templates`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `file_extension` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'docx',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint UNSIGNED NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `document_templates_created_by_foreign`(`created_by` ASC) USING BTREE,
  CONSTRAINT `document_templates_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of document_templates
-- ----------------------------
INSERT INTO `document_templates` VALUES (1, 'Laporan Keuangan Bulanan', 'financial', 'Template untuk laporan keuangan bulanan klien', 'LAPORAN KEUANGAN BULANAN\n\nNama Klien: {{CLIENT_NAME}}\nPeriode: {{PERIOD}}\nTanggal: {{DATE}}\n\n=== RINGKASAN KEUANGAN ===\n\nTotal Pendapatan: {{TOTAL_INCOME}}\nTotal Pengeluaran: {{TOTAL_EXPENSES}}\nLaba/Rugi Bersih: {{NET_PROFIT}}\n\n=== CATATAN ===\n{{NOTES}}\n\nDisiapkan oleh: {{MANAGER_NAME}}\nWidianto & Sumbogo\nFirma Akuntansi', '{\"client_name\":\"Nama Klien\",\"period\":\"Periode Laporan\",\"date\":\"Tanggal Laporan\",\"total_income\":\"Total Pendapatan\",\"total_expenses\":\"Total Pengeluaran\",\"net_profit\":\"Laba\\/Rugi Bersih\",\"notes\":\"Catatan Tambahan\",\"manager_name\":\"Nama Manager\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` VALUES (2, 'Invoice/Faktur', 'financial', 'Template invoice untuk tagihan jasa akuntansi', 'INVOICE\n\nWIDIANTO & SUMBOGO\nFirma Akuntansi\n\nInvoice No: {{INVOICE_NUMBER}}\nTanggal: {{DATE}}\n\nKepada:\n{{CLIENT_NAME}}\n{{CLIENT_ADDRESS}}\n\n=== DETAIL LAYANAN ===\n\nProject: {{PROJECT_NAME}}\nDeskripsi: {{SERVICE_DESCRIPTION}}\nPeriode: {{PERIOD}}\n\nSubtotal: {{SUBTOTAL}}\nPPN 11%: {{TAX}}\nTotal: {{TOTAL}}\n\nPembayaran harap ditransfer ke:\nBank: BCA\nNo. Rek: 1234567890\nA/N: Widianto & Sumbogo\n\nTerima kasih atas kepercayaan Anda.', '{\"invoice_number\":\"Nomor Invoice\",\"date\":\"Tanggal Invoice\",\"client_name\":\"Nama Klien\",\"client_address\":\"Alamat Klien\",\"project_name\":\"Nama Proyek\",\"service_description\":\"Deskripsi Layanan\",\"period\":\"Periode Layanan\",\"subtotal\":\"Subtotal\",\"tax\":\"Pajak\",\"total\":\"Total\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` VALUES (3, 'Surat Tugas', 'legal', 'Template surat tugas untuk staff', 'SURAT TUGAS\n\nWIDIANTO & SUMBOGO\nFirma Akuntansi\n\nNomor: {{LETTER_NUMBER}}\nTanggal: {{DATE}}\n\nYang bertanda tangan di bawah ini:\n\nNama: {{MANAGER_NAME}}\nJabatan: Manager\n\nDengan ini menugaskan:\n\nNama: {{HANDLER_NAME}}\nJabatan: Project Handler\n\nUntuk melaksanakan tugas:\nProject: {{PROJECT_NAME}}\nDeskripsi: {{TASK_DESCRIPTION}}\nPeriode: {{START_DATE}} s/d {{END_DATE}}\nLokasi: {{LOCATION}}\n\nDemikian surat tugas ini dibuat untuk dapat dilaksanakan dengan sebaik-baiknya.\n\nManager,\n\n\n{{MANAGER_NAME}}', '{\"letter_number\":\"Nomor Surat\",\"date\":\"Tanggal Surat\",\"manager_name\":\"Nama Manager\",\"handler_name\":\"Nama Handler\",\"project_name\":\"Nama Proyek\",\"task_description\":\"Deskripsi Tugas\",\"start_date\":\"Tanggal Mulai\",\"end_date\":\"Tanggal Selesai\",\"location\":\"Lokasi\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` VALUES (4, 'Project Brief', 'project', 'Template ringkasan project untuk klien', 'PROJECT BRIEF\n\nWidianto & Sumbogo - Firma Akuntansi\n\n=== INFORMASI PROJECT ===\n\nNama Project: {{PROJECT_NAME}}\nKlien: {{CLIENT_NAME}}\nManager: {{MANAGER_NAME}}\nPeriode: {{START_DATE}} - {{END_DATE}}\n\n=== OBJEKTIF ===\n{{OBJECTIVES}}\n\n=== RUANG LINGKUP ===\n{{SCOPE}}\n\n=== DELIVERABLES ===\n{{DELIVERABLES}}\n\n=== TIMELINE ===\n{{TIMELINE}}\n\n=== TIM PROJECT ===\n{{TEAM_MEMBERS}}\n\nTanggal dibuat: {{DATE}}', '{\"project_name\":\"Nama Proyek\",\"client_name\":\"Nama Klien\",\"manager_name\":\"Nama Manager\",\"start_date\":\"Tanggal Mulai\",\"end_date\":\"Tanggal Selesai\",\"objectives\":\"Tujuan Proyek\",\"scope\":\"Ruang Lingkup\",\"deliverables\":\"Hasil yang Diharapkan\",\"timeline\":\"Timeline\",\"team_members\":\"Anggota Tim\",\"date\":\"Tanggal\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` VALUES (5, 'Notulen Rapat', 'general', 'Template notulen rapat dengan klien atau internal', 'NOTULEN RAPAT\n\nWidianto & Sumbogo\n\nTanggal: {{DATE}}\nWaktu: {{TIME}}\nLokasi: {{LOCATION}}\nProject: {{PROJECT_NAME}}\n\n=== PESERTA ===\n{{ATTENDEES}}\n\n=== AGENDA ===\n{{AGENDA}}\n\n=== PEMBAHASAN ===\n{{DISCUSSION}}\n\n=== KEPUTUSAN ===\n{{DECISIONS}}\n\n=== ACTION ITEMS ===\n{{ACTION_ITEMS}}\n\n=== RAPAT SELANJUTNYA ===\n{{NEXT_MEETING}}\n\nNotulis: {{MANAGER_NAME}}', '{\"date\":\"Tanggal\",\"time\":\"Waktu\",\"location\":\"Lokasi\",\"project_name\":\"Nama Proyek\",\"attendees\":\"Peserta Rapat\",\"agenda\":\"Agenda\",\"discussion\":\"Pembahasan\",\"decisions\":\"Keputusan\",\"action_items\":\"Action Items\",\"next_meeting\":\"Rapat Selanjutnya\",\"manager_name\":\"Nama Notulis\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `document_templates` VALUES (6, 'Laporan Status Project', 'project', 'Template laporan perkembangan project', 'LAPORAN STATUS PROJECT\n\nWidianto & Sumbogo\n\nProject: {{PROJECT_NAME}}\nPeriode Laporan: {{PERIOD}}\nTanggal: {{DATE}}\nDibuat oleh: {{MANAGER_NAME}}\n\n=== STATUS KESELURUHAN ===\nStatus: {{OVERALL_STATUS}}\nProgress: {{PROGRESS_PERCENTAGE}}%\n\n=== PENCAPAIAN PERIODE INI ===\n{{ACHIEVEMENTS}}\n\n=== KENDALA ===\n{{ISSUES}}\n\n=== RENCANA SELANJUTNYA ===\n{{NEXT_STEPS}}\n\n=== CATATAN ===\n{{NOTES}}', '{\"project_name\":\"Nama Proyek\",\"period\":\"Periode\",\"date\":\"Tanggal\",\"manager_name\":\"Nama Manager\",\"overall_status\":\"Status (On Track\\/At Risk\\/Delayed)\",\"progress_percentage\":\"Persentase Progress\",\"achievements\":\"Pencapaian\",\"issues\":\"Kendala\",\"next_steps\":\"Langkah Selanjutnya\",\"notes\":\"Catatan\"}', 'txt', 1, 1, '2026-05-21 05:14:28', '2026-05-21 05:14:28');

-- ----------------------------
-- Table structure for documents
-- ----------------------------
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_size` int NULL DEFAULT NULL,
  `uploaded_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `documents_project_id_foreign`(`project_id` ASC) USING BTREE,
  INDEX `documents_uploaded_by_foreign`(`uploaded_by` ASC) USING BTREE,
  INDEX `documents_created_at_idx`(`created_at` ASC) USING BTREE,
  CONSTRAINT `documents_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `documents_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of documents
-- ----------------------------
INSERT INTO `documents` VALUES (1, 1, 'Engagement Letter - PT Maju Bersama', 'engagement-letter-maju-bersama.pdf', 'documents/engagement-letter-maju-bersama.pdf', 'pdf', 245760, 1, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (2, 1, 'Neraca PT Maju Bersama 2025', 'neraca-maju-bersama-2025.xlsx', 'documents/neraca-maju-bersama-2025.xlsx', 'xlsx', 512000, 2, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (3, 1, 'Program Audit - PT Maju Bersama', 'program-audit-maju-bersama.pdf', 'documents/program-audit-maju-bersama.pdf', 'pdf', 389120, 3, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (4, 2, 'Laporan Laba Rugi CV Cahaya Niaga 2025', 'laba-rugi-cahaya-niaga-2025.xlsx', 'documents/laba-rugi-cahaya-niaga-2025.xlsx', 'xlsx', 430080, 3, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (5, 2, 'Bukti Potong PPh 23 - CV Cahaya Niaga', 'bukti-potong-pph23-cahaya-niaga.pdf', 'documents/bukti-potong-pph23-cahaya-niaga.pdf', 'pdf', 204800, 4, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (6, 4, 'Rekap Transaksi Januari 2026 - UD Karya Mandiri', 'rekap-jan-2026-karya-mandiri.xlsx', 'documents/rekap-jan-2026-karya-mandiri.xlsx', 'xlsx', 327680, 5, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (7, 4, 'Laporan Keuangan Feb 2026 - UD Karya Mandiri', 'lapkeu-feb-2026-karya-mandiri.pdf', 'documents/lapkeu-feb-2026-karya-mandiri.pdf', 'pdf', 614400, 5, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (8, 5, 'Laporan Review Yayasan Pendidikan Harapan 2025', 'laporan-review-yayasan-harapan-2025.pdf', 'documents/laporan-review-yayasan-harapan-2025.pdf', 'pdf', 819200, 1, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (9, 5, 'Kertas Kerja Review - Yayasan Harapan', 'kkr-yayasan-harapan.xlsx', 'documents/kkr-yayasan-harapan.xlsx', 'xlsx', 655360, 4, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (10, 7, 'Daftar Transaksi Afiliasi 2025 - PT Global Teknindo', 'transaksi-afiliasi-global-teknindo-2025.xlsx', 'documents/transaksi-afiliasi-global-teknindo-2025.xlsx', 'xlsx', 491520, 4, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (11, 8, 'Laporan Audit Internal - KSP Sejahtera 2025', 'laporan-audit-ksp-sejahtera-2025.pdf', 'documents/laporan-audit-ksp-sejahtera-2025.pdf', 'pdf', 921600, 1, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `documents` VALUES (12, 8, 'Temuan dan Rekomendasi - KSP Sejahtera', 'temuan-rekomendasi-ksp-sejahtera.pdf', 'documents/temuan-rekomendasi-ksp-sejahtera.pdf', 'pdf', 368640, 2, '2026-05-21 05:14:27', '2026-05-21 05:14:27');

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (1, '2014_10_12_000000_create_users_table', 1);
INSERT INTO `migrations` VALUES (2, '2014_10_12_100000_create_password_reset_tokens_table', 1);
INSERT INTO `migrations` VALUES (3, '2019_08_19_000000_create_failed_jobs_table', 1);
INSERT INTO `migrations` VALUES (4, '2019_12_14_000001_create_personal_access_tokens_table', 1);
INSERT INTO `migrations` VALUES (5, '2026_04_08_054027_create_projects_table', 1);
INSERT INTO `migrations` VALUES (6, '2026_04_08_054034_create_documents_table', 1);
INSERT INTO `migrations` VALUES (7, '2026_04_08_054034_create_tasks_table', 1);
INSERT INTO `migrations` VALUES (8, '2026_04_08_073000_create_notifications_table', 1);
INSERT INTO `migrations` VALUES (9, '2026_04_08_080000_create_document_templates_table', 1);
INSERT INTO `migrations` VALUES (10, '2026_04_08_090000_add_is_active_to_users_table', 1);
INSERT INTO `migrations` VALUES (11, '2026_04_08_100000_create_activities_table', 1);
INSERT INTO `migrations` VALUES (12, '2026_04_08_200000_add_indexes_to_all_tables', 1);
INSERT INTO `migrations` VALUES (13, '2026_04_19_000001_add_client_name_to_projects_table', 1);
INSERT INTO `migrations` VALUES (14, '2026_04_19_044941_add_client_name_to_projects_table', 1);
INSERT INTO `migrations` VALUES (15, '2026_04_19_120000_create_project_handlers_table', 1);

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `notifications_user_read_idx`(`user_id` ASC, `is_read` ASC) USING BTREE,
  INDEX `notifications_created_at_idx`(`created_at` ASC) USING BTREE,
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO `notifications` VALUES (1, 2, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Pengujian Substantif Kas dan Bank', '{\"task_id\":3,\"project_id\":1}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (2, 2, 'deadline_approaching', 'Tenggat Waktu Mendekat', 'Tugas \'Pengujian Substantif Kas dan Bank\' jatuh tempo pada 2026-04-10 00:00:00', '{\"task_id\":3,\"due_date\":\"2026-04-10T00:00:00.000000Z\"}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (3, 2, 'document_uploaded', 'Dokumen Baru Diunggah', 'Dokumen baru telah diunggah ke proyek Audit PT Maju Bersama 2025', '{\"project_id\":1}', 1, '2026-05-21 02:14:28', '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (4, 3, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Pengisian Formulir SPT 1771', '{\"task_id\":9}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (5, 3, 'status_changed', 'Status Tugas Diperbarui', 'Status tugas \"Pengisian Formulir SPT 1771\" diubah menjadi In Progress', '{\"old_status\":\"todo\",\"new_status\":\"in_progress\"}', 1, '2026-05-21 00:14:28', '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (6, 4, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Pengujian Substantif Piutang dan Persediaan', '{\"task_id\":4}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (7, 4, 'deadline_approaching', 'Tenggat Waktu Mendekat', 'Pengujian Substantif Piutang harus selesai sebelum 20 April 2026', '{\"due_date\":\"2026-04-20\"}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (8, 5, 'task_assigned', 'Tugas Baru Ditetapkan', 'Anda ditugaskan untuk: Penyusunan dan Review Laporan Audit', '{\"task_id\":6}', 0, NULL, '2026-05-21 05:14:28', '2026-05-21 05:14:28');
INSERT INTO `notifications` VALUES (9, 5, 'document_uploaded', 'Dokumen Baru Diunggah', 'Dokumen \"Laporan Keuangan Feb 2026\" diunggah ke UD Karya Mandiri', '{\"project_id\":4}', 1, '2026-05-20 05:14:28', '2026-05-21 05:14:28', '2026-05-21 05:14:28');

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `personal_access_tokens_token_unique`(`token` ASC) USING BTREE,
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type` ASC, `tokenable_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of personal_access_tokens
-- ----------------------------
INSERT INTO `personal_access_tokens` VALUES (1, 'App\\Models\\User', 1, 'auth-token', '60f242862a8027273d3b2fdc05f154ae9602730c7ed8a1a00696ab72870a718f', '[\"*\"]', '2026-05-21 05:30:14', NULL, '2026-05-21 05:22:13', '2026-05-21 05:30:14');

-- ----------------------------
-- Table structure for project_handlers
-- ----------------------------
DROP TABLE IF EXISTS `project_handlers`;
CREATE TABLE `project_handlers`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_handlers_project_id_user_id_unique`(`project_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `project_handlers_user_id_foreign`(`user_id` ASC) USING BTREE,
  CONSTRAINT `project_handlers_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `project_handlers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_handlers
-- ----------------------------
INSERT INTO `project_handlers` VALUES (1, 9, 2, NULL, NULL);
INSERT INTO `project_handlers` VALUES (2, 9, 5, NULL, NULL);
INSERT INTO `project_handlers` VALUES (3, 10, 3, NULL, NULL);
INSERT INTO `project_handlers` VALUES (4, 11, 4, NULL, NULL);

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `client_id` bigint UNSIGNED NULL DEFAULT NULL,
  `client_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `manager_id` bigint UNSIGNED NOT NULL,
  `status` enum('pending','in_progress','completed','on_hold') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `start_date` date NULL DEFAULT NULL,
  `due_date` date NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `projects_client_id_foreign`(`client_id` ASC) USING BTREE,
  INDEX `projects_manager_id_foreign`(`manager_id` ASC) USING BTREE,
  INDEX `projects_status_idx`(`status` ASC) USING BTREE,
  INDEX `projects_created_at_idx`(`created_at` ASC) USING BTREE,
  CONSTRAINT `projects_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `projects_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES (1, 'Audit Laporan Keuangan – PT Maju Bersama 2025', 'Pemeriksaan dan audit laporan keuangan tahunan PT Maju Bersama untuk periode fiskal 2025. Mencakup neraca, laporan laba rugi, dan catatan atas laporan keuangan.', 2, NULL, 1, 'in_progress', '2026-02-01', '2026-05-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (2, 'Penyusunan SPT Tahunan – CV Cahaya Niaga', 'Penyusunan dan pelaporan Surat Pemberitahuan (SPT) Tahunan Pajak Penghasilan Badan CV Cahaya Niaga tahun pajak 2025.', 3, NULL, 1, 'in_progress', '2026-01-15', '2026-04-30', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (3, 'Konsultasi Restrukturisasi Pajak – PT Sinar Abadi', 'Konsultasi dan perencanaan pajak terkait rencana restrukturisasi bisnis PT Sinar Abadi, termasuk analisis dampak pajak atas merger dan akuisisi aset.', 4, NULL, 1, 'pending', '2026-05-01', '2026-07-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (4, 'Pembukuan Bulanan – UD Karya Mandiri', 'Pengelolaan pembukuan bulanan UD Karya Mandiri meliputi jurnal transaksi, rekonsiliasi bank, dan penyusunan laporan keuangan ringkas setiap bulan.', 5, NULL, 1, 'in_progress', '2026-01-01', '2026-12-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (5, 'Review Laporan Keuangan – Yayasan Pendidikan Harapan', 'Review independen atas laporan keuangan Yayasan Pendidikan Harapan untuk keperluan pelaporan kepada donatur dan badan pengawas.', 2, NULL, 1, 'completed', '2025-11-01', '2026-01-31', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (6, 'Due Diligence Keuangan – Akuisisi PT Nusantara Logistik', 'Pelaksanaan uji tuntas keuangan (financial due diligence) dalam rangka rencana akuisisi PT Nusantara Logistik oleh investor strategis.', 3, NULL, 1, 'pending', '2026-06-01', '2026-08-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (7, 'Penyusunan Laporan Transfer Pricing – PT Global Teknindo', 'Penyusunan dokumentasi transfer pricing sesuai Peraturan Dirjen Pajak PER-32/PJ/2011 untuk transaksi afiliasi PT Global Teknindo tahun 2025.', 4, NULL, 1, 'on_hold', '2026-03-01', '2026-06-30', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (8, 'Audit Internal – Koperasi Simpan Pinjam Sejahtera', 'Audit internal atas pengelolaan keuangan dan operasional Koperasi Simpan Pinjam Sejahtera untuk periode Januari–Desember 2025.', 5, NULL, 1, 'completed', '2025-12-01', '2026-02-28', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `projects` VALUES (9, 'Calendar Demo - Deadline Sprint A', 'Project demo kalender dengan milestone dekat deadline.', 2, 'Rina Sumbogo', 1, 'in_progress', '2026-05-11', '2026-05-24', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `projects` VALUES (10, 'Calendar Demo - Deadline Sprint B', 'Project demo kalender dengan due date minggu depan.', 3, 'Agus Haryanto', 1, 'pending', '2026-05-16', '2026-05-28', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `projects` VALUES (11, 'Calendar Demo - Overdue Rescue', 'Project demo kalender yang sudah melewati deadline.', 4, 'Dina Kusumawati', 1, 'in_progress', '2026-05-01', '2026-05-19', '2026-05-21 05:18:15', '2026-05-21 05:18:15');

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `assigned_to` bigint UNSIGNED NULL DEFAULT NULL,
  `status` enum('todo','in_progress','review','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `priority` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `due_date` date NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `tasks_status_idx`(`status` ASC) USING BTREE,
  INDEX `tasks_priority_idx`(`priority` ASC) USING BTREE,
  INDEX `tasks_due_date_idx`(`due_date` ASC) USING BTREE,
  INDEX `tasks_created_at_idx`(`created_at` ASC) USING BTREE,
  INDEX `tasks_project_status_idx`(`project_id` ASC, `status` ASC) USING BTREE,
  INDEX `tasks_assigned_status_idx`(`assigned_to` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `tasks_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tasks
-- ----------------------------
INSERT INTO `tasks` VALUES (1, 1, 'Pengumpulan Dokumen Pendukung Klien', 'Minta dan verifikasi dokumen dari klien: buku besar, mutasi bank, bukti transaksi, dan saldo awal periode.', 2, 'completed', 'high', '2026-02-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (2, 1, 'Analisis Risiko dan Perencanaan Audit', 'Identifikasi area berisiko tinggi, tentukan materialitas, dan susun program audit.', 3, 'completed', 'high', '2026-02-28', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (3, 1, 'Pengujian Substantif Kas dan Bank', 'Rekonsiliasi bank, konfirmasi saldo bank, dan pengujian penerimaan serta pengeluaran kas.', 2, 'in_progress', 'high', '2026-04-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (4, 1, 'Pengujian Substantif Piutang dan Persediaan', 'Konfirmasi piutang eksternal, stock opname, dan pengujian cut-off transaksi.', 4, 'in_progress', 'high', '2026-04-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (5, 1, 'Penyusunan Kertas Kerja Audit', 'Dokumentasikan seluruh prosedur audit, temuan, dan kesimpulan dalam kertas kerja standar.', 3, 'todo', 'medium', '2026-05-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (6, 1, 'Penyusunan dan Review Laporan Audit', 'Susun draf laporan auditor independen, review oleh manajer, dan finalisasi opini.', 5, 'todo', 'high', '2026-05-25', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (7, 2, 'Rekap Penghasilan dan Biaya Tahun 2025', 'Kumpulkan dan rekap seluruh penghasilan bruto dan biaya fiskal yang diperkenankan untuk CV Cahaya Niaga.', 3, 'completed', 'high', '2026-02-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (8, 2, 'Koreksi Fiskal dan Perhitungan PPh Badan', 'Lakukan koreksi fiskal positif/negatif, hitung PKP, dan kalkulasi PPh Badan terutang.', 4, 'completed', 'high', '2026-03-01', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (9, 2, 'Pengisian Formulir SPT 1771', 'Isi formulir SPT Tahunan PPh Badan 1771 beserta lampiran-lampirannya secara lengkap dan benar.', 3, 'in_progress', 'high', '2026-04-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (10, 2, 'Review Final dan Pelaporan ke KPP', 'Review akhir dokumen SPT oleh manager, tanda tangan klien, dan e-filing ke Kantor Pelayanan Pajak.', 5, 'todo', 'high', '2026-04-28', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (11, 3, 'FGD Awal dengan Manajemen PT Sinar Abadi', 'Pertemuan awal untuk memahami rencana restrukturisasi, entitas terlibat, dan timeline yang diinginkan klien.', 4, 'todo', 'high', '2026-05-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (12, 3, 'Analisis Dampak Pajak Restrukturisasi', 'Analisis konsekuensi PPh atas pengalihan aset, PPn BM, dan potensi pajak daerah dalam skema merger.', 2, 'todo', 'high', '2026-06-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (13, 3, 'Penyusunan Memo Konsultasi Pajak', 'Buat memo tertulis berisi rekomendasi struktur pajak yang optimal dan risiko yang perlu dimitigasi.', 4, 'todo', 'medium', '2026-07-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (14, 4, 'Jurnal Transaksi Januari-Maret 2026', 'Input dan verifikasi seluruh jurnal transaksi pembelian, penjualan, dan biaya umum triwulan I.', 5, 'completed', 'medium', '2026-04-05', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (15, 4, 'Rekonsiliasi Bank Maret 2026', 'Rekonsiliasi mutasi rekening bank vs catatan pembukuan per 31 Maret 2026.', 5, 'in_progress', 'medium', '2026-04-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (16, 4, 'Laporan Keuangan Triwulan I 2026', 'Susun neraca saldo, laporan laba rugi, dan arus kas untuk periode Januari-Maret 2026.', 2, 'todo', 'medium', '2026-04-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (17, 5, 'Permintaan dan Penelaahan Dokumen Yayasan', 'Kumpulkan laporan keuangan yayasan, risalah rapat, dan dokumen anggaran.', 2, 'completed', 'medium', '2025-11-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (18, 5, 'Prosedur Review Analitis', 'Bandingkan laporan keuangan tahun berjalan vs tahun lalu, analisis rasio dan tren.', 3, 'completed', 'medium', '2025-12-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (19, 5, 'Penerbitan Laporan Review', 'Susun dan terbitkan laporan hasil review disertai simpulan akuntan.', 4, 'completed', 'high', '2026-01-25', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (20, 6, 'Perencanaan Ruang Lingkup Due Diligence', 'Tentukan cakupan DD: keuangan, pajak, hukum, dan operasional serta buat data request list.', 3, 'todo', 'high', '2026-06-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (21, 6, 'Analisis Laporan Keuangan 3 Tahun Terakhir', 'Review dan analisis laporan keuangan PT Nusantara Logistik 2023-2025: kualitas aset, utang, dan profitabilitas.', 4, 'todo', 'high', '2026-07-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (22, 6, 'Penyusunan Laporan Due Diligence', 'Kompilasi seluruh temuan menjadi laporan DD komprehensif untuk investor.', 5, 'todo', 'high', '2026-08-10', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (23, 7, 'Identifikasi Transaksi Afiliasi 2025', 'Identifikasi dan klasifikasikan seluruh transaksi dengan pihak berelasi yang wajib didokumentasikan.', 4, 'completed', 'high', '2026-03-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (24, 7, 'Analisis Comparability dan Pemilihan Metode TP', 'Lakukan analisis keterbandingan dan pilih metode transfer pricing yang paling sesuai (CUP/RPM/CPM).', 2, 'todo', 'high', '2026-06-15', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (25, 8, 'Audit SPI (Sistem Pengendalian Internal)', 'Evaluasi efektivitas pengendalian internal atas perhimpunan simpanan dan penyaluran pinjaman.', 5, 'completed', 'high', '2025-12-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (26, 8, 'Pengujian Portofolio Pinjaman', 'Uji sampel pinjaman yang disalurkan, verifikasi kelengkapan dokumen, dan kualitas kolektibilitas.', 3, 'completed', 'high', '2026-01-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (27, 8, 'Penyusunan Laporan Audit Internal', 'Susun laporan audit internal beserta rekomendasi perbaikan kepada pengurus koperasi.', 2, 'completed', 'medium', '2026-02-20', '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `tasks` VALUES (28, 9, 'Calendar Demo - Final Review Draft', 'Final review dokumen untuk sprint A.', 2, 'in_progress', 'high', '2026-05-22', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `tasks` VALUES (29, 9, 'Calendar Demo - Upload Supporting Docs', 'Upload seluruh dokumen pendukung audit.', 5, 'todo', 'medium', '2026-05-23', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `tasks` VALUES (30, 10, 'Calendar Demo - Tax Reconciliation', 'Rekonsiliasi data pajak untuk sprint B.', 3, 'todo', 'high', '2026-05-25', '2026-05-21 05:18:15', '2026-05-21 05:18:15');
INSERT INTO `tasks` VALUES (31, 11, 'Calendar Demo - Resolve Overdue Findings', 'Perbaiki temuan yang sudah overdue.', 4, 'in_progress', 'high', '2026-05-20', '2026-05-21 05:19:10', '2026-05-21 05:19:10');
INSERT INTO `tasks` VALUES (32, 11, 'Calendar Demo - Escalation Report', 'Laporan eskalasi untuk task overdue.', 4, 'todo', 'high', '2026-05-22', '2026-05-21 05:19:10', '2026-05-21 05:19:10');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('manager','project_handler') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'project_handler',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_unique`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Widianto Prasetyo', 'manager@wspmt.com', NULL, '$2y$10$jXCceGYwv8QXWmPHteoZkuqzES3lfeciXflRO.PVU2eyFWSpu9Glq', 'manager', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` VALUES (2, 'Rina Sumbogo', 'rina@wspmt.com', NULL, '$2y$10$w.xG5Cx3Sx2PQ6/SeBqKF.saGmmxLA3TN/Q1/.Fw6jevDPqLJhsfe', 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` VALUES (3, 'Agus Haryanto', 'agus@wspmt.com', NULL, '$2y$10$JxsDZwEFFp06MREQVnOFd.B5E7fd5QUQgphjR0vN5nEmqAOOGfXk6', 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` VALUES (4, 'Dina Kusumawati', 'dina@wspmt.com', NULL, '$2y$10$7WYMQL.jWZ3NZrnl1Gnmvucxe7c8FbsLgKjviAqprSsdIlUffoRXi', 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');
INSERT INTO `users` VALUES (5, 'Reza Firmansyah', 'reza@wspmt.com', NULL, '$2y$10$b.4KASNhsX5OBlBWX/hhK.Hy41L4eew8EWwlMApkyCbYrnaxqQ6Ja', 'project_handler', 1, NULL, '2026-05-21 05:14:27', '2026-05-21 05:14:27');

SET FOREIGN_KEY_CHECKS = 1;
