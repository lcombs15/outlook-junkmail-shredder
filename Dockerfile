# Use Node.js LTS as the base image
FROM ubuntu
FROM node:20-slim

ENV TZ=America/New_York
# Install cron
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build
RUN npm run build

RUN chmod +x docker/*.sh

RUN chmod 0644 ./docker/crontab && \
    crontab ./docker/crontab

# Create log file
RUN touch /var/log/cron.log

CMD ["/app/docker/entrypoint.sh"]
