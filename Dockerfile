FROM contyard.office.infoxchange.net.au/jessie

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production

# Pallet standard locations
VOLUME ["/static", "/storage"]
RUN useradd -d /app -r app && \
    mkdir -p /static /storage /app && \
    chown -R app /static /storage /app

WORKDIR /app

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000

# Install Debian packages
RUN \
    echo "Adding nodejs gpg key" && \
    curl -sL 'https://deb.nodesource.com/gpgkey/nodesource.gpg.key' | apt-key add - && \
    echo "Adding nodejs repo" && \
    echo 'deb https://deb.nodesource.com/node_5.x jessie main' > /etc/apt/sources.list.d/nodesource.list && \
    apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y --no-install-recommends install \
        apt-transport-https \
        ca-certificates \
        nodejs \
        nginx \
        git \
        sudo \
    && apt-get -y --purge autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

# Install the npm deps
COPY package.json bower.json /app/
RUN npm install && \
    npm install --only=dev && \
    npm cache clean && \
    $(npm bin)/bower install --allow-root

# Install and build the app
ADD . /app

RUN script/build-assets && \
    echo "const VERSION = \"`git describe`\"" > src/_version.js && \
    chown -R app .

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /usr/share/nginx/conf/
RUN cp /app/conf/nginx.conf /usr/share/nginx/conf/nginx.conf
