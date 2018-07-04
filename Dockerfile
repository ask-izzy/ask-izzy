ARG commonPackages='apt-transport-https \
    ca-certificates \
    nginx \
    parallel'

FROM contyard.office.infoxchange.net.au/stretch as test

ARG commonPackages

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production

WORKDIR /app

# Install Debian packages
RUN \
    echo "Adding nodejs gpg key" && \
    curl -sL 'https://deb.nodesource.com/gpgkey/nodesource.gpg.key' | apt-key add - && \
    echo "Adding nodejs repo" && \
    echo 'deb https://deb.nodesource.com/node_8.x stretch main' > /etc/apt/sources.list.d/nodesource.list && \
    apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y --no-install-recommends install \
        ${commonPackages} \
        nodejs \
        git \
        sudo \
        wget \
    && \
    # Required by node-gyp
    apt-get -y install \
    build-essential \
    python \
    && \
    # Required by flow (static type checker for JavaScript).
    apt-get -y install \
        libelf-dev

# Install the npm deps
COPY package.json npm-shrinkwrap.json bower.json /app/
RUN npm install && \
    npm install --only=dev && \
    npm cache clean --force && \
    $(npm bin)/bower install --allow-root

# Install and build the app
ADD . /app

RUN git describe > public/VERSION && \
    script/build-assets && \
    script/build-gmaps-file

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000


FROM contyard.office.infoxchange.net.au/stretch

ARG commonPackages

# Pallet standard locations
VOLUME ["/static", "/storage"]
RUN useradd -d /app -r app && \
    mkdir -p /static /storage /app && \
    chown -R app /static /storage /app

WORKDIR /app

COPY --from=test /app /app

# forward request and error logs to docker log collector
RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y --no-install-recommends install \
        ${commonPackages} \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && mkdir -p /usr/share/nginx/conf/ \
    && cp /app/conf/nginx.conf /usr/share/nginx/conf/nginx.conf \
    && rm -rf /app/node_modules

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000
