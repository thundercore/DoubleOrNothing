CONDA := $(HOME)/miniconda3/bin/conda

TOP_DIR := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
CONDA_ENV_DIR := $(TOP_DIR)/conda-env

# This can be used to customized local builds.
-include $(TOP_DIR)/Local.mk

PATH := $(CONDA_ENV_DIR)/bin:$(TOP_DIR)/node_modules/.bin:$(PATH)
export PATH

PREFERRED_INTERACTIVE_SHELL ?= bash
PS1_NAME ?= 'double-or-nothing'
MAKE_SHELL_PS1 ?= '$(PS1_NAME) $$ '
.PHONY: shell
ifeq ($(PREFERRED_INTERACTIVE_SHELL),bash)
shell:
	@INIT_FILE=$(shell mktemp); \
	printf '[ -e $$HOME/.bashrc ] && source $$HOME/.bashrc\n' > $$INIT_FILE; \
	printf '[ -e Local.env ] && source Local.env\n' >> $$INIT_FILE; \
	printf 'PS1='"$(MAKE_SHELL_PS1) "'\n' >> $$INIT_FILE; \
	$(PREFERRED_INTERACTIVE_SHELL) --init-file $$INIT_FILE || true
else ifeq ($(PREFERRED_INTERACTIVE_SHELL),fish)
shell:
	@INIT_FILE=$(shell mktemp); \
	printf 'if functions -q fish_right_prompt\n' > $$INIT_FILE; \
	printf '    functions -c fish_right_prompt __fish_right_prompt_original\n' >> $$INIT_FILE; \
	printf '    functions -e fish_right_prompt\n' >> $$INIT_FILE; \
	printf 'else\n' >> $$INIT_FILE; \
	printf '    function __fish_right_prompt_original\n' >> $$INIT_FILE; \
	printf '    end\n' >> $$INIT_FILE; \
	printf 'end\n' >> $$INIT_FILE; \
	printf 'function fish_right_prompt\n' >> $$INIT_FILE; \
	printf '    echo -n "($(PS1_NAME)) "\n' >> $$INIT_FILE; \
	printf '    __fish_right_prompt_original\n' >> $$INIT_FILE; \
	printf 'end\n' >> $$INIT_FILE; \
	$(PREFERRED_INTERACTIVE_SHELL) --init-command="source $$INIT_FILE" || true
else
shell:
	@$(PREFERRED_INTERACTIVE_SHELL) || true
endif

.PHONY: conda-env
conda-env:
	if [ ! -d $(CONDA_ENV_DIR) ]; then \
		$(CONDA) env create -f environment.yml -p $(CONDA_ENV_DIR); \
	else \
		$(CONDA) env update -f environment.yml -p $(CONDA_ENV_DIR); \
	fi
	yarn install
