# Make
# http://www.gnu.org/software/make/manual/make.html

# A macro used to get arguments inside tasks
# https://stackoverflow.com/a/47008498
ARGS = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

# https://www.gnu.org/software/make/manual/make.html#Options-Summary
MAKEFLAGS += --silent

.PHONY: 2023
2023:
	@cd 2023 && cargo build --quiet && ./target/debug/aoc $(call ARGS)

# Source: https://www.thapaliya.com/en/writings/well-documented-makefiles/
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(shell echo $(MAKEFILE_LIST) | sed 's/ /\n/g' | sort | tr '\n' ' ')

# This allows us to accept extra arguments
# https://stackoverflow.com/a/47008498
%:
	@:
