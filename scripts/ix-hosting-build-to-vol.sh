#!/usr/bin/env bash

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

DEPLOYMENT_ID=$(echo "$HOSTNAME" | awk -F "-" '{print $(NF-1)}')
echo ------------ Deployment ID: "$DEPLOYMENT_ID" -----------

# This file is responsible for coordinating the build on deploy process which hosting Ask Izzy on Infoxchange infrastructure.
# It is unlikely to be needed when deploying on other platforms.

STORAGE_BUILD_DIR="/storage/$VERSION/$DEPLOYMENT_ID"
STORAGE_COPY_OF_NEXT_DIR="$STORAGE_BUILD_DIR/copy-of-next-dir"
STORAGE_NEXT_CACHE_DIR="$STORAGE_BUILD_DIR/shared-cache"
APP_NEXT_DIR="/app/.next"
APP_NEXT_CACHE_DIR="$APP_NEXT_DIR/cache"
BUILD_COMPLETE_FILE="$STORAGE_BUILD_DIR/.build-complete"

# The first container that attempts to create the build dir is responsible for building.
# If the build dir creation fails it means another container has already claimed that job
# so we just wait until it's done.

STORAGE_BUILD_PARENT_DIR="$(dirname "$STORAGE_BUILD_DIR")"
mkdir -p "$STORAGE_BUILD_PARENT_DIR" # "-p" because we don't want an error if it already exists

CREATE_STORAGE_BUILD_DIR_LOG=$(mkdir "$STORAGE_BUILD_DIR" 2>&1) \
    && CREATE_STORAGE_BUILD_DIR_EXIT_STATUS=$? \
    || CREATE_STORAGE_BUILD_DIR_EXIT_STATUS=$?

if [ $CREATE_STORAGE_BUILD_DIR_EXIT_STATUS -eq 0 ]; then
    echo "This container is in charge of building the app"
    yarn build
    cp -a "$APP_NEXT_DIR" "$STORAGE_COPY_OF_NEXT_DIR"
    mv "$STORAGE_COPY_OF_NEXT_DIR/cache" "$STORAGE_NEXT_CACHE_DIR"
    rm -r "$APP_NEXT_CACHE_DIR"

    # Create build complete file to let other containers know we've finished building
    touch "$BUILD_COMPLETE_FILE"

    SINGLE_SITE_DOMAIN=$(echo "$SITE_DOMAIN" | awk -F '|' '{ print $1 }')
    # We actually need word splitting here for the subshell so that the returned values of the subshell are interpreted as separate arguments
    # shellcheck disable=SC2046
    CURRENT_DEPLOYED_VERSION=$(curl -sS --fail $([ -n "$HTTP_PROXY" ] && echo -e "-x\n\t$HTTP_PROXY") "$SITE_PROTOCOL://$SINGLE_SITE_DOMAIN/VERSION")

    # ".next" is needed while transitioning to this new build system
    # and can be removed once all environments have been updated.
    VERSIONS_TO_KEEP=("/storage/$VERSION" "/storage/$CURRENT_DEPLOYED_VERSION" "/storage/.next")

    for storage_item in /storage/*; do
        KEEP=false
        for i in "${VERSIONS_TO_KEEP[@]}"; do
            if [ "$i" = "$storage_item" ] ; then
                KEEP=true
            fi
        done

        if [ $KEEP != "true" ]; then
            echo Deleting previous build: "$storage_item"
            rm -r "$storage_item"
        else
            echo Ignoring: "$storage_item"
        fi
    done
else
    if [ ! -d "$STORAGE_BUILD_DIR" ]; then
        echo "STORAGE_BUILD_DIR doesn't exist but got this error when trying to create one:" 1>&2
        echo "$CREATE_STORAGE_BUILD_DIR_LOG" 1>&2
        exit 1
    fi
    if [ ! -f "$BUILD_COMPLETE_FILE" ]; then
        echo "It appears a build is already in progress by a different container so waiting for that build to complete. If the process which created it has died before completing try redeploying with the env var BUILD_CACHE_CLEAR_KEY set to any unique value in order to purge the old build."
    fi
    while [ ! -f "$BUILD_COMPLETE_FILE" ]; do
        sleep 1
    done
    echo "The container responsible for building has signalled it is finished."
fi
