# Make
# http://www.gnu.org/software/make/manual/make.html

# A macro used to get arguments inside tasks
# https://stackoverflow.com/a/47008498
ARGS = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

# https://www.gnu.org/software/make/manual/make.html#Options-Summary
MAKEFLAGS += --silent

run:
	$(eval YEAR:=$(word 2, $(MAKECMDGOALS)))
	$(eval DAY:=$(word 3, $(MAKECMDGOALS)))

	pnpm run day $(YEAR) $(DAY)

test:
	$(eval YEAR:=$(word 2, $(MAKECMDGOALS)))
	$(eval DAY:=$(word 3, $(MAKECMDGOALS)))

	pnpm test $(YEAR)/$(DAY)/*.test.ts

test-year:
	$(eval YEAR:=$(word 2, $(MAKECMDGOALS)))

	pnpm test $(YEAR)/**/*.test.ts

test-all:
	pnpm test **/*.test.ts

prepare:
	$(eval YEAR:=$(word 2, $(MAKECMDGOALS)))
	$(eval DAY:=$(word 3, $(MAKECMDGOALS)))

	mkdir -p $(YEAR)/$(DAY) || true

	cp utils/day-template/00.ts $(YEAR)/$(DAY)/$(DAY).ts
	cp utils/day-template/00.test.ts $(YEAR)/$(DAY)/$(DAY).test.ts
	sed -i "s/0000/$(YEAR)/" $(YEAR)/$(DAY)/$(DAY).test.ts
	sed -i "s/00/$(DAY)/" $(YEAR)/$(DAY)/$(DAY).test.ts

	touch $(YEAR)/$(DAY)/input.txt
	touch $(YEAR)/$(DAY)/sample.txt

pretty:
	prettier **/*.{cjs,js,mjs,ts} --write

2023:
	@cd 2023 && cargo build --quiet && ./target/debug/aoc $(call ARGS)

2023-test:
	@cd 2023 && cargo watch --exec 'test -- --show-output day_$(call ARGS)'

# Source: https://www.thapaliya.com/en/writings/well-documented-makefiles/
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(shell echo $(MAKEFILE_LIST) | sed 's/ /\n/g' | sort | tr '\n' ' ')

# This allows us to accept extra arguments
# https://stackoverflow.com/a/47008498
%:
	@:
