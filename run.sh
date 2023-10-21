#!/usr/bin/env bash
sleep 8 && open --url http://0.0.0.0:4000 &
bundle exec jekyll serve #--draft --future