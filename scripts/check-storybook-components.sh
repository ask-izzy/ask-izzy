#!/usr/bin/env bash

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

SOME_COMPONENTS_MISSING_STORY=false

if [ -z "$(which git)" ]; then
    echo 1>&2 "git not installed"
    exit 1
fi

for file in $( git ls-files 'components/*.js' 'components/**/*.js' 'src/components/*.js' 'src/components/**/*.js'); do
    if [ -e "$file" ] ; then
        if [[ "$file" == *.stories.js || "$file" == *.service.js  || "$file" == *.hook.js  || "$file" == */index.js  || "$file" == components/pages/* ]]; then
            continue
        fi
        parentDir=$(dirname "$file")
        name=$(basename "$file" ".js")
        if [ ! -f "$parentDir/$name.stories.js" ]; then
            SOME_COMPONENTS_MISSING_STORY=true
            echo 1>&2 "Component does not have storybook stories: $parentDir/$name.js"
        fi
    fi
done

if [ $SOME_COMPONENTS_MISSING_STORY == "true" ]; then
    exit 1
fi
