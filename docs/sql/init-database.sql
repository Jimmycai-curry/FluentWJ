-- ============================================================
-- FluentWJ 数据库初始化脚本
-- 生成时间: 2026-02-19
-- 数据库: PostgreSQL
-- ============================================================

-- 如果数据库不存在，需要先创建数据库（在 psql 中以超级用户执行）
-- CREATE DATABASE fluentwj;

-- 连接到 fluentwj 数据库后执行以下语句

-- ============================================================
-- 1. 启用 UUID 扩展（PostgreSQL 需要）
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. 用户表 (users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(100),
    avatar          VARCHAR(500),
    password_hash   TEXT,
    role            SMALLINT DEFAULT 1,          -- 0: 管理员, 1: 普通用户
    status          SMALLINT DEFAULT 1,          -- 0: 封禁, 1: 正常
    last_login_ip   VARCHAR(45),
    last_login_time TIMESTAMPTZ(6),
    created_time    TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_time    TIMESTAMPTZ(6) DEFAULT NOW()
);

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- 用户表注释
COMMENT ON TABLE users IS '用户基本信息表';
COMMENT ON COLUMN users.id IS '用户唯一标识 UUID';
COMMENT ON COLUMN users.phone IS '手机号（唯一）';
COMMENT ON COLUMN users.name IS '用户昵称/显示名称（可选）';
COMMENT ON COLUMN users.avatar IS '用户头像URL（可选）';
COMMENT ON COLUMN users.password_hash IS '密码哈希值（可选，首次验证码登录时可为空）';
COMMENT ON COLUMN users.role IS '用户角色：0=管理员, 1=普通用户';
COMMENT ON COLUMN users.status IS '账户状态：0=封禁, 1=正常';
COMMENT ON COLUMN users.last_login_ip IS '最后登录IP';
COMMENT ON COLUMN users.last_login_time IS '最后登录时间';

-- ============================================================
-- 3. 审计日志表 (audit_logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL,
    user_phone        VARCHAR(20),
    user_ip           VARCHAR(45) NOT NULL,
    scene             VARCHAR(50),
    tone              VARCHAR(50),
    input_prompt      TEXT NOT NULL,
    output_content    TEXT NOT NULL,
    model_name        VARCHAR(50),
    audit_token       TEXT,                        -- 零宽水印/溯源标识
    content_hash      VARCHAR(64),                 -- AI生成内容（含水印）的 SHA-256 哈希值，用于内容防篡改验证
    status            SMALLINT DEFAULT 1,          -- 0: 审核拦截, 1: 通过, 2: 系统拦截
    is_sensitive      BOOLEAN DEFAULT FALSE,
    external_audit_id VARCHAR(100),
    created_time      TIMESTAMPTZ(6) DEFAULT NOW()
);

-- 审计日志表索引
CREATE INDEX IF NOT EXISTS idx_audit_logs_status_time ON audit_logs(status, created_time);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- 审计日志表注释
COMMENT ON TABLE audit_logs IS 'AI邮件生成审计存证表';
COMMENT ON COLUMN audit_logs.id IS '日志唯一标识 UUID';
COMMENT ON COLUMN audit_logs.user_id IS '用户ID';
COMMENT ON COLUMN audit_logs.user_phone IS '冗余手机号，方便管理后台检索';
COMMENT ON COLUMN audit_logs.user_ip IS '产生行为时的用户IP（合规必填）';
COMMENT ON COLUMN audit_logs.scene IS '业务场景';
COMMENT ON COLUMN audit_logs.tone IS '语气';
COMMENT ON COLUMN audit_logs.input_prompt IS '用户原始输入';
COMMENT ON COLUMN audit_logs.output_content IS 'AI生成文本';
COMMENT ON COLUMN audit_logs.model_name IS '底层模型名称（如 DeepSeek-V3）';
COMMENT ON COLUMN audit_logs.audit_token IS '零宽水印/溯源标识';
COMMENT ON COLUMN audit_logs.content_hash IS 'AI生成内容（含水印）的 SHA-256 哈希值（64位十六进制），用于内容防篡改验证';
COMMENT ON COLUMN audit_logs.status IS '审核状态：0=审核拦截/手动标记违规, 1=通过, 2=系统拦截';
COMMENT ON COLUMN audit_logs.is_sensitive IS '是否命中外部审核API的敏感词';
COMMENT ON COLUMN audit_logs.external_audit_id IS '外部审核接口的RequestID';

-- ============================================================
-- 4. 邮件历史记录表 (mail_histories)
-- ============================================================
CREATE TABLE IF NOT EXISTS mail_histories (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL,
    audit_log_id   UUID,
    scene          VARCHAR(50),
    tone           VARCHAR(50),
    recipient_name VARCHAR(100),
    recipient_role VARCHAR(200),
    sender_name    VARCHAR(100),
    core_points    TEXT,
    mail_content   TEXT NOT NULL,
    is_favorite    BOOLEAN DEFAULT FALSE,
    is_deleted     BOOLEAN DEFAULT FALSE,
    created_time   TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_time   TIMESTAMPTZ(6) DEFAULT NOW()
);

