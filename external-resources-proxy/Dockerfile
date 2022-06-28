ARG UID_GID=1000:1000
ARG HOME="/tmp"

# hadolint ignore=DL3007
FROM contyard.office.infoxchange.net.au/bullseye-nodejs16:latest as base

ARG UID_GID
ARG HOME

LABEL maintainer="developers@infoxchange.org"
LABEL vendor="infoxchange.org"

ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=$HOME

RUN mkdir -p /static /storage /app "$HOME" && \
      chown -R $UID_GID /static /storage /app "$HOME"

# hadolint ignore=DL3016
RUN npm install -g yarn && \
      chown -R $UID_GID "$HOME"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# hadolint ignore=DL3008
RUN apt-get -y update && \
    apt-get -y --no-install-recommends install \
        curl \
        xz-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# hadolint ignore=DL3003
RUN cd /usr/bin && \
    curl -sSL -o hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64 && \
    chmod +x /usr/bin/hadolint

# hadolint ignore=DL3003
RUN VERSION="stable" && \
    cd /tmp && \
    curl -sSL --output - "https://github.com/koalaman/shellcheck/releases/download/${VERSION?}/shellcheck-${VERSION?}.linux.x86_64.tar.xz" | tar -xJv && \
    cp "shellcheck-${VERSION}/shellcheck" /usr/bin/ && \
    rm -rf "shellcheck-${VERSION}"

USER $UID_GID

WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install && yarn cache clean

# Copy in app source
COPY --chown=$UID_GID . /app

ENTRYPOINT ["yarn", "run"]
EXPOSE 8000
