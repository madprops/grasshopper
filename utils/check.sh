#!/usr/bin/env bash
export NODE_OPTIONS="--no-warnings"

# Only check files that have changed recently
last_tag=$(git describe --tags --abbrev=0)

# Pick one
# files=$(git diff --name-only $last_tag HEAD -- '*.js')
files=$(git ls-files -- "*.js")
files=$(echo $files | tr " " "\n" | grep -v "/libs/" | grep -v "words.js" | tr "\n" " ")

if [ -n "$files" ]; then
  npm run --silent lint $files
fi