-- 邮件历史记录表索引
CREATE INDEX IF NOT EXISTS idx_mail_histories_created_time ON mail_histories(created_time);
CREATE INDEX IF NOT EXISTS idx_mail_histories_user_id ON mail_histories(user_id);

-- 邮件历史记录表注释
COMMENT ON TABLE mail_histories IS '邮件生成历史记录表';
COMMENT ON COLUMN mail_histories.id IS '记录唯一标识 UUID';
COMMENT ON COLUMN mail_histories.user_id IS '用户ID';
COMMENT ON COLUMN mail_histories.audit_log_id IS '关联审计日志ID（合规溯源）';
COMMENT ON COLUMN mail_histories.recipient_name IS '收件人姓名';
COMMENT ON COLUMN mail_histories.recipient_role IS '收件人身份/职位';
COMMENT ON COLUMN mail_histories.sender_name IS '发件人姓名（可选）';
COMMENT ON COLUMN mail_histories.core_points IS '核心要点';
COMMENT ON COLUMN mail_histories.mail_content IS '生成的邮件正文内容';
COMMENT ON COLUMN mail_histories.is_favorite IS '是否收藏';
COMMENT ON COLUMN mail_histories.is_deleted IS '是否删除（软删除）';

-- ============================================================
-- 5. 反馈表 (feedbacks)
-- ============================================================
CREATE TABLE IF NOT EXISTS feedbacks (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL,
    log_id         UUID,
    type           VARCHAR(30) NOT NULL,          -- COMPLAINT, REPORT, SUGGESTION
    content        TEXT NOT NULL,
    status         SMALLINT DEFAULT 0,            -- 0: 待处理, 1: 已处理
    admin_note     TEXT,
    processed_time TIMESTAMPTZ(6),
    created_time   TIMESTAMPTZ(6) DEFAULT NOW()
);

-- 反馈表索引
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);

-- 反馈表注释
COMMENT ON TABLE feedbacks IS '投诉反馈与举报表';
COMMENT ON COLUMN feedbacks.id IS '反馈唯一标识 UUID';
COMMENT ON COLUMN feedbacks.user_id IS '用户ID';
COMMENT ON COLUMN feedbacks.log_id IS '关联的生成记录ID';
COMMENT ON COLUMN feedbacks.type IS '反馈类型：COMPLAINT=投诉, REPORT=举报, SUGGESTION=建议';
COMMENT ON COLUMN feedbacks.content IS '反馈内容';
COMMENT ON COLUMN feedbacks.status IS '处理状态：0=待处理, 1=已处理';
COMMENT ON COLUMN feedbacks.admin_note IS '管理员处理备注';
COMMENT ON COLUMN feedbacks.processed_time IS '处理时间';

-- ============================================================
-- 6. 管理员操作日志表 (admin_operation_logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_operation_logs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id     UUID NOT NULL,
    action_type  VARCHAR(50) NOT NULL,            -- BAN_USER, UNBAN_USER, PROCESS_FEEDBACK, etc.
    user_id      UUID,
    audit_id     UUID,
    detail       TEXT,
    ip           VARCHAR(45),
    created_time TIMESTAMPTZ(6) DEFAULT NOW()
);

-- 管理员操作日志表注释
COMMENT ON TABLE admin_operation_logs IS '管理员操作审计表';
COMMENT ON COLUMN admin_operation_logs.id IS '日志唯一标识 UUID';
COMMENT ON COLUMN admin_operation_logs.admin_id IS '管理员ID';
COMMENT ON COLUMN admin_operation_logs.action_type IS '操作类型：BAN_USER, UNBAN_USER, CREATE_USER, PROCESS_FEEDBACK, MARK_VIOLATION 等';
COMMENT ON COLUMN admin_operation_logs.user_id IS '操作目标用户ID（可选）';
COMMENT ON COLUMN admin_operation_logs.audit_id IS '操作目标审计日志ID（可选）';
COMMENT ON COLUMN admin_operation_logs.detail IS '操作详情';
COMMENT ON COLUMN admin_operation_logs.ip IS '操作IP';

-- ============================================================
-- 7. 创建 Prisma 迁移记录表（如果使用 Prisma migrate）
-- ============================================================
CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id                      VARCHAR(36) PRIMARY KEY,
    checksum                VARCHAR(64) NOT NULL,
    finished_at             TIMESTAMPTZ(6),
    migration_name          VARCHAR(255) NOT NULL,
    logs                    TEXT,
    rolled_back_at          TIMESTAMPTZ(6),
    started_at              TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    applied_steps_count     INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- 完成！
-- ============================================================
-- 执行完毕后，所有表和索引已创建完成
-- ============================================================
