#!/bin/sh
# node tools/run.sh senaryo.json
cd "$(dirname "$0")/.." && node build.mjs --dev >/dev/null && node tools/shot.mjs "$1"
