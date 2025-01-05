#!/usr/bin/env bash
export NODE_OPTIONS="--no-warnings"

# Only check files that have changed recently
last_tag=$(git describe --tags --abbrev=0)
changed_files=$(git diff --name-only $last_tag HEAD -- "*.js")

if [ -n "$changed_files" ]; then
  npm run --silent lint $changed_files
else
  echo "No files have changed since the last tag."
fi

# all_files=$(git ls-files -- "js/main/*.js")
# npm run --silent lint $all_files