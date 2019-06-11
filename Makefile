less:
	lessc assets/css/main.less assets/css/main.css

prod:
	-rm -rf dist
	-mkdir dist
	-mkdir dist/node_modules
	-mkdir dist/de
	-mkdir dist/en
	-mkdir dist/assets
	cp -r build dist
	cp -r de/ dist/
	cp -r en/ dist/
	cp -r assets/ dist/
	cp -r node_modules/mithril/ dist/node_modules/
	cp index.html dist

