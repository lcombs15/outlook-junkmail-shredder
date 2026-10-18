#!/bin/zsh
set -e
npm run lint:format
npx nx run-many -t test

bws run -- "docker compose down"
bws run -- "docker compose up --build -d"
