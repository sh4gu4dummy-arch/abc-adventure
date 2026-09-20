#!/bin/sh
set -eu
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Need Node.js 22+ from https://nodejs.org"; exit 1; }
if [ ! -d node_modules ]; then
  echo "First run: npm install..."
  npm install
fi
echo "Open http://localhost:8080"
npm run dev
