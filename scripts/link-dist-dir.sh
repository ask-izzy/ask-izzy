#!/usr/bin/env bash

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

# This is intended as an interim solution. Ideally we wouldn't mess with
# individual items inside the .next directory. But at the moment the IX
# hosting infrastructure doesn't support changing the mount location
# of the static/storage volumes and we can't symlink the whole .next
# dir to the static/storage mounts since next.js freaks out. But we can
# symlink just the cache dir inside the .next dir and that *seems* to
# work okay.

( [ -e /app/.next ] && rm -rf /app/.next ) || true
mkdir /app/.next
( [ -e /storage/.next ] || mkdir /storage/.next )
( [ -e /storage/.next/cache ] || mkdir /storage/.next/cache )
ln -s /storage/.next/cache /app/.next/cache
