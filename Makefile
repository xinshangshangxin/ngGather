.PHONY: all test clean static
dev:
	node config/dev_start.js
supervisor:
	supervisor -n error -i 'app/public/,app/views/,config/tasks/' app/app.js
push:
	git push origin v2
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
static:
	gulp static
	cd static && hs
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
startOpenShift:
	pm2 start app.js
pushOpenShift:
	cp .git/config production/.git; \
	cp ./package.json ./production; \
	cp Makefile ./production/Makefile; \
	cd ./production; \
	git add -A; \
	git commit -m "auto"; \
	git push openshift master -f;
