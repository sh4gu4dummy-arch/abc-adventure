#!/bin/sh
# Pull an Imagine clip from vidgen.x.ai (or any https mp4 URL).
# Same job as fetch-vidgen.ps1 on the other project.
#
# If default DNS cannot resolve vidgen.x.ai, pin Cloudflare IPs via --resolve
# (Google DNS 8.8.8.8 has also been used to look the name up).
#
#   sh scripts/fetch-vidgen.sh <vidgen-url> <outfile.mp4>
set -eu
URL="${1:-}"
OUT="${2:-}"
if [ -z "$URL" ] || [ -z "$OUT" ]; then
  echo "usage: $0 <vidgen-or-mp4-url> <outfile.mp4>" >&2
  exit 2
fi

mkdir -p "$(dirname "$OUT")"
tmp=$(mktemp /tmp/vidgen-XXXXXX.mp4)
trap 'rm -f "$tmp"' EXIT

# Known vidgen anycast (Cloudflare). Used only when DNS fails.
IPS="104.18.18.80 104.18.19.80"

resolve_args=""
if ! getent hosts vidgen.x.ai >/dev/null 2>&1; then
  echo "default DNS cannot resolve vidgen.x.ai — pinning 104.18.18.80" >&2
  resolve_args="--resolve vidgen.x.ai:443:104.18.18.80"
fi

# shellcheck disable=SC2086
if ! curl -fL --retry 4 --retry-delay 1 $resolve_args \
    -A 'Mozilla/5.0' \
    "$URL" -o "$tmp"; then
  # last-ditch: force pin even if DNS "works" but is wrong
  echo "retry with pinned vidgen IP" >&2
  curl -fL --retry 2 --resolve vidgen.x.ai:443:104.18.18.80 \
    -A 'Mozilla/5.0' \
    "$URL" -o "$tmp"
fi

if ! dd if="$tmp" bs=1 skip=4 count=4 2>/dev/null | grep -q ftyp; then
  echo "download was not an mp4: $URL" >&2
  exit 1
fi

cp "$tmp" "$OUT"
echo "saved $OUT ($(wc -c < "$OUT") bytes)"
