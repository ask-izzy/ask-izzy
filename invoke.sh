#!/bin/bash

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

        ./script/generate-env-vars > ./public/env.js
        cp -r ./public/static/* /static/
        ;;

    serve)
        shift 1

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
