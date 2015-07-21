APP = ask_izzy
REPO = contyard.office.infoxchange.net.au/$(APP)
TAG := $(shell git describe)
FORKLIFT := forklift

# Default flags for Forklift
FORKLIFT_FLAGS ?=
TEST_FLAGS ?=

# Flags used by Forklift for CI (N.B. you must pass in
# and ISS_URL)
CI_FORKLIFT_FLAGS := "$(FORKLIFT_FLAGS) --environment \
	ISS_URL=\"$(ISS_URL)\" \
	--cleanroom \
	"
CI_TEST_FLAGS := "$(TEST_FLAGS) \
	"

build:
	@test -z "`git status --porcelain`" || echo "WARNING: you have changes to your git repo not committed to this tag"
	docker build -t $(REPO):$(TAG) .
	@echo "Successfully built $(REPO):$(TAG)..."
	@echo "make test push"

push:
	docker push $(REPO):$(TAG)

test:
	$(FORKLIFT) $(FORKLIFT_FLAGS) -- $(REPO):$(TAG) test $(TEST_FLAGS)

localtest:
	RUN_AS_USER=true $(FORKLIFT) $(FORKLIFT_FLAGS) -- ./invoke test $(TEST_FLAGS)

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
		./update_tag $(APPNAME) $(TAG) && \
		git commit -am "Release $(APP) $(TAG) to $(TAG)" &&\
		git push
	rm -rf tags_repo

release-staging:
	$(MAKE) release APPNAME=askizzy-staging.infoxchangeapps.net.au

release-prod:
	$(MAKE) release APPNAME=FIXME

.PHONY: build push test deploy serve \
	release release-staging release-prod
