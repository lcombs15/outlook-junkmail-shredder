#!/bin/bash
set -e

LOG_FILE=/mnt/logs/cron.log

touch $LOG_FILE
cat $LOG_FILE

echo 'Container started!' $(date)  >> $LOG_FILE

# Ensure cron has all the needed env
export >> /etc/profile

# Run right away to auth
npm run main | tee -a $LOG_FILE

# Start cron
echo "Starting cron service" >> $LOG_FILE
cron || echo "Cron running already" >> $LOG_FILE

echo "Starting REST api" >> $LOG_FILE
npm run api >> $LOG_FILE &

# Keep container running
tail -n 0 -f $LOG_FILE
