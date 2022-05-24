#!/bin/bash

# If run inside the app docker container use the pre-installed binary. Otherwise
# use the official shellcheck docker image.

if [ -f /.dockerenv ]; then
  shellcheck "$@"
else
  docker run --rm -v "$PWD:/mnt" koalaman/shellcheck:stable "$@"
fi
