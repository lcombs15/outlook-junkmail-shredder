# Use Node.js LTS as the base image
FROM ubuntu
FROM node:24-slim

# Install cron
RUN apt-get update && \
    apt-get install -y cron curl npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY *json .
COPY .prett* .

COPY apps/api ./apps/api

RUN npm ci

RUN npx nx run apps/api:test

RUN npx nx run apps/api:build

WORKDIR /code/apps/api

RUN chmod +x docker/*.sh

RUN chmod 0644 ./docker/crontab && \
    crontab ./docker/crontab

CMD ["./docker/entrypoint.sh"]
