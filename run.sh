#!/usr/bin/env bash
bundle install
echo Open http://0.0.0.0:4000
# bundle exec jekyll serve --draft --future --live --incremental
bundle exec jekyll serve --live --incremental --livereload --future --host 0.0.0.0