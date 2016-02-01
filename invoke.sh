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

        cp -r ./public/static/* /static/
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
