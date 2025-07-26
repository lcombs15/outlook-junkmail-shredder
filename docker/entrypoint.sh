#!/bin/bash
set -e

LOG_FILE=/mnt/logs/cron.log

touch $LOG_FILE

echo 'Container started!' $(date)  | tee -a $LOG_FILE

# Ensure cron has all the needed env
export >> /etc/profile

# Run right away to auth
npm run main | tee -a $LOG_FILE

# Start cron
echo "Starting cron service..." && cron

# Keep container running and show logs
tail -f $LOG_FILE
