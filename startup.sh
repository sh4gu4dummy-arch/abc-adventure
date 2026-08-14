#!/bin/sh
set -eu
cd /workspace
# Imagine / grok-files mount goes stale; remount so clips can persist.
if [ -x /workspace/scripts/ensure-imagine-artifacts.sh ]; then
  sh /workspace/scripts/ensure-imagine-artifacts.sh >/tmp/imagine-artifacts.log 2>&1 || true
fi
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
