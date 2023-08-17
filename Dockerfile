ARG UID=1000
ARG GID=1000
ARG HOME="/tmp/home"

###############################################################################
# Prepare environment                                                         #
#                                                                             #
# This stage should should do any setup that is required for in both the      #
# development and serving states.                                             #
###############################################################################

FROM node:16 as base

ARG UID
ARG GID
ARG HOME

ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=$HOME

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
    mkdir /app && \
    ( [ -e "$HOME" ] || mkdir "$HOME" ) && \
    chown -R $UID:$GID /app "$HOME" && \
    # Install system dependences
    apt-get -y update && \
    apt-get -y --no-install-recommends install \
        # Used by start-server-and-test
        procps \
        # Used for open fd debugging
        lsof && \
    mkdir /storage && \
    chown $UID:$GID /storage

USER $UID:$GID

WORKDIR /app

ENTRYPOINT ["yarn", "run"]
VOLUME ["/storage"]
EXPOSE 8000


###############################################################################
# Setup development environment                                               #
#                                                                             #
# All code and dependencies necessary to run the tests, lints and serve a     #
# development version of the app.                                             #
###############################################################################

FROM base as development
ARG UID
ARG GID

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

USER root

# Install any packages needed for building/testing the app.
RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get -y update && \
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
    # Install Hadolint
    curl -sSL -o /usr/bin/hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64 && \
    chmod +x /usr/bin/hadolint && \
    # Install ShellCheck
    SHELLCHECK_VERSION="stable" && \
    curl -sSL "https://github.com/koalaman/shellcheck/releases/download/${SHELLCHECK_VERSION?}/shellcheck-${SHELLCHECK_VERSION?}.linux.x86_64.tar.xz" | \
        tar -xJv -C /tmp && \
    cp "/tmp/shellcheck-${SHELLCHECK_VERSION}/shellcheck" /usr/bin/ && \
    rm -rf "/tmp/shellcheck-${SHELLCHECK_VERSION}" && \
    mkdir -p /tmp/home/.cache/yarn && \
    chown $UID:$GID /tmp/home /tmp/home/.cache /tmp/home/.cache/yarn

USER $UID:$GID

COPY ./package.json ./yarn.lock ./
RUN --mount=type=cache,target=/tmp/home/.cache/yarn,uid=$UID,gid=$GID,sharing=locked \
    --mount=type=cache,target=/tmp/chromedriver,uid=$UID,gid=$GID,sharing=locked \
    yarn install --network-timeout 100000 --frozen-lockfile

COPY --chown=$UID:$GID . .
RUN mkdir /app/.next

# Build Ask Izzy
RUN --mount=type=cache,target=/app/.next/cache,uid=$UID,gid=$GID \
    yarn with --test-env --mocks build && \
    cp -r .next/cache /tmp/.next-cache

# Save cache in image since we re-build at runtime to update any changed env vars
RUN cp -r /tmp/.next-cache .next/cache && rm -rf /tmp/.next-cache

# Note this essentially guarantees cache invalidation from this point for builds
# of different versions.
ARG APP_VERSION
RUN echo "App Version: $APP_VERSION" > ./public/VERSION.txt

CMD ["dev"]


###############################################################################
# Distribution                                                                #
#                                                                             #
# This stage contains everything necessary to serve the app and nothing more. #
###############################################################################

FROM base as distribution
ARG UID
ARG GID

COPY ./package.json ./yarn.lock ./
# We use mount cache for package cache so no need to empty
# hadolint ignore=DL3060
RUN --mount=type=cache,target=/tmp/home/.cache/yarn,uid=$UID,gid=$GID,sharing=locked \
    --mount=type=cache,target=/tmp/chromedriver,uid=$UID,gid=$GID,sharing=locked \
    yarn install --network-timeout 100000 --frozen-lockfile

COPY --chown=$UID:$GID . .
COPY --chown=$UID:$GID --from=development /app/.next .next

# Upgrading next.js has forced the need to upgrade storybook. And as usual trying to make storybook work with flow.js is always
# a major PITA. Since the typescript migrations is (hopefully just around the corner) rather than waste time trying to make it work
# just disable storybook for now.
# RUN yarn with --test-env --mocks build-storybook

ARG APP_VERSION
RUN echo "App Version: $APP_VERSION" > ./public/VERSION.txt

CMD ["serve"]
