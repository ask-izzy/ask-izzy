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

if [ ! -d "$STORAGE_BUILD_DIR" ]; then
    echo "STORAGE_BUILD_DIR ($STORAGE_BUILD_DIR) doesn't exist, deploy stage likely failed before build started." 1>&2
    exit 1
fi
if [ ! -f "$BUILD_COMPLETE_FILE" ]; then
    echo "It appears a build was started but never finished." 1>&2
    exit 1
fi

cp -a "$STORAGE_COPY_OF_NEXT_DIR" "$APP_NEXT_DIR"
# This is intended as an interim solution. Ideally we wouldn't mess with
# individual items inside the .next directory. But at the moment the IX
# hosting infrastructure doesn't support changing the mount location
# of the static/storage volumes and we can't symlink the whole .next
# dir to the static/storage mounts since next.js freaks out. But we can
# symlink just the cache dir inside the .next dir and that *seems* to
# work okay.
ln -s "$STORAGE_NEXT_CACHE_DIR" "$APP_NEXT_CACHE_DIR"