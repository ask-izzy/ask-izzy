ARG UID_GID=1000:1000
ARG HOME="/tmp/home"

###############################################################################
# Set volume permissions                                                      #
#                                                                             #
# Since we run the image for Ask Izzy is designed not as root (for security   #
# reasons), if we want to mount shared volumes into this container to write   #
# to then those volumes will need to have file permissions that allow our     #
# user write to them. However since the point of not running this container   #
# as root is to not allow things like changing file permissions for files we  #
# don't already have permission to modify then we can't simply set the        #
# permissions of files in the volumes when the container is started if        #
# needed. To get around this we create a separate image that runs as root     #
# who's only purposes is to set the file permissions of mounted volumes.      #
# This image should only have to be run once after which we can deploy the    #
# Distribution image as normal.                                               #
###############################################################################

FROM contyard.office.infoxchange.net.au/bullseye-nodejs16:latest as set-volume-permissions
ARG UID_GID

# hadolint ignore=DL3002
USER root
ENV UID_GID=$UID_GID

ENV DIRS_TO_SET_PERMISSIONS_ON="/storage"

# hadolint ignore=DL3025
ENTRYPOINT exec bash -c 'for DIR_TO_SET_PERMISSIONS_ON in ${DIRS_TO_SET_PERMISSIONS_ON//,/$IFS}; do \
        echo Setting volume file permissions on "$DIR_TO_SET_PERMISSIONS_ON"; \
        chown -R $UID_GID "$DIR_TO_SET_PERMISSIONS_ON"; \
        ls -hal "$DIR_TO_SET_PERMISSIONS_ON"; \
    done'


###############################################################################
# Prepare environment                                                         #
#                                                                             #
# This stage should should do any setup that is required for in both the      #
# development and serving states.                                             #
###############################################################################

FROM contyard.office.infoxchange.net.au/bullseye-nodejs16:latest as base

ARG UID_GID
ARG HOME

LABEL maintainer="developers@infoxchange.org"
LABEL vendor="infoxchange.org"

ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=$HOME
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

RUN mkdir /app && \
    ( [ -e "$HOME" ] || mkdir "$HOME" ) && \
    chown -R $UID_GID /app "$HOME" && \
    # Install yarn
    npm install -g yarn && \
    yarn config set registry http://apt.office.infoxchange.net.au/npm && \
    # Install system dependences
    apt-get -y update && \
    apt-get -y --no-install-recommends install \
        # Used by start-server-and-test
        procps \
        # Used for open fd debugging
        lsof && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER $UID_GID

WORKDIR /app

ENTRYPOINT ["yarn", "run"]
VOLUME ["/static", "/storage"]
EXPOSE 8000


###############################################################################
# Setup development environment                                               #
#                                                                             #
# All code and dependencies necessary to run the tests, lints and serve a     #
# development version of the app.                                             #
###############################################################################

FROM base as development
ARG UID_GID

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

USER root

# Install any packages needed for building/testing the app.
RUN apt-get -y update && \
    apt-get -y --no-install-recommends install \
        curl \
        # Used by scripts/check-flow-annotations.sh & scripts/check-storybook-components.sh
        git \
        # Used by selenium
        chromium \
        # Used for pa11y
        libatk-bridge2.0-0 \
        libgtk-3-0 \
        # Used below for unpacking shellcheck program
        xz-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    # Install Hadolint
    curl -sSL -o /usr/bin/hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64 && \
    chmod +x /usr/bin/hadolint && \
    # Install ShellCheck
    SHELLCHECK_VERSION="stable" && \
    curl -sSL "https://github.com/koalaman/shellcheck/releases/download/${SHELLCHECK_VERSION?}/shellcheck-${SHELLCHECK_VERSION?}.linux.x86_64.tar.xz" | \
        tar -xJv -C /tmp && \
    cp "/tmp/shellcheck-${SHELLCHECK_VERSION}/shellcheck" /usr/bin/ && \
    rm -rf "/tmp/shellcheck-${SHELLCHECK_VERSION}"

