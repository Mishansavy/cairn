RUFF_VERSION := 0.15.0

.PHONY: lint test build

lint:
	uvx ruff@$(RUFF_VERSION) check pipeline

test:
	python3 -m unittest discover -s pipeline

build:
	cd site && npm ci && npm run build
