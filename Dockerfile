# Use Node.js LTS as the base image
FROM ubuntu
FROM node:24-slim

# Install cron
RUN apt-get update && \
    apt-get install -y cron \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

COPY . .

RUN npm ci

RUN npm run test

RUN npm run lint

RUN npm run build

RUN chmod +x docker/*.sh

RUN chmod 0644 ./docker/crontab && \
    crontab ./docker/crontab

CMD ["/app/docker/entrypoint.sh"]
