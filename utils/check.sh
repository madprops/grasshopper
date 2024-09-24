#!/usr/bin/env bash

eslint -c eslint.config.mjs js/main/*.js
eslint -c eslint.config.mjs background/*.js