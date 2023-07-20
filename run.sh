#!/usr/bin/env bash
bundle exec jekyll serve --draft --future &
sleep 2
open http://0.0.0.0:4000