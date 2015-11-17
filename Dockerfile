FROM debian:jessie

ENV DEBIAN_FRONTEND noninteractive
# default value -- overwritten by ENVIRONMENT if required
ENV NODE_ENV production

# Pallet standard locations
VOLUME ["/static", "/storage"]
RUN useradd -d /app -r app && \
    mkdir -p /static /storage && \
    chown -R app /static /storage
WORKDIR /app
ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000

# Install node into the container
RUN echo "Disabling non-essential packages" && \
    echo "APT::Install-Recommends \"0\";" >> /etc/apt/apt.conf.d/02recommends && \
    echo "APT::Install-Suggests \"0\";" >> /etc/apt/apt.conf.d/02recommends && \
    echo "Installing packages to allow update of nodejs" && \
    apt-get -qq update && \
    apt-get -qq upgrade && \
    apt-get -qq install \
        apt-transport-https \
        ca-certificates \
        curl \
        && \
    echo "Adding nodejs gpg key" && \
    curl -sL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "Adding nodejs repo" && \
    echo 'deb https://deb.nodesource.com/node_4.x jessie main' > /etc/apt/sources.list.d/nodesource.list && \
    echo "Installing required packages" && \
    apt-get -qq update && \
    apt-get -qq install \
        git \
        nodejs \
        sudo \
        && \
    echo "Cleaning up" && \
    apt-get clean

# Install the npm deps
COPY package.json /app/
RUN npm install && \
    npm cache clean

RUN node_modules/.bin/bower install

# Install and build the app
ADD . /app
RUN script/build-assets && \
    echo "const VERSION = \"`git describe`\"" > src/_version.js && \
    chown -R app .
