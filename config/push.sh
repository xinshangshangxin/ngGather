#!/usr/bin/env bash

projectName="template";
nodeEnv="leancloud";
prettyLog="1";

function pushCoding() {
	if [ -n "$1" ]
	then
	  echo "set projectName to $1";
	  projectName=$1;
	fi

	if [ -n "$2" ]
	then
		echo "set NODE_ENV to $2";
	  nodeEnv=$2;
	fi

	if [ -n "$3" ]
	then
		echo "set PRETTY_LOG to $3";
	  prettyLog=$3;
	fi

	gulp prod
	cp ./package.json ./production
	cp ./Dockerfile ./production
	gsed -i "s/\"start\": \".*/\"start\": \"NODE_ENV=${nodeEnv} PRETTY_LOG=${prettyLog} pm2 start .\/index.js --no-daemon\",/g" ./production/package.json
	cd ./production
	git add -A
	git commit -m "auto"  || echo "nothing to commit"
	echo "git push -u production master:${projectName}"
	git push -u production master:${projectName} -f
}

pushCoding $*