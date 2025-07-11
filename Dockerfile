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

# Create crontab file
RUN echo "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" > /etc/cron.d/app-cron && echo "*/2 * * * * cd /app && printenv && /usr/local/bin/npm run run >> /var/log/cron.log 2>&1" >> /etc/cron.d/app-cron && \
    chmod 0644 /etc/cron.d/app-cron && \
    crontab /etc/cron.d/app-cron

# Create log file
RUN touch /var/log/cron.log

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


# Run the app once on startup, then start cron
CMD ["/entrypoint.sh"]
