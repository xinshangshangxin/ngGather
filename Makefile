all:
	git add -A 
	git commit -m "auto"
	git push origin gh-pages
	git push coding gh-pages:static