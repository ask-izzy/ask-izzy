APP = ask_izzy
REPO = contyard.office.infoxchange.net.au/$(APP)
VERSION_TAG := $(shell git describe)
TAG := $(shell if [ -z "$(CI)" ]; then echo $(VERSION_TAG); else echo "$(VERSION_TAG)-ci"; fi)
FORKLIFT := docker run -t

ifdef CI
runnerid := $(shell grep 'docker/' /proc/1/cgroup | tail -1 | sed 's/^.*\///' | cut -c 1-12)
endif

# Allow multi-line assignments to include a `\` on the end of every
# line (including the last one), which avoids the situation where you
# have to touch two lines in order to add an item to the list.
NULL=

# Default flags for Forklift
FORKLIFT_FLAGS ?=
TEST_FLAGS ?=

# Flags used by Forklift for CI (N.B. you must pass in ISS3_BASE_URL)
CI_FORKLIFT_FLAGS := $(FORKLIFT_FLAGS) \
	-e CI="$(CI)" \
	-e GOOGLE_API_KEY="$(GOOGLE_API_KEY)" \
	-e ISS3_BASE_URL="$(ISS3_BASE_URL)" \
	-e ISS3_API_KEY="$(ISS3_API_KEY)" \
	-e ISS_BASE_URL="$(ISS3_BASE_URL)" \
	-e ISS_API_TOKEN="$(ISS_API_TOKEN)" \
	-e SELENIUM_BROWSER="chrome" \
	-e STRAPI_URL="$(STRAPI_URL)" \
	-e VERSION="$(VERSION)" \
	-e PROXY_DOMAINS='$(PROXY_DOMAINS)' \
	-e NEW_RELIC_CONFIG="$(NEW_RELIC_CONFIG)" \
	-e NEW_RELIC_INFO="$(NEW_RELIC_INFO)" \
	$(NULL)

CI_TEST_FLAGS := $(TEST_FLAGS) \
	$(NULL)

build:
	@test -z "`git status --porcelain`" || echo "WARNING: you have changes to your git repo not committed to this tag"
	docker build --target test -t $(REPO):$(TAG) .
	@echo "Successfully built $(REPO):$(TAG)..."
	@if [ -n "$(CI)" ]; then \
		docker push $(REPO):$(TAG); \
	fi

build-prod:
	@test -z "`git status --porcelain`" || echo "WARNING: you have changes to your git repo not committed to this tag"
	docker build -t $(REPO):$(TAG) .
	@echo "Successfully built $(REPO):$(TAG)..."
	@if [ -n "$(CI)" ]; then \
		docker push $(REPO):$(TAG); \
	fi

dockerpush:
	@if [ -n "$(CI)" ]; then \
		docker tag $(REPO):$(TAG) $(REPO):$(VERSION_TAG); \
		docker rmi $(REPO):$(TAG); \
	fi
	docker push $(REPO):$(VERSION_TAG)

push: dockerpush
	@if git describe --exact-match 2> /dev/null; then \
		for remote in `git remote`; do git push $$remote $(TAG); done; \
	fi

lint:
	$(FORKLIFT) $(CI_FORKLIFT_FLAGS) -- $(REPO):$(TAG) lint

lint-dockerfile:
ifdef CI
	docker run --rm --volumes-from "$(runnerid)" -w "$(CI_PROJECT_DIR)" \
		contyard.office.infoxchange.net.au/hadolint:latest hadolint Dockerfile
else
	docker run --rm -v $(PWD):/mnt -w /mnt \
		contyard.office.infoxchange.net.au/hadolint:latest hadolint Dockerfile
endif

get-lint-pa11y-docker-cmd:
	@echo "$(FORKLIFT) $(CI_FORKLIFT_FLAGS) -- $(REPO):$(TAG) shell -c 'rsync -a /app/public/static/ /static && ./invoke.sh lint-pa11y --ignore-existing-issues'"

unit-test:
	$(FORKLIFT) $(CI_FORKLIFT_FLAGS) -- $(REPO):$(TAG) unit-test $(CI_TEST_FLAGS)

feature-test:
	$(FORKLIFT) $(CI_FORKLIFT_FLAGS) -- $(REPO):$(TAG) feature-test $(CI_TEST_FLAGS)

maps-test:
	$(FORKLIFT) $(CI_FORKLIFT_FLAGS) -- $(REPO):$(TAG) maps-test $(CI_TEST_FLAGS)

personalisation-test:
	$(FORKLIFT) $(CI_FORKLIFT_FLAGS) -- $(REPO):$(TAG) personalisation-test $(CI_TEST_FLAGS)

deploy:
	$(FORKLIFT) -- $(REPO):$(TAG) deploy

serve:
	$(FORKLIFT) -- $(REPO):$(TAG) serve

release:
	@if ! git describe --exact-match 2>/dev/null; then \
		while [ -z "$$CONTINUE" ]; do \
			read -r -p "Release not tagged. Release anyway? y/N " CONTINUE; \
		done ; \
		[ $$CONTINUE = "y" ] || [ $$CONTINUE = "Y" ] || (echo "Exiting."; exit 1;) \
	fi

	rm -rf tags_repo
	git clone \
		--single-branch \
		--depth 1 \
		git@gitlab.office.infoxchange.net.au:devops/tags.git tags_repo
	cd tags_repo && \
		./update_tag "$(APPNAME)" "$(VERSION_TAG)" && \
		git commit -am "Release $(APP) $(VERSION_TAG) to $(APPNAME)" &&\
		git push
	rm -rf tags_repo

.PHONY: build push test deploy serve
