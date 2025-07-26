sudo docker stack remove hotmail-junk-removal
sudo docker build -t hotmail-junk-removal-tool .
deploy () {
	sudo docker stack deploy -c docker-compose.yml hotmail-junk-removal --detach=true
}

# For some reason the docker stack is angry sometimes
do
  deploy
done while [ ! $? -eq 0 ]
