#!/bin/sh
# Copy Imagine outputs from grok-files into a local review folder.
# Use this after Imagine actually persists (ls /workspace/artifacts/imagine_videos).
set -eu
ROOT=/workspace
DEST="$ROOT/public/review/imagine"
mkdir -p "$DEST/videos" "$DEST/images"

# Prefer local FUSE if it works, else grok-files download.
if ls /workspace/artifacts/imagine_videos >/dev/null 2>&1; then
  find /workspace/artifacts/imagine_videos -type f ! -name '.*' -o -name '*.mp4' -o -name '*.webm' 2>/dev/null | while read -r f; do
    [ -f "$f" ] || continue
    cp -n "$f" "$DEST/videos/" 2>/dev/null || true
  done
  find /workspace/artifacts/imagine_images -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \) 2>/dev/null | while read -r f; do
    cp -n "$f" "$DEST/images/" 2>/dev/null || true
  done
else
  echo "FUSE down — pulling via grok-files CLI"
  grok-files ls /imagine_videos | awk 'NF && $0 !~ /\/$/' | while read -r name; do
    grok-files download "/imagine_videos/$name" "$DEST/videos/$name" || true
  done
  grok-files ls /imagine_images | awk 'NF && $0 !~ /\/$/' | while read -r name; do
    grok-files download "/imagine_images/$name" "$DEST/images/$name" || true
  done
fi

echo "review videos: $(find "$DEST/videos" -type f | wc -l)"
echo "review images: $(find "$DEST/images" -type f | wc -l)"
echo "dest $DEST"
