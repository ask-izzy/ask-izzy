ARG commonPackages='apt-transport-https \
    ca-certificates \
    gettext \
    nginx \
    parallel \
    wget'

FROM contyard.office.infoxchange.net.au/stretch-nodejs12:latest as test

ARG commonPackages

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_ENV=production

VOLUME ["/static", "/storage"]

WORKDIR /app

RUN \
    useradd -d /app -r app && \
    mkdir -p /static /storage /app && \
    chown -R app /static /storage /app && \
    apt-get -y update && \
    apt-get -y --no-install-recommends install \
        ${commonPackages} \
        git \
        sudo \
        chromium \
        build-essential \
        python \
        libelf-dev \
        # Used for pa11y
        libatk-bridge2.0-0 \
        libgtk-3-0 && \
    npm install -g yarn && \
    yarn config set registry http://apt.office.infoxchange.net.au/npm

USER app

# Install node modules
COPY --chown=app package.json yarn.lock /app/
RUN yarn --frozen-lockfile && \
    yarn cache clean
ENV PATH /app/node_modules/.bin:$PATH

# Install and build the app
COPY --chown=app . /app
RUN git describe > public/VERSION && \
    script/build-assets && \
    yarn build-storybook

# Ideally this container should not be started as root.
# hadolint ignore=DL3002
USER root

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000


FROM contyard.office.infoxchange.net.au/stretch:latest

ARG commonPackages

ENV DEBIAN_FRONTEND=noninteractive

VOLUME ["/static", "/storage"]

RUN useradd -d /app -r app

WORKDIR /app

COPY --from=test /app /app

RUN apt-get -y update && \
    apt-get -y --no-install-recommends install \
        ${commonPackages} \
    && rm -rf /app/node_modules \
    && chown -R app .

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000
