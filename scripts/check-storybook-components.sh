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

for file in $( git ls-files 'components/*.ts' 'components/**/*.ts' 'src/components/*.ts' 'src/components/**/*.ts' 'components/*.tsx' 'components/**/*.tsx' 'src/components/*.tsx' 'src/components/**/*.tsx' ); do
    if [ -e "$file" ] ; then
        if [[ "$file" == *.stories.ts || "$file" == *.stories.tsx || "$file" == *.service.ts  || "$file" == *.hook.ts  || "$file" == */index.ts || "$file" == */index.tsx || "$file" == components/pages/* ]]; then
            continue
        fi
        parentDir=$(dirname "$file")
        name=$(basename "$file")
        name="${name%.*}"
        if [ ! -f "$parentDir/$name.stories.tsx" ] && [ ! -f "$parentDir/$name.stories.ts" ]; then
            SOME_COMPONENTS_MISSING_STORY=true
            echo 1>&2 "Component does not have storybook stories: $file"
        fi
    fi
done

if [ $SOME_COMPONENTS_MISSING_STORY == "true" ]; then
    exit 1
fi
