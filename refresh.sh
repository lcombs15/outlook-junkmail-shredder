export COMPOSE_BAKE=true
bws run -- "sudo -E docker compose down"
bws run -- "sudo -E docker compose up --build -d"
