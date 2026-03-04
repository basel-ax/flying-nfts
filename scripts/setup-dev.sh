#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

echo "== Local dev setup: clean install with legacy peer deps =="
echo "Removing node_modules..."
rm -rf node_modules

echo "Cleaning npm cache (verify)..."
npm cache verify || true

echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "Starting dev server (background)..."
npm run dev &
DEV_PID=$!
echo "Dev server started in background (PID: $DEV_PID)."

# Wait for the server to be ready (simple readiness probe)
WAIT_MAX=${WAIT_MAX:-60}
SLEEP_SEC=${SLEEP_SEC:-1}
echo "Waiting up to ${WAIT_MAX}s for server to respond on http://localhost:3000/api/healthz ..."
SUCCESS=0
for ((i=0; i<WAIT_MAX; i++)); do
  if curl -sSf http://localhost:3000/api/healthz > /dev/null 2>&1; then
    echo "Dev server is ready."
    SUCCESS=1
    break
  fi
  sleep "$SLEEP_SEC"
done
if [ $SUCCESS -eq 0 ]; then
  echo "Warning: Dev server did not become ready within ${WAIT_MAX}s. Continuing with background process."
fi

echo "To stop the server: kill $DEV_PID"

exit 0
