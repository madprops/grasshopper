#!/bin/env bash
goldie -p=main.html -a "$1" -x="$2"
goldie -p=css/style.css -a "$1" -x="$2"
goldie -p=js/app.js -a "$1" -x="$2"
cd js/main && goldie -a "$1" -x="$2"