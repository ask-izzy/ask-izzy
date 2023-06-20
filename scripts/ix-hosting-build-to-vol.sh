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

TASK_DEFINITION_REVISION=$(node -e "import('node-fetch').then( fetch => fetch.default('${ECS_CONTAINER_METADATA_URI_V4}/task').then(res => res.json()).then(res => console.log(res['Revision'] ?? '')) )")

if [ -z "$TASK_DEFINITION_REVISION" ]; then
    echo "Error: Failed to fetch task definition revision from AWS ECS container agent endpoint. Aborting deployment" 1>&2
    exit 1
fi 

echo ------------ Task Definition Revision: "$TASK_DEFINITION_REVISION" -----------

STORAGE_BUILD_DIR="/storage/$TASK_DEFINITION_REVISION"
BUILD_COMPLETE_FILE="$STORAGE_BUILD_DIR/.build-complete"
NUM_OF_PREVIOUS_REVISIONS_TO_KEEP=5 # Keep build files for the last 5 task definition revisions
SHARED_APP_DIR="/tmp/shared-app"

# The first container that attempts to create the build dir is responsible for building.
# If the build dir creation fails it means another container has already claimed that job
# so we just wait until it's done.

CREATE_STORAGE_BUILD_DIR_LOG=$(mkdir "$STORAGE_BUILD_DIR" 2>&1) \
    && CREATE_STORAGE_BUILD_DIR_EXIT_STATUS=$? \
    || CREATE_STORAGE_BUILD_DIR_EXIT_STATUS=$?

if [ "$CREATE_STORAGE_BUILD_DIR_EXIT_STATUS" -eq 0 ]; then
    echo "--- This container is in charge of building the app"
    yarn build

    echo "Done building, now about to copy files"

    # Once we've finished building copy all files into the /storage subdirectory
    # time cp -a "./." "$STORAGE_BUILD_DIR"
    rsync -a --progress --info=progress2 --stats "." "$STORAGE_BUILD_DIR"
    ls -hal "$STORAGE_BUILD_DIR"

    echo "Done copying files"

    # Create build complete file to let other containers know we've finished building
    touch "$BUILD_COMPLETE_FILE"

    for STORAGE_DIR_ITEM in /storage/*; do
        if [ "$(basename "$STORAGE_DIR_ITEM")" -lt $((TASK_DEFINITION_REVISION-NUM_OF_PREVIOUS_REVISIONS_TO_KEEP)) ]; then
            echo Deleting previous build: "$STORAGE_DIR_ITEM"
            rm -r "$STORAGE_DIR_ITEM"
        else
            echo Ignoring: "$STORAGE_DIR_ITEM"
        fi
    done
else
    if [ ! -d "$STORAGE_BUILD_DIR" ]; then
        echo "STORAGE_BUILD_DIR doesn't exist but got this error when trying to create one:" 1>&2
        echo "$CREATE_STORAGE_BUILD_DIR_LOG" 1>&2
        exit 1
    fi
    if [ ! -f "$BUILD_COMPLETE_FILE" ]; then
        echo "It appears a build is already in progress by a different container so waiting for that build to complete."
    fi
    while [ ! -f "$BUILD_COMPLETE_FILE" ]; do
        sleep 1
    done
    echo "The container responsible for building has signalled it is finished."
fi

ln -s "$STORAGE_BUILD_DIR" "$SHARED_APP_DIR"