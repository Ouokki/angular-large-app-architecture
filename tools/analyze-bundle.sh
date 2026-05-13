#!/bin/bash
set -euo pipefail
echo "Building shell with source maps..."
pnpm exec nx build shell --configuration=production --source-map
echo "Analyzing bundle..."
pnpm exec source-map-explorer dist/apps/shell/main.*.js
