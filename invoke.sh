#!/bin/bash

# Enable strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

DEBUG=${DEBUG:-}
export VERSION="$(cat public/VERSION)"

# Read in environment variables from file
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Hacky that we do this every time even if variables have already been loaded
# but this is the most foolproof method for now and we should hopefully be able
# to dramatics improve the whole env vars system Soon™ with changes to our
# rendering system.
echo "Injecting env vars"
script/inject-config-on-deploy.sh public '*.html'
if [ -f public/components-catalog ]; then
    cp src/env-vars.js public/components-catalog
    script/inject-config-on-deploy.sh public/components-catalog env-vars.js
fi

case "$1" in
    lint)
        shift 1

        exec ./script/typecheck
        ;;

    lint-fix-eslint)
        shift 1

        exec npx eslint --fix src/ test/ fixtures/ webpack/ config/ .storybook/
        ;;

    lint-fix-stylelint)
        shift 1

        exec npx stylelint --fix "**/*.{css,scss,sass}"
        ;;

    lint-pa11y)
        shift 1

        exec script/run-node-script script/test-accessibility.js "$@"
        ;;

    unit-test)
        shift 1

        [ -n "$DEBUG" ] && echo "ISS server: $ISS_URL"
        exec ./script/unit-test
        ;;

    feature-test)
        shift 1

        [ -n "$DEBUG" ] && echo "ISS server: $ISS_URL"
        exec ./script/feature-test
        ;;

    maps-test)
        shift 1

        [ -n "$DEBUG" ] && echo "ISS server: $ISS_URL"
        exec ./script/maps-test
        ;;

    personalisation-test)
        shift 1

        [ -n "$DEBUG" ] && echo "ISS server: $ISS_URL"
        exec ./script/personalisation-test
        ;;

    deploy)
        shift 1

        PS4='$ $0:$LINENO: '
        set -x # Logs
        rsync -a --delete ./public/static/ /static/
        ;;

    serve)
        shift 1
        echo "Starting nginx"
        exec ./script/run-nginx
        ;;

    dev-serve)
        shift 1
        exec ./script/dev-server
        ;;

    env)
        shift 1
        exec env $@
        ;;

    shell)
        shift 1
        /bin/bash "$@"
        ;;

    *)
        echo "Unknown command: $1"
        ;;
esac
