push:
	git add -A \
	&& git commit -m "$(m)" \
	&& git push origin master
one:
	git add -A \
	&& git commit -m "$(m)" \
	&& git push $(r) master
start:
	npm install pm2 -g && pm2 start app.js --no-daemon