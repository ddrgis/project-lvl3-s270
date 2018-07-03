install: 
	npm install

dev:
	npm run dev

build:
	rm -rf dist
	npm run webpack

test:
	npm test

lint:
	npm run eslint .

publish:
	npm publish
