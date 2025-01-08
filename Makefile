# Make
# http://www.gnu.org/software/make/manual/make.html

# A macro used to get arguments inside tasks
# https://stackoverflow.com/a/47008498
ARGS = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

# https://www.gnu.org/software/make/manual/make.html#Options-Summary
MAKEFLAGS += --silent

.PHONY: 2016
2016:
	@cd 2016 && pnpm run day 2016 $(call ARGS)

2016-test:
	@cd 2016 && pnpm test 2016/$(call ARGS)/*.test.ts

2016-test-all:
	@cd 2016 && pnpm test 2016/**/*.test.ts

2016-prepare:
	YEAR=2016 make prepare $(call ARGS)

.PHONY: 2023
2023:
	@cd 2023 && cargo build --quiet && ./target/debug/aoc $(call ARGS)

.PHONY: 2023-test
2023-test:
	@cd 2023 && cargo watch --exec 'test -- --show-output day_$(call ARGS)'

2023-prepare:
	mkdir 2023/src/day_$(call ARGS)
	cp 2023/src/day_template.rs 2023/src/day_$(call ARGS)/mod.rs
	touch 2023/src/day_$(call ARGS)/input.txt
	touch 2023/src/day_$(call ARGS)/sample.txt

.PHONY: 2024
2024:
	@cd 2024 && pnpm run day 2024 $(call ARGS)

2024-test:
	@cd 2024 && pnpm test 2024/$(call ARGS)/*.test.ts

2024-test-all:
	@cd 2024 && pnpm test 2024/**/*.test.ts

2024-prepare:
	mkdir 2024/$(call ARGS) || true
	cp 2024/00/00.ts 2024/$(call ARGS)/$(call ARGS).ts
	cp 2024/00/00.test.ts 2024/$(call ARGS)/$(call ARGS).test.ts
	sed -i "s/00/$(call ARGS)/" 2024/$(call ARGS)/$(call ARGS).test.ts
	touch 2024/$(call ARGS)/input.txt
	touch 2024/$(call ARGS)/sample.txt

prepare:
	mkdir -p $(YEAR)/$(call ARGS) || true
	cp utils/day-template/00.ts $(YEAR)/$(call ARGS)/$(call ARGS).ts
	cp utils/day-template/00.test.ts $(YEAR)/$(call ARGS)/$(call ARGS).test.ts
	sed -i "s/0000/$(YEAR)/" $(YEAR)/$(call ARGS)/$(call ARGS).test.ts
	sed -i "s/00/$(call ARGS)/" $(YEAR)/$(call ARGS)/$(call ARGS).test.ts
	touch $(YEAR)/$(call ARGS)/input.txt
	touch $(YEAR)/$(call ARGS)/sample.txt

pretty:
	prettier **/*.{cjs,js,mjs,ts} --write

# Source: https://www.thapaliya.com/en/writings/well-documented-makefiles/
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(shell echo $(MAKEFILE_LIST) | sed 's/ /\n/g' | sort | tr '\n' ' ')

# This allows us to accept extra arguments
# https://stackoverflow.com/a/47008498
%:
	@:
