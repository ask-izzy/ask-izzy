#!/usr/bin/env bash

# The version of flow-bin we use doesn't include a linux arm64 binary (and
# refuses to run on arm64) so when running on arm64 linux (eg docker on an Apple
# Silicon Mac) we run the x86_64 binary directly instead. This relies on x86_64
# emulation being available (eg Rosetta in Docker Desktop/OrbStack) and the
# x86_64 dynamic loader being installed (see the Dockerfile).

set -euo pipefail

if [ "$(uname -s)" = "Linux" ] && [ "$(uname -m)" = "aarch64" ]; then
    flowBin="$(node -p '
        const path = require("path")
        const pkgPath = require.resolve("flow-bin/package.json")
        const {version} = require(pkgPath)
        path.join(path.dirname(pkgPath), "flow-linux64-v" + version, "flow")
    ')"
    exec "$flowBin" "$@"
fi

exec flow "$@"
