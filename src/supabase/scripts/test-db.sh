#!/usr/bin/env bash
# Tests de la base (isolation des entreprises, ajout seul, crochet de connexion).
# Crée une base PostgreSQL jetable, y applique l'imitation de Supabase puis les migrations, et lance les tests SQL.
# Usage : pnpm test:db   (depuis src/)   — nécessite PostgreSQL 16 ou plus (initdb, pg_ctl, psql).
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
[ -x "$PGBIN/initdb" ] || PGBIN="$(dirname "$(command -v initdb)")"
WORK="$(mktemp -d)"
PORT="${PGPORT_TEST:-54329}"
RUN=()
if [ "$(id -u)" = "0" ]; then RUN=(runuser -u postgres --); chown postgres "$WORK"; fi
cleanup() { "${RUN[@]}" "$PGBIN/pg_ctl" -D "$WORK/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$WORK"; }
trap cleanup EXIT

"${RUN[@]}" "$PGBIN/initdb" -D "$WORK/data" -U supabase_admin --auth=trust -E UTF8 --locale=C.UTF-8 >/dev/null
"${RUN[@]}" "$PGBIN/pg_ctl" -D "$WORK/data" -o "-p $PORT -k $WORK -c listen_addresses=''" -l "$WORK/log" -w start >/dev/null

PSQL=(psql -X -q -v ON_ERROR_STOP=1 -h "$WORK" -p "$PORT" -d postgres)
"${PSQL[@]}" -U supabase_admin -f "$HERE/tests/00_supabase_local.sql"
for m in "$HERE"/migrations/*.sql; do
  echo "Migration : $(basename "$m")"
  "${PSQL[@]}" -U postgres -1 -f "$m"           # appliquée par « postgres » (non superutilisateur), comme sur Supabase
done
status=0
for t in "$HERE"/tests/[1-9]*.sql; do
  if "${PSQL[@]}" -U supabase_admin -o /dev/null -f "$t"; then echo "  ✓ $(basename "$t")"; else echo "  ✗ $(basename "$t")"; status=1; fi
done
exit $status
