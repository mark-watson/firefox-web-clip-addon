test:
	cfx run

makepackage:
	cfx xpi

deploy: makepackage
	cp kb-select.xpi ../../../resources/public/
