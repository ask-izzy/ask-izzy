#!/bin/bash

case "$1" in
    lint)
        shift 1

        exec ./script/typecheck
        ;;

    unit-test)
        shift 1

        echo "ISS server: $ISS_URL"
        exec ./script/unit-test
        ;;

    feature-test)
        shift 1

        echo "ISS server: $ISS_URL"
        exec ./script/feature-test
        ;;

    search-test)
        shift 1

        echo "ISS server: $ISS_URL"
        exec ./script/search-test
        ;;

    deploy)
        shift 1

        set -x # Logs

        cp -r ./public/static/* /static/
        ;;

    serve)
        shift 1

        ./script/generate-env-vars > ./public/static/env-$(cat public/VERSION).js

        exec ./script/run-nginx
        ;;

    env)
        shift 1
        exec env $@
        ;;

    *)
        echo "Unknown command: $1"
        ;;
esac
