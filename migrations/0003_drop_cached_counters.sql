-- No-op: kept as a placeholder so the migrations table stays aligned on
-- deployments that applied the original version of this migration.
--
-- Previously this dropped `link_click_count` and `qr_click_count` from
-- the `slugs` table. In commit fe99e06 ("fix: remove legacy click count
-- columns from slugs schema") migration 0001_initial.sql was edited in
-- place to remove those columns from the baseline definition, which
-- meant any deployment coming up from a fresh D1 (for example CI, new
-- preview environments) hit `no such column` when this migration ran.
--
-- Fix: neutralize the body. Existing deployments already ran the
-- original version of this migration and are unaffected — Wrangler's
-- migrations tracker does not re-run applied migrations.

SELECT 1;
