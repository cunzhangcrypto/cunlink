-- Migrate slugs to use slug text as primary key instead of a numeric id.
-- clicks.slug_id (integer FK) becomes clicks.slug (text FK).

-- 1. Save clicks with the slug text resolved before any schema changes.
CREATE TABLE clicks_backup AS
SELECT c.id, s.slug AS slug, c.clicked_at, c.referrer, c.referrer_host,
       c.country, c.region, c.city, c.device_type, c.os, c.browser,
       c.language, c.link_mode, c.channel,
       c.utm_source, c.utm_medium, c.utm_campaign, c.utm_term, c.utm_content,
       c.user_agent, c.is_bot
FROM clicks c
JOIN slugs s ON s.id = c.slug_id;

-- 2. Drop clicks (FK references slugs.id ON DELETE CASCADE).
DROP TABLE clicks;

-- 3. Recreate slugs with slug as the primary key.
CREATE TABLE slugs_new (
  link_id     INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL PRIMARY KEY,
  is_custom   INTEGER NOT NULL DEFAULT 0,
  is_primary  INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL,
  disabled_at INTEGER
);

INSERT INTO slugs_new (link_id, slug, is_custom, is_primary, created_at, disabled_at)
SELECT link_id, slug, is_custom, is_primary, created_at, disabled_at FROM slugs;

DROP TABLE slugs;
ALTER TABLE slugs_new RENAME TO slugs;

CREATE INDEX idx_slugs_link_id ON slugs(link_id);

-- 4. Recreate clicks with slug as a text foreign key.
CREATE TABLE clicks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL REFERENCES slugs(slug) ON DELETE CASCADE,
  clicked_at   INTEGER NOT NULL,
  referrer     TEXT,
  referrer_host TEXT,
  country      TEXT,
  region       TEXT,
  city         TEXT,
  device_type  TEXT,
  os           TEXT,
  browser      TEXT,
  language     TEXT,
  link_mode    TEXT DEFAULT 'link',
  channel      TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_term     TEXT,
  utm_content  TEXT,
  user_agent   TEXT,
  is_bot       INTEGER DEFAULT 0
);

INSERT INTO clicks (id, slug, clicked_at, referrer, referrer_host, country, region, city, device_type, os, browser, language, link_mode, channel, utm_source, utm_medium, utm_campaign, utm_term, utm_content, user_agent, is_bot)
SELECT id, slug, clicked_at, referrer, referrer_host, country, region, city, device_type, os, browser, language, link_mode, channel, utm_source, utm_medium, utm_campaign, utm_term, utm_content, user_agent, is_bot
FROM clicks_backup;

DROP TABLE clicks_backup;

CREATE INDEX idx_clicks_slug ON clicks(slug);
CREATE INDEX idx_clicks_clicked_at ON clicks(clicked_at);
CREATE INDEX idx_clicks_country ON clicks(country);
CREATE INDEX idx_clicks_link_mode ON clicks(link_mode);
CREATE INDEX idx_clicks_referrer_host ON clicks(referrer_host);
CREATE INDEX idx_clicks_os ON clicks(os);
