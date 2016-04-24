.PHONY: all test clean static
d='template2'
dev:
	sh config/start.sh
node-dev:
	node-dev app/app.js
supervisor:
	supervisor -n error -i 'app/public/,app/views/,config/tasks/' app/app.js
push:
	git push origin v4
test:
	@ if [ -n "$(g)" ]; \
	then \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test; \
	else \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail test; \
	fi
prod:
	gulp prod
	node production/app.js
pushProd:
	cp ./package.json ./production
	cd ./production && git add -A && git commit -m "auto" && git push origin master:production
pushStatic:
	cd ./static && git add -A && git commit -m "auto" && git push origin master:gh-pages -f
pushAll:
	gulp prod; \
	cp ./package.json ./production; \
	cd ./production; \
	git add -A; \
	git commit -m "auto"; \
	git push origin master:production;
	gulp static; \
	cd ./static; \
	git add -A; \
	git commit -m "auto"; \
	git push origin master:gh-pages -f;
static:
	gulp static
	cd static && hs
copy:
	cp -r ./ ../$(d)
	rm -r ../$(d)/.idea
	rm -r ../$(d)/.git
openshift:
	NODE_ENV=openshift pm2 start app.js --max-memory-restart 256M