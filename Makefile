install: install-deps install-flow-typed

install-deps:
	npm install

install-flow-typed:
	npm run flow-typed install

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
