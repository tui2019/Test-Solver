#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define common files and directories to include in the zip
FILES_TO_ZIP="icons background.js bootstrap.min.css geminiAPI.js languages.js options.html optionsProc.js solverClasstime.js solverGoogle.js solverNaurok.js solverVseosvita.js"

# Define source manifest locations
CHROME_MANIFEST="chrome/manifest.json"
FIREFOX_MANIFEST="firefox/manifest.json"

# --- Extract Version Number ---
VERSION=$(awk -F'"' '/"version":/ {print $4}' "$CHROME_MANIFEST")
if [ -z "$VERSION" ]; then
  echo "Error: Could not extract version number from $CHROME_MANIFEST"
  exit 1
fi
echo "Detected version: $VERSION"
echo "-----------------------------"

# Define output directory (set to Desktop for macOS/Linux)
OUTPUT_DIR="$HOME/Desktop"
CHROME_ZIP_NAME="${OUTPUT_DIR}/Test-Solver-${VERSION}-Chrome.zip"
FIREFOX_ZIP_NAME="${OUTPUT_DIR}/Test-Solver-${VERSION}-Firefox.zip"

# Check if Desktop directory exists, create if not (unlikely needed, but safe)
mkdir -p "$OUTPUT_DIR"

# --- Package Chrome Extension ---
echo "Packaging Chrome extension..."
# 1. Copy the Chrome manifest
cp "$CHROME_MANIFEST" manifest.json
# 2. Create the initial zip archive
zip -r "$CHROME_ZIP_NAME" manifest.json $FILES_TO_ZIP
# 3. Remove the temporary manifest
rm manifest.json
# 4. Clean macOS specific files (.DS_Store, __MACOSX) from the archive
echo "Cleaning $CHROME_ZIP_NAME..."
zip -d "$CHROME_ZIP_NAME" '__MACOSX*' '*/.DS_Store' '.DS_Store' > /dev/null 2>&1 || true
# 5. Remove LICENSE and README.md from the archive
echo "Removing LICENSE and README.md from $CHROME_ZIP_NAME..."
zip -d "$CHROME_ZIP_NAME" 'LICENSE' 'README.md' > /dev/null 2>&1 || true
#    > /dev/null 2>&1 : Suppresses output (like "nothing deleted")
#    || true : Prevents script exit if zip -d fails (e.g., files not found)

echo "Created and cleaned $CHROME_ZIP_NAME"
echo "-----------------------------"

# --- Package Firefox Extension ---
echo "Packaging Firefox extension..."
# 1. Copy the Firefox manifest
cp "$FIREFOX_MANIFEST" manifest.json
# 2. Create the initial zip archive
zip -r "$FIREFOX_ZIP_NAME" manifest.json $FILES_TO_ZIP
# 3. Remove the temporary manifest
rm manifest.json
# 4. Clean macOS specific files (.DS_Store, __MACOSX) from the archive
echo "Cleaning $FIREFOX_ZIP_NAME..."
zip -d "$FIREFOX_ZIP_NAME" '__MACOSX*' '*/.DS_Store' '.DS_Store' > /dev/null 2>&1 || true
# 5. Remove LICENSE and README.md from the archive
echo "Removing LICENSE and README.md from $FIREFOX_ZIP_NAME..."
zip -d "$FIREFOX_ZIP_NAME" 'LICENSE' 'README.md' > /dev/null 2>&1 || true

echo "Created and cleaned $FIREFOX_ZIP_NAME"
echo "-----------------------------"

echo "Packaging complete. Archives are on your Desktop ($OUTPUT_DIR)."
