#!/usr/bin/env bash
bundle install
npm outdated
echo Open http://0.0.0.0:4100
echo Open http://mathmac.local:4100
# bundle exec jekyll serve --draft --future --live --incremental --host 0.0.0.0
bundle exec jekyll serve --live --incremental --livereload --future  --host 0.0.0.0 --port 4100  --livereload-port 4101