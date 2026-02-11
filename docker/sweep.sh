#!/bin/bash

source /etc/profile

echo Running app - $(date)

curl -X POST http://localhost:3000/outlook/sweepJunkmail
