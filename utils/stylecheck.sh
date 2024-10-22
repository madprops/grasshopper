#!/usr/bin/env bash

npx stylelint -c stylelint.config.mjs css/style.css
if [ $? -ne 0 ]; then
  exit 1
fi