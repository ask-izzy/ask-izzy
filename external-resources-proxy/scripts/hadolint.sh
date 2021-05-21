#!/bin/bash

# If run inside the app docker container use the pre-installed binary. Otherwise
# use the official hadolint docker image.

if [ -f /.dockerenv ]; then
  hadolint "$@"
else
  docker run --rm -v "$(pwd):/mnt" -w /mnt hadolint/hadolint:latest-debian hadolint "$@"
fi
