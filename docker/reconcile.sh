#!/bin/bash

source /etc/profile

echo Running app - $(date)

curl --silent -X POST http://localhost:3000/outlook/reconcile
