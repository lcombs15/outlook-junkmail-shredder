#!/bin/bash
set -e

LOG_FILE=/mnt/logs/cron.log

touch $LOG_FILE

echo 'Container started!' $(date)  >> $LOG_FILE

# Ensure cron has all the needed env
export >> /etc/profile

# Run right away to auth
npm run main | tee -a $LOG_FILE

# Start cron
echo "Starting cron service..." && cron

echo "Starting REST api"
{npm run api | tee -a $LOG_FILE} &

# Keep container running and show logs
cat $LOG_FILE
tail -n 0 -f $LOG_FILE