USER $UID_GID

COPY ./package.json ./yarn.lock /app/
RUN yarn install --network-timeout 100000 --frozen-lockfile && yarn cache clean --force

# Copy in just the files need to build source to avoid cache invalidation from changes to unrelated files
COPY --chown=$UID_GID ./components /app/components
COPY --chown=$UID_GID ./src /app/src
COPY --chown=$UID_GID ./scripts/run-with.js /app/scripts/
COPY --chown=$UID_GID ./hooks /app/hooks
COPY --chown=$UID_GID ./contexts /app/contexts
COPY --chown=$UID_GID ./helpers /app/helpers
COPY --chown=$UID_GID ./lib /app/lib
COPY --chown=$UID_GID ./pages /app/pages
COPY --chown=$UID_GID ./public/images/banners /app/public/images/banners
COPY --chown=$UID_GID ./fixtures /app/fixtures
COPY --chown=$UID_GID ./test/support/mock-cms /app/test/support/mock-cms/
COPY --chown=$UID_GID ./test/support/mock-iss /app/test/support/mock-iss/
COPY --chown=$UID_GID ./.env ./.env.test ./babel.config.json ./next.config.js /app/

# Build Ask Izzy
RUN yarn with --test-env --mocks build

# Copy in all remaining files not excluded by .gitignore
COPY --chown=$UID_GID . /app

# Note this essentially guarantees cache invalidation from this point for builds
# of different versions.
ARG VERSION
RUN echo "Tag: $VERSION" > ./public/VERSION.txt

CMD ["dev"]


###############################################################################
# Distribution                                                                #
#                                                                             #
# This stage contains everything necessary to serve the app and nothing more. #
###############################################################################

FROM base as distribution
ARG UID_GID

COPY ./package.json ./yarn.lock /app/
RUN yarn install --network-timeout 100000 --frozen-lockfile && yarn cache clean --force

# Copy in just the files need to build source to avoid cache invalidation from changes to unrelated files
COPY --chown=$UID_GID ./components /app/components
COPY --chown=$UID_GID ./src /app/src
COPY --chown=$UID_GID ./scripts/run-with.js /app/scripts/
COPY --chown=$UID_GID ./hooks /app/hooks
COPY --chown=$UID_GID ./contexts /app/contexts
COPY --chown=$UID_GID ./helpers /app/helpers
COPY --chown=$UID_GID ./lib /app/lib
COPY --chown=$UID_GID ./pages /app/pages
COPY --chown=$UID_GID ./.storybook /app/.storybook
RUN mkdir -p /app/public/images && chown -R $UID_GID /app/public
COPY --chown=$UID_GID ./public/images/banners /app/public/images/banners
COPY --chown=$UID_GID ./public/images/ask-izzy-logo-single-line-purple.svg /app/public/images/ask-izzy-logo-single-line-purple.svg
COPY --chown=$UID_GID ./fixtures /app/fixtures
COPY --chown=$UID_GID ./test/support/mock-cms /app/test/support/mock-cms/
COPY --chown=$UID_GID ./test/support/mock-iss /app/test/support/mock-iss/
COPY --chown=$UID_GID ./.env ./.env.test ./babel.config.json ./next.config.js /app/

# Upgrading next.js has forced the need to upgrade storybook. And as usual trying to make storybook work with flow.js is always
# a major PITA. Since the typescript migrations is (hopefully just around the corner) rather than waste time trying to make it work
# just disable storybook for now.
# RUN yarn with --test-env --mocks build-storybook

# Copy in all remaining files not excluded by .dockerignore
COPY --chown=$UID_GID . /app

RUN yarn with --test-env --mocks build

ARG VERSION
RUN echo "Tag: $VERSION" > ./public/VERSION.txt

CMD ["serve"]
