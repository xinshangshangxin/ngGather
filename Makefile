.PHONY: all test clean static
d='template2'
dev:
	@sh config/start.sh
node-dev:
	node-dev app/app.js
supervisor:
	supervisor -n error -i 'app/public/,app/views/,config/tasks/' app/app.js
push:
	git push origin v4
merge:
	git fetch template template
	git merge remotes/template/template
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
pushHeroku: 
	cp ./package.json ./production
	sed -i '' 's/"start": "NODE_ENV=.*/"start": "NODE_ENV=heroku pm2 start .\/app.js --no-daemon",/g' ./production/package.json
	cd ./production && git add -A && git commit -m "auto" && git push heroku master && heroku logs --tail
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
	if [ -n "$(b)" ]; \
	then \
		rm -rf ../$(d)/app/public; \
		rm -rf ../$(d)/config/gulp/config.js; \
		mv ../$(d)/config/gulp/backendConfig.js ../$(d)/config/gulp/config.js; \
		rm -rf ../$(d)/app/views/index.html; \
		mv ../$(d)/app/views/backendIndex.html ../$(d)/app/views/index.html; \
	else \
		rm -rf ../$(d)/config/gulp/backendConfig.js; \
		rm -rf ../$(d)/app/views/backendIndex.html; \
	fi
	rm -rf ../$(d)/.idea
	rm -rf ../$(d)/.git
openshift:
	NODE_ENV=openshift pm2 start app.js