-- ====================================================================
--  Cunlink 数据库建表脚本
--  使用说明：以下每段 SQL 都是「单独一条」，请逐段复制到 D1 Console
--  的输入框，点击「执行」，成功后再复制下一段。
--  如果某段执行报错，请把错误信息截图发给我。
-- ====================================================================

-- ==================== 开始建表 ====================

-- 【第 1 步】创建链接表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS links ( id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, label TEXT, created_at INTEGER NOT NULL, expires_at INTEGER, created_via TEXT DEFAULT 'app', created_by TEXT DEFAULT 'anonymous' );

-- 【第 2 步】创建短码表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS slugs ( link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE, slug TEXT NOT NULL PRIMARY KEY, is_custom INTEGER NOT NULL DEFAULT 0, is_primary INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, disabled_at INTEGER );

-- 【第 3 步】创建点击记录表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS clicks ( id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL REFERENCES slugs(slug) ON DELETE CASCADE, clicked_at INTEGER NOT NULL, referrer TEXT, referrer_host TEXT, country TEXT, region TEXT, city TEXT, device_type TEXT, os TEXT, browser TEXT, language TEXT, link_mode TEXT DEFAULT 'link', channel TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT, user_agent TEXT, is_bot INTEGER DEFAULT 0, visitor_fp TEXT, is_self_referrer INTEGER DEFAULT 0 );

-- 【第 4 步】创建设置表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS settings ( identity TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY (identity, key) );

-- 【第 5 步】创建 API 密钥表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS api_keys ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, key_prefix TEXT NOT NULL, key_hash TEXT NOT NULL UNIQUE, scope TEXT NOT NULL, created_at INTEGER NOT NULL, last_used_at INTEGER, identity TEXT NOT NULL DEFAULT 'anonymous' );

-- 【第 6 步】创建分组表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS bundles ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, icon TEXT, accent TEXT NOT NULL DEFAULT 'orange' CHECK (accent IN ('orange','red','green','blue','purple')), archived_at INTEGER, created_via TEXT DEFAULT 'app', created_by TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL );

-- 【第 7 步】创建分组-链接关联表
-- 复制下面这一整行，到 D1 Console 执行
CREATE TABLE IF NOT EXISTS bundle_links ( bundle_id INTEGER NOT NULL REFERENCES bundles(id) ON DELETE CASCADE, link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE, added_at INTEGER NOT NULL, PRIMARY KEY (bundle_id, link_id) );

-- ==================== 插入默认数据 ====================

-- 【第 8 步】插入默认设置
-- 复制下面这一整行，到 D1 Console 执行
INSERT OR IGNORE INTO settings (identity, key, value) VALUES ('anonymous', 'slug_default_length', '3');

-- ==================== 创建索引 ====================

-- 【第 9 步】创建索引（共 14 条，必须逐条执行）
-- 复制下面第一行 → 执行 → 再复制第二行 → 执行……以此类推

CREATE INDEX IF NOT EXISTS idx_slugs_link_id ON slugs(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_slug ON clicks(slug);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_clicks_country ON clicks(country);
CREATE INDEX IF NOT EXISTS idx_clicks_link_mode ON clicks(link_mode);
CREATE INDEX IF NOT EXISTS idx_clicks_referrer_host ON clicks(referrer_host);
CREATE INDEX IF NOT EXISTS idx_clicks_os ON clicks(os);
CREATE INDEX IF NOT EXISTS idx_clicks_visitor_fp ON clicks(visitor_fp);
CREATE INDEX IF NOT EXISTS idx_clicks_is_self_referrer ON clicks(is_self_referrer);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_identity ON api_keys(identity);
CREATE INDEX IF NOT EXISTS idx_bundles_created_by ON bundles(created_by);
CREATE INDEX IF NOT EXISTS idx_bundles_archived_at ON bundles(archived_at);
CREATE INDEX IF NOT EXISTS idx_bundle_links_link_id ON bundle_links(link_id);
