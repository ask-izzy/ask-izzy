#!/bin/bash

set -eo

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

    maps-test)
        shift 1

        echo "ISS server: $ISS_URL"
        exec ./script/maps-test
        ;;

    personalisation-test)
        shift 1

        echo "ISS server: $ISS_URL"
        exec ./script/personalisation-test
        ;;


    search-test)
        shift 1

        echo "ISS server: $ISS_URL"
        exec ./script/search-test
        ;;

    deploy)
        shift 1

        set -x # Logs
        ./script/generate-env-vars > /static/env-$(cat public/VERSION).js
        ./script/build-gmaps-file
        cp ./public/static/scripts/request-interceptor.js ./public/static/scripts/request-interceptor-$(cat public/VERSION).js
        cp -r ./public/static/* /static/
	# create nginx conf
	echo "$(envsubst '${CSP_FRAME_ANCESTORS}' < conf/nginx.conf)" > conf/nginx.conf
        ;;

    serve)
        shift 1

        exec ./script/run-nginx
        ;;

    env)
        shift 1
        exec env $@
        ;;

    shell)
        /bin/bash
        ;;

    *)
        echo "Unknown command: $1"
        ;;
esac
