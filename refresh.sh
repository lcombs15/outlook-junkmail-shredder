docker compose down || echo OK
docker build -t hotmail-junk-removal-tool .
docker compose up
