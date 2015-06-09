push:
	git add -A \
	&& git commit -m "$(m)" \
	&& git push origin master
one:
	git add -A \
	&& git commit -m "$(m)" \
	&& git push $(r) master