#!/usr/bin/env bash

# Set your target backup directory here
BACKUP_DIR="/mnt/struct_2/grasshopper/"
mkdir -p "$BACKUP_DIR"

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Error: Not inside a git repository."
  exit 1
fi

LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)

if [ -z "$LATEST_TAG" ]; then
  echo "Error: No tags found in this repository."
  exit 1
fi

REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
OUTPUT_FILE="$BACKUP_DIR/${REPO_NAME}_${LATEST_TAG}.zip"

git archive --format=zip --output="$OUTPUT_FILE" "$LATEST_TAG"

echo "Successfully backed up tag '$LATEST_TAG' to '$OUTPUT_FILE'"
