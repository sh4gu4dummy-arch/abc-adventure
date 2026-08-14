#!/bin/sh
# Keep /workspace/artifacts (grok-files FUSE) readable so Imagine can
# persist clips. The mount goes stale and returns EACCES even as root.
set -eu
ART=/workspace/artifacts
if ls "$ART" >/dev/null 2>&1; then
  exit 0
fi
echo "artifacts mount stale — remounting grok-files" >&2
grok-files unmount "$ART" >/dev/null 2>&1 || true
sleep 0.5
mkdir -p "$ART" 2>/dev/null || true
nohup grok-files mount / "$ART" --no-supervisor --ttl 30m \
  --content-cache memory --deny-delete off --occ known \
  --occ-conflict-policy retain >>/tmp/grok-files-mount.log 2>&1 &
# wait up to ~5s
i=0
while [ "$i" -lt 10 ]; do
  if ls "$ART" >/dev/null 2>&1; then
    echo "artifacts remounted"
    exit 0
  fi
  sleep 0.5
  i=$((i + 1))
done
echo "WARN: artifacts still not listable — use grok-files CLI" >&2
exit 1
