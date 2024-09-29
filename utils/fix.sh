#!/usr/bin/env bash

eslint --fix -c eslint.config.mjs js/main/*.js
eslint --fix -c eslint.config.mjs background/*.js