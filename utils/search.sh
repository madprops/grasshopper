#!/bin/env bash
context=${2:-0}

goldie -p=main.html -a "$1" -C="$context"
goldie -p=css/style.css -a "$1" -C="$context"
goldie -p=js/init.js -a "$1" -C="$context"
goldie -p=js/app.js -a "$1" -C="$context"
cd js/main && goldie -a "$1" -C="$context"