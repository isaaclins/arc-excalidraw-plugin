#!/usr/bin/env bash
# Build the extension and produce a Chrome Web Store upload zip.
# The zip contains the contents of dist/ at its root (manifest.json at zip root).
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
cd "$repo_root"

version="$(node -p "require('./public/manifest.json').version")"
zip_name="draw-on-page-excalidraw-v${version}.zip"
zip_path="$script_dir/$zip_name"

echo "==> Building version $version"
npm run build

if [ ! -f dist/manifest.json ]; then
  echo "error: dist/manifest.json is missing after build" >&2
  exit 1
fi

echo "==> Packing $zip_name"
rm -f "$zip_path"
(cd dist && zip -qr "$zip_path" . -x '.DS_Store' -x '__MACOSX/*' -x '*/.DS_Store')

listing="$(unzip -l "$zip_path")"
if ! printf '%s\n' "$listing" | grep -qE ' manifest\.json$'; then
  echo "error: manifest.json is not at the zip root" >&2
  exit 1
fi

size="$(du -h "$zip_path" | cut -f1)"
echo "==> Done: store/$zip_name ($size)"
echo "    Upload this file at https://chrome.google.com/webstore/devconsole"
