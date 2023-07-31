#!/usr/bin/env bash
# sleep 3 && open --url http://0.0.0.0:4000 &
bundle exec jekyll build --config _config.yml,_config_dev.yml --draft --future --watch