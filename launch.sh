#!/bin/sh

RUN="__NV_DISABLE_EXPLICIT_SYNC=1 npm run tauri dev"
echo "Running: $RUN"
eval $RUN

