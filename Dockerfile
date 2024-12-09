############################################
# Base Image
############################################

FROM serversideup/php:8.3-fpm-nginx-alpine AS base


USER root
RUN install-php-extensions memcached



############################################
# Composer installs
############################################
FROM base AS composer
WORKDIR /app

COPY composer*.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY app app
COPY bootstrap bootstrap
COPY storage storage
COPY routes routes
RUN composer install --no-dev


############################################
# Node installs
############################################
FROM node:lts-alpine AS node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG APP_URL
ARG REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME

ENV VITE_APP_URL=${APP_URL}
#ENV VITE_ASSET_URL=${APP_URL}
#ENV ASSET_URL=${APP_URL}
#ENV FRONTEND_URL=${APP_URL}

ENV VITE_REVERB_APP_KEY=${REVERB_APP_KEY}
ENV VITE_REVERB_HOST=${REVERB_HOST}

RUN echo "Building with APP_URL=${APP_URL}"
RUN echo "VITE_REVERB_HOST: ${VITE_REVERB_HOST}"
RUN echo "VITE_REVERB_PORT: ${VITE_REVERB_PORT}"
RUN echo "VITE_REVERB_SCHEME: ${VITE_REVERB_SCHEME}"

ENV NODE_ENV production
RUN npm run build

############################################
# Development Image
############################################
FROM base AS development

ARG USER_ID
ARG GROUP_ID

USER root

RUN docker-php-serversideup-set-id www-data $USER_ID:$GROUP_ID  && \
    docker-php-serversideup-set-file-permissions --owner $USER_ID:$GROUP_ID --service nginx

USER www-data

############################################
# C/I Install
############################################

FROM base AS ci

USER root
RUN echo "user = www-data" >> /usr/local/etc/php-fpm.d/docker-php-serversideup-pool.conf && \
    echo "group = www-data" >> /usr/local/etc/php-fpm.d/docker-php-serversideup-pool.conf


############################################
# Prod Image
############################################

FROM base AS deploy
WORKDIR /var/www/html

COPY --from=node:lts-alpine /usr/local/bin /usr/local/bin
COPY --from=node:lts-alpine /usr/local/lib /usr/local/lib
COPY --from=node:lts-alpine /usr/lib /usr/lib

RUN npm install -g puppeteer

COPY --from=node --chown=www-data:www-data /app/public/build ./public/build
COPY --from=composer --chown=www-data:www-data /app/vendor ./vendor

COPY --chown=www-data:www-data . .

STOPSIGNAL SIGQUIT

USER www-data
