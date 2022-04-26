#!/usr/bin/env bash

# Note: The behaviour of this file should match the behaviour in render.js

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

TARGET_DIR=${1-}
FILE_FILTER=${2-}

if [[ -z "$TARGET_DIR" ]] || [[ -z "$FILE_FILTER" ]]; then
    echo "Argument missing"
    exit 1
fi

vars_to_inject=(
    "VERSION"
    "ISS3_BASE_URL"
    "ISS3_API_KEY"
    "ISS_BASE_URL"
    "ISS_API_TOKEN"
    "GOOGLE_API_KEY"
    "GOOGLE_ANALYTICS_URL"
    "GOOGLE_TAG_MANAGER_ID"
    "GOOGLE_TAG_MANAGER_AUTH"
    "GOOGLE_TAG_MANAGER_ENV"
    "PROXY_DOMAINS"
    "NEW_RELIC_CONFIG"
    "NEW_RELIC_INFO"
    "PROXY_PROTOCOL"
    "STRAPI_URL"
)

required_vars=(
    "VERSION"
    "ISS3_BASE_URL"
    "ISS3_API_KEY"
    "ISS_BASE_URL"
    "ISS_API_TOKEN"
    "PROXY_DOMAINS"
    "NEW_RELIC_CONFIG"
    "NEW_RELIC_INFO"
    "STRAPI_URL"
)

for var_to_inject in "${vars_to_inject[@]}"; do
    if [[ -z ${!var_to_inject+1} ]] && [[ " ${required_vars[@]} " =~ " ${var_to_inject} " ]]; then
        echo "The required env var \"$var_to_inject\" is not defined."
        exit 1
    fi
done

for file in $(find "$TARGET_DIR" -iname "$FILE_FILTER"); do
    envsubst $(printf "\${%s} " "${vars_to_inject[@]}") < "$file" > "$file".tmp
    rm "$file"
    mv "$file".tmp "$file"
done
