#!/usr/bin/env bash

npx eslint -c eslint.config.mjs js/main/*.js
if [ $? -ne 0 ]; then
  exit 1
fi

npx eslint -c eslint.config.mjs background/*.js
if [ $? -ne 0 ]; then
  exit 1
fi