#!/usr/bin/env bash

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

SOME_FILES_MISSING_ANNOTATION=false

if [ -z "$(which git)" ]; then
    echo 1>&2 "git not installed"
    exit 1
fi

for file in $( git ls-files '*.js' '**/*.js' ); do
    if [ -e "$file" ] ; then
        if [[ "$file" == external-resources-proxy/* ]]; then
            continue
        elif [[ "$file" == flow/flow-typed/* ]]; then
            continue
        fi

        # "|| true" is needed to stop "set -e" killing us if file doesn't have enough lines
        read -rN2 firstTwoChars < "$file" || true
        if [ "$firstTwoChars" = "#!" ]; then
            { read -r; read -r lineToCheck; } < "$file" || true
        else
            read -r lineToCheck < "$file" || true
        fi


        if [ "$lineToCheck" != "/* \$FlowIgnore */" ] && [ "$lineToCheck" != "/* @flow */" ]; then
            SOME_FILES_MISSING_ANNOTATION=true
            echo 1>&2 "$file does not have Flow.js annotation. File must start with \"/* @flow */\" or \"/* \$FlowIgnore */\""
        fi
    fi
done

if [ $SOME_FILES_MISSING_ANNOTATION == "true" ]; then
    exit 1
fi
