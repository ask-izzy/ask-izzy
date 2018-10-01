ARG commonPackages='apt-transport-https \
    ca-certificates \
    nginx \
    parallel'

FROM contyard.office.infoxchange.net.au/stretch-nodejs8 as test

ARG commonPackages

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production

WORKDIR /app

# Install Debian packages
RUN \
    apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y --no-install-recommends install \
        ${commonPackages} \
        git \
        sudo \
        wget \
        chromium \
        build-essential \
        python \
        libelf-dev

# Install the yarn deps
COPY package.json npm-shrinkwrap.json yarn.lock /app/
RUN npm install -g yarn && \
    yarn config set registry http://apt.office.infoxchange.net.au/npm && \
    yarn --frozen-lockfile && \
    yarn cache clean

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
