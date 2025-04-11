#!/bin/bash

# Check if a filename is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <zip_filename>"
  echo "Example: $0 my_archive.zip"
  exit 1
fi

# Set the filename from the first argument
ZIP_FILENAME="$1"

# Command 1: Create the zip archive with exclusions
zip -r "$ZIP_FILENAME" . -x '**/.*' -x '.git*' -x '**/__MACOSX'

# Command 2: Delete .DS_Store from the zip archive
zip -d "$ZIP_FILENAME" .DS_Store archive.sh

echo "Zip archive '$ZIP_FILENAME' created."
