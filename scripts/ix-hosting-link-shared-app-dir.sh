#!/usr/bin/env bash

# This file is responsible for coordinating the build on deploy process which hosting Ask Izzy on Infoxchange infrastructure.
# It is unlikely to be needed when deploying on other platforms.

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

# Deployment process relies on knowing which task definition revision is currently being deployed
if [ -z "$ECS_CONTAINER_METADATA_URI_V4" ]; then
    echo "Error: AWS ECS container agent endpoint not found. Aborting deployment" 1>&2
    exit 1
fi 

curl "${ECS_CONTAINER_METADATA_URI_V4}/task"
TASK_DEFINITION_REVISION=$(node -e "import('node-fetch').then( fetch => fetch.default('${ECS_CONTAINER_METADATA_URI_V4}/task').then(res => res.json()).then(res => console.log(res['Revision'] ?? '')) )")
echo --${TASK_DEFINITION_REVISION}--

if [ -z "$TASK_DEFINITION_REVISION" ]; then
    echo "Error: Failed to fetch task definition revision from AWS ECS container agent endpoint. Aborting deployment" 1>&2
    exit 1
fi 

echo ------------ Serve Stage - Task Definition Revision: "$TASK_DEFINITION_REVISION" -----------

STORAGE_BUILD_DIR="/storage/$TASK_DEFINITION_REVISION"
BUILD_COMPLETE_FILE="$STORAGE_BUILD_DIR/.build-complete"
SHARED_APP_DIR=/tmp/shared-app

if [ ! -d "$STORAGE_BUILD_DIR" ]; then
    echo "STORAGE_BUILD_DIR ($STORAGE_BUILD_DIR) doesn't exist, deploy stage likely failed before build started." 1>&2
    exit 1
fi
if [ ! -f "$BUILD_COMPLETE_FILE" ]; then
    echo "It appears a build was started but never finished." 1>&2
    exit 1
fi

ln -s "$STORAGE_BUILD_DIR" "$SHARED_APP_DIR"

ls -hal /


