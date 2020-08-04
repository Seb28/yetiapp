# Before using this Dockerfile, a .npmrc file should be created with the values
# "always-auth=true" and "_auth=****"

# Use the official Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:10.21.0-alpine3.11

RUN apk add --no-cache --update bash ca-certificates curl gnupg \
  g++ make lz4-dev musl-dev cyrus-sasl-dev openssl-dev \
  python unzip wget jpeg-dev pango-dev cairo-dev pixman-dev \
  git

RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev \
  bsd-compat-headers py-setuptools bash

RUN git clone https://github.com/edenhill/librdkafka.git && \
  cd librdkafka && \
  ./configure --install-deps && \
  make && \
  make install

ENV BUILD_LIBRDKAFKA=0
ENV LD_LIBRARY_PATH=/usr/local/lib

# Create and change to the app directory.
RUN cd /usr && mkdir src && cd src && mkdir app
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY lib ./lib

# Run the web service on container startup.
CMD [ "npm", "run", "start" ]
