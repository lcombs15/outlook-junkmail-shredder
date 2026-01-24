#!/bin/bash

source /etc/profile

echo Running app - $(date)

cd /app
npm run main

ls -al /mnt/logs
