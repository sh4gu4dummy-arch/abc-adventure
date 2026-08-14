#!/bin/sh
# Image-to-video via the official xAI API (returns a downloadable URL).
# Requires XAI_API_KEY in the environment (https://console.x.ai).
# Usage:
#   XAI_API_KEY=... sh scripts/imagine-i2v-api.sh /path/to/buddy.webp "prompt" out.mp4 [duration]
set -eu
IMG="${1:-}"
PROMPT="${2:-}"
OUT="${3:-/workspace/public/review/imagine/videos/out.mp4}"
DUR="${4:-10}"
API="${XAI_API_BASE:-https://api.x.ai}"

if [ -z "${XAI_API_KEY:-}" ]; then
  echo "XAI_API_KEY is not set. Create one at https://console.x.ai" >&2
  exit 2
fi
if [ -z "$IMG" ] || [ -z "$PROMPT" ]; then
  echo "usage: XAI_API_KEY=... $0 image.webp \"prompt\" [out.mp4] [duration]" >&2
  exit 2
fi

mkdir -p "$(dirname "$OUT")"
b64=$(python3 - << PY
import base64, pathlib, sys
p = pathlib.Path("$IMG")
raw = p.read_bytes()
mime = "image/webp" if p.suffix.lower()==".webp" else "image/png" if p.suffix.lower()==".png" else "image/jpeg"
print("data:%s;base64," % mime + base64.b64encode(raw).decode())
PY
)

body=$(python3 - << PY
import json
print(json.dumps({
  "model": "grok-imagine-video-1.5",
  "prompt": """$PROMPT""",
  "duration": int("$DUR"),
  "resolution": "480p",
  "image": """$b64""",
}))
PY
)

resp=$(curl -sS "$API/v1/videos/generations" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$body")
echo "$resp" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("request_id") or d)'
RID=$(echo "$resp" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("request_id",""))')
if [ -z "$RID" ]; then
  echo "no request_id: $resp" >&2
  exit 1
fi

i=0
while [ "$i" -lt 60 ]; do
  st=$(curl -sS "$API/v1/videos/$RID" -H "Authorization: Bearer $XAI_API_KEY")
  status=$(echo "$st" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("status",""))')
  echo "status $status"
  if [ "$status" = "done" ]; then
    url=$(echo "$st" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("video",{}).get("url",""))')
    curl -fL "$url" -o "$OUT"
    echo "saved $OUT"
    exit 0
  fi
  if [ "$status" = "failed" ] || [ "$status" = "expired" ]; then
    echo "$st" >&2
    exit 1
  fi
  sleep 5
  i=$((i + 1))
done
echo "timeout waiting for $RID" >&2
exit 1
