#!/usr/bin/env bash
# Resolves Cloudflare resource IDs (D1 databases, KV namespaces) from the API
# and patches wrangler.jsonc with the real values before deploy or migration.
#
# Before running this script:
#   1. Create your D1 database:   wrangler d1 create <your-db-name>
#   2. Update database_name in wrangler.jsonc to the name you chose
#   3. Create your KV namespace:  wrangler kv namespace create SLUG_KV
#   4. Update the KV namespace id in wrangler.jsonc to the returned ID
#
# Then run:  bash scripts/resolve-bindings.sh
#
# Requires: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in environment,
# or an active `wrangler login` session.

set -euo pipefail

CONFIG="wrangler.jsonc"
PLACEHOLDER_PATTERN="^YOUR_"

# --- D1 database ---

# Strip JSONC comments so we can parse with node
D1_NAME=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('./$CONFIG', 'utf8').replace(/\/\/[^\n]*/g, '');
  const cfg = JSON.parse(src);
  const d1 = cfg.d1_databases && cfg.d1_databases[0];
  if (d1 && d1.database_name) console.log(d1.database_name);
" 2>/dev/null || true)

if [ -z "$D1_NAME" ]; then
  echo "D1: no database_name found in config, skipping."
elif echo "$D1_NAME" | grep -q "$PLACEHOLDER_PATTERN"; then
  echo "D1: database_name is still a placeholder ('$D1_NAME')."
  echo "    Update it in $CONFIG to your actual D1 database name, then re-run this script."
else
  D1_ID=$(npx wrangler d1 list --json 2>/dev/null | node -e "
    let d = '';
    process.stdin.on('data', c => d += c);
    process.stdin.on('end', () => {
      const db = JSON.parse(d).find(x => x.name === '$D1_NAME');
      if (!db) { console.error('D1 database not found: $D1_NAME'); process.exit(1); }
      console.log(db.uuid);
    });
  ")

  # Inject database_id if not already present
  node -e "
    const fs = require('fs');
    let src = fs.readFileSync('./$CONFIG', 'utf8');
    if (!src.includes('\"database_id\"')) {
      src = src.replace(
        '\"database_name\": \"$D1_NAME\"',
        '\"database_name\": \"$D1_NAME\",\n      \"database_id\": \"$D1_ID\"'
      );
      fs.writeFileSync('./$CONFIG', src);
    }
  "
  echo "D1: $D1_NAME -> $D1_ID"
fi

# --- KV namespaces ---

# Parse all KV bindings whose id is still a placeholder (id includes "YOUR_")
KV_BINDINGS=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('./$CONFIG', 'utf8').replace(/\/\/[^\n]*/g, '');
  const cfg = JSON.parse(src);
  const kvs = cfg.kv_namespaces || [];
  kvs.filter(ns => /YOUR_/.test(ns.id)).forEach(ns => console.log(ns.binding));
" 2>/dev/null || true)

if [ -n "$KV_BINDINGS" ]; then
  echo "KV: the following namespaces still have placeholder IDs:"
  for BINDING in $KV_BINDINGS; do
    echo "    - $BINDING"
  done
  echo "    Create each namespace with \`wrangler kv namespace create <name>\`"
  echo "    and update its id in $CONFIG, then re-run this script."
else
  echo "KV: all namespace IDs appear to be set."
fi

echo "Bindings resolved."
