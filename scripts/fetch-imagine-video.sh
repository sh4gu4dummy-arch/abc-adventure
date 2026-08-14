#!/bin/sh
# Download an Imagine / xAI video URL into the review folder.
# Usage:
#   sh scripts/fetch-imagine-video.sh <url> [name.mp4]
# Accepts:
#   https://vidgen.x.ai/.../video.mp4
#   https://grok.com/imagine/post/<id>
#   https://grok.com/...?file=<id>
set -eu
URL="${1:-}"
NAME="${2:-}"
DEST_DIR=/workspace/public/review/imagine/videos
mkdir -p "$DEST_DIR"

if [ -z "$URL" ]; then
  echo "usage: $0 <imagine-or-vidgen-url> [name.mp4]" >&2
  exit 2
fi

tmp=$(mktemp /tmp/imagine-XXXXXX)
cleanup() { rm -f "$tmp" "$tmp.html"; }
trap cleanup EXIT

# imagine post page → find mp4
case "$URL" in
  *grok.com/imagine/post*|*grok.com/*file=*)
    curl -fsSL -A 'Mozilla/5.0' "$URL" -o "$tmp.html" || true
    found=$(grep -oE 'https://[^"[:space:]]+\.mp4' "$tmp.html" 2>/dev/null | head -1 || true)
    if [ -n "${found:-}" ]; then
      URL="$found"
    fi
    ;;
esac

if [ -z "$NAME" ]; then
  NAME=$(printf '%s' "$URL" | sed -E 's#.*/##; s#[?].*##')
  [ -n "$NAME" ] || NAME="imagine-$(date +%s).mp4"
  case "$NAME" in
    *.mp4) ;;
    *) NAME="$NAME.mp4" ;;
  esac
fi

curl -fL --retry 3 -A 'Mozilla/5.0' "$URL" -o "$tmp"
# basic mp4 sniff (ftyp)
if ! dd if="$tmp" bs=1 skip=4 count=4 2>/dev/null | grep -q ftyp; then
  echo "not an mp4: $URL" >&2
  exit 1
fi
cp "$tmp" "$DEST_DIR/$NAME"
echo "saved $DEST_DIR/$NAME ($(wc -c < "$DEST_DIR/$NAME") bytes)"
