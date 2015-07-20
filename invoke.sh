#!/bin/bash
# Fix the permissions of static volume, execute the management command as the
# app user.

# Set RUN_AS_USER=true to run without reexec-ing as the `app' user. Useful
# if running outside of Docker.

APP="s2x_project"
APP_USER="app"

: "${WEB_CONCURRENCY:=1}"
: "${WORKER_CONCURRENCY:=1}"
export APP APP_USER WEB_CONCURRENCY WORKER_CONCURRENCY

# export NEW_RELIC_ENVIRONMENT="$ENVIRONMENT"
# export NEW_RELIC_CONFIG_FILE=./conf/newrelic.ini

if [ "x$RUN_AS_USER" != "xtrue" ] && [ "x$(whoami)" != "x$APP_USER" ]; then
    chown -R "$APP_USER" /static /storage

    # Call back into ourselves as the app user. This saves a big, nasty, huge
    # chunk of escaped quotes and figuring out bash arrays in all that mess
    # (they are hard enough without escaping!)
    exec sudo -sEH -u "$APP_USER" -- "$0" "$@"
else
    case "$1" in
        test)
            shift 1

            echo "ISS server: $ISS_URL"

            # install the dev deps
            NODE_ENV=development npm install

            exec ./script/test
            ;;

        deploy)
            shift 1

            exec echo "FIXME: copy assets to /static"
            ;;

        serve)
            shift 1

            exec ./script/prod-server
            ;;

        env)
            shift 1
            exec env $@
            ;;

        *)
            echo "Unknown command: $1"
            ;;
    esac
fi
