#!/bin/bash
set -e

# Run the app once on startup
echo "Running app on startup..."
cd /app && npm run run

# Start cron
echo "Starting cron service..."
cron

# Keep container running and show logs
tail -f /var/log/cron.log
