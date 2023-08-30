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
BUILDER_HEARTBEAT_FILENAME=".builder-heartbeat"
SERVER_HEARTBEAT_FILENAME=".server-heartbeat"
FLATLINE_DURATION_BEFORE_BUILDER_DECLARED_DEAD=$((60 * 10)) # 10 minutes
FLATLINE_DURATION_BEFORE_SERVER_DECLARED_DEAD=$((60 * 60 * 24 * 7)) # 1 week

# The first container that attempts to create the build dir is responsible for building.
# If the build dir creation fails it means another container has already claimed that job
# so we just wait until it's done.

CREATE_STORAGE_BUILD_DIR_LOG=$(mkdir "$STORAGE_BUILD_DIR" 2>&1) \
    && CREATE_STORAGE_BUILD_DIR_EXIT_STATUS=$? \
    || CREATE_STORAGE_BUILD_DIR_EXIT_STATUS=$?

if [ "$CREATE_STORAGE_BUILD_DIR_EXIT_STATUS" -eq 0 ]; then
    # At the moment this will likely never get called because of the way `yarn run` handles signal forwarding
    function cleanup() {
        echo Deleting "$STORAGE_BUILD_DIR"
        rm -rf "$STORAGE_BUILD_DIR"
        exit 1
    }
    trap 'cleanup' SIGTERM

    # Report builder heartbeat
    (
        while true; do
            date +%s >"$STORAGE_BUILD_DIR/$BUILDER_HEARTBEAT_FILENAME"
            sleep 60
        done
    ) &

    echo "This container is in charge of building the app"
    export TASK_DEFINITION_REVISION
    yarn build

    # Once we've finished building copy all files into the /storage subdirectory
    echo "Done building, now about to copy files"
    time cp -a ".next" "$STORAGE_BUILD_DIR"

    echo "Done copying files"

    # Create build complete file to let other containers know we've finished building
    touch "$BUILD_COMPLETE_FILE"

    # Remove old unused builds
    for STORAGE_DIR_ITEM in /storage/*; do
        if [ "$STORAGE_DIR_ITEM" == "$STORAGE_BUILD_DIR" ]; then # skip if dir item is current build directory
            continue
        fi
        LAST_HEARTBEAT=0
        if [ -f "$STORAGE_DIR_ITEM/$BUILDER_HEARTBEAT_FILENAME" ]; then
            LAST_HEARTBEAT=$(cat "$STORAGE_DIR_ITEM/$BUILDER_HEARTBEAT_FILENAME")
        fi
        if [ -f "$STORAGE_DIR_ITEM/$SERVER_HEARTBEAT_FILENAME" ]; then
            LAST_HEARTBEAT=$(cat "$STORAGE_DIR_ITEM/$SERVER_HEARTBEAT_FILENAME")
        fi
        # Remove build if last heartbeat was longer than $FLATLINE_DURATION_BEFORE_SERVER_DECLARED_DEAD seconds ago
        if [ "$LAST_HEARTBEAT" -lt $(($(date +%s)-FLATLINE_DURATION_BEFORE_SERVER_DECLARED_DEAD)) ]; then
            echo Deleting previous build: "$STORAGE_DIR_ITEM"
            rm -r "$STORAGE_DIR_ITEM"
        else
            echo Keeping previous build: "$STORAGE_DIR_ITEM"
        fi
    done
else
    if [ ! -d "$STORAGE_BUILD_DIR" ]; then
        echo "$STORAGE_BUILD_DIR doesn't exist but got this error when trying to create one:" 1>&2
        echo "$CREATE_STORAGE_BUILD_DIR_LOG" 1>&2
        exit 1
    fi

    # Report server heartbeat
    (
        while true; do
            date +%s >"$STORAGE_BUILD_DIR/$SERVER_HEARTBEAT_FILENAME"
            sleep 60
        done
    ) &

    # Wait if build is still in progress
    if [ ! -f "$BUILD_COMPLETE_FILE" ]; then
        BUILDER_HEARTBEAT_PATH="$STORAGE_BUILD_DIR/$BUILDER_HEARTBEAT_FILENAME"
        if [ ! -f "$BUILDER_HEARTBEAT_PATH" ] || [ "$(cat "$BUILDER_HEARTBEAT_PATH")" -lt $(($(date +%s)-FLATLINE_DURATION_BEFORE_BUILDER_DECLARED_DEAD)) ]; then
            echo "Unfinished build exists but builder appears to have died" 1>&2
            rm -rf "$STORAGE_BUILD_DIR"
            exit 1
        fi

        echo "It appears a build is already in progress by a different container so waiting for that build to complete."
        while [ ! -f "$BUILD_COMPLETE_FILE" ]; do
            sleep 1
        done
        echo "The container responsible for building has signalled it is finished. Copying in build files."
    else
        echo "Site was previously built, copying in those build files."
    fi

    rm -rf ".next"
    time cp -a "$STORAGE_BUILD_DIR/.next" .
    echo "Finished copying."
fi

echo "Build ID: $TASK_DEFINITION_REVISION" >> ./public/VERSION.txt
