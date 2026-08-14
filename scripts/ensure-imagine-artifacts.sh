#!/bin/sh
# Keep /workspace/artifacts as the grok-files FUSE locker.
# Do NOT replace it with a regular folder — Imagine writes into the locker.
set -eu
ART=/workspace/artifacts

is_fuse() {
  findmnt -n -o FSTYPE "$ART" 2>/dev/null | grep -q fuse
}

write_ok() {
  mkdir -p "$ART/imagine_videos" 2>/dev/null || return 1
  echo ok > "$ART/imagine_videos/_write_test.txt" 2>/dev/null || return 1
  test -r "$ART/imagine_videos/_write_test.txt"
}

if is_fuse && write_ok; then
  exit 0
fi

echo "artifacts locker not writable FUSE — remounting grok-files (not a fake dir)" >&2
grok-files unmount "$ART" >/dev/null 2>&1 || true
sleep 0.4
# mountpoint must exist; this is the FUSE target, not a replacement locker
[ -d "$ART" ] || mkdir "$ART"
nohup grok-files mount / "$ART" >>/tmp/grok-files-mount.log 2>&1 &
i=0
while [ "$i" -lt 15 ]; do
  if is_fuse && write_ok; then
    echo "artifacts FUSE locker remounted"
    exit 0
  fi
  sleep 0.4
  i=$((i + 1))
done
echo "WARN: artifacts FUSE locker still not writable" >&2
exit 1
