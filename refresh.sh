#!/bin/zsh
set -e
npm run lint:format
npx nx run-many -t test

CERT="./apps/web/cert.pem"
KEY="./apps/web/cert-key.pem"

if [[ ! -f "$CERT" ]]; then
    which mkcert >> /dev/null || sudo apt install mkcert

    echo "Generating web cert $CERT"
    mkcert -install
    mkcert -cert-file "$CERT" -key-file "$KEY" $(hostname -I | awk '{print $1}')
fi

sudo npx nx run-many -t docker:build --outputStyle=static 

bws run -- "docker compose down"
bws run -- "docker compose up -d"
