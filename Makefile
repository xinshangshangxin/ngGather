dev:
	node config/dev_start.js
supervisor:
	supervisor -n error -i 'sites/public/,sites/views/,static/' sites/app.js
push:
	git add -A \
	git commit -m "$(m)" \
	git push origin master
one:
	git add -A \
	git commit -m "$(m)" \
	git push $(r) master
start:
	./node_modules/pm2/bin/pm2 start production/app.js --no-daemon
test:
	mocha --recursive --timeout 10000 -R spec --require should --harmony test/ --bail