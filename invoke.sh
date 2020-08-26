#!/bin/bash

set -eo

# Read in environment variables from file
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

case "$1" in
    lint)
        shift 1

        exec ./script/typecheck
        ;;

    lint-fix-eslint)
        shift 1

        exec npx eslint --fix src/ test/ fixtures/ webpack/ config/
        ;;

    lint-fix-sass)
        shift 1

        exec npx sass-lint-auto-fix -c .sass-lint.yml
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
        cp ./public/static/scripts/request-interceptor.js ./public/static/scripts/request-interceptor-$(cat public/VERSION).js
        cp -r ./public/static/* /static/
        ;;

    serve)
        shift 1

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
