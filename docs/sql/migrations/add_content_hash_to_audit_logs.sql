-- ============================================================
-- 迁移：为 audit_logs 表新增 content_hash 字段
-- 执行时间: 2026-03-16
-- 背景: 满足算法备案要求，存储 AI 生成内容的 SHA-256 哈希值
--       用于事后验证内容是否在生成后被篡改
-- ============================================================

-- 新增 content_hash 列（可为空，允许历史记录没有哈希值）
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64);

-- 为新字段添加注释（说明用途）
COMMENT ON COLUMN audit_logs.content_hash IS 'AI生成内容（含水印）的 SHA-256 哈希值（64位十六进制），用于内容防篡改验证';

-- ============================================================
-- 验证：执行后可通过以下语句确认字段已添加
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name = 'audit_logs' AND column_name = 'content_hash';
-- ============================================================
