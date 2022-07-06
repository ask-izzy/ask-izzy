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
# hadolint ignore=DL3025
ENTRYPOINT exec bash -c "\
    chown -R $UID_GID /storage /static && \
    echo Set volume file permissions && \
    ls -hal /storage /static \
"


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
        procps && \
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
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy in app source
COPY --chown=$UID_GID . /app

# Note this essentially guarantees cache invalidation from this point for builds
# of different versions.
ARG VERSION
RUN echo $VERSION > ./public/VERSION.txt && \
    # Build Ask Izzy
    yarn with --test-env --mocks build

ENV VERSION=$VERSION

CMD ["dev"]


###############################################################################
# Distribution                                                                #
#                                                                             #
# This stage contains everything necessary to serve the app and nothing more. #
###############################################################################

FROM base as distribution
ARG UID_GID

COPY ./package.json ./yarn.lock /app/
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy in app source
COPY --chown=$UID_GID . /app

ARG VERSION
RUN echo $VERSION > ./public/VERSION.txt && \
    yarn with --test-env --mocks build-storybook

ENV VERSION=$VERSION

CMD ["serve"]
