---
title: Selfhosting: Miniflux and RSSHub
excerpt: |
    Some notes on selfhosting and RSS reader
---

Like many nerdy, computery types, I like to subscribe to blogs and other content through RSS. RSS is crazy simple, you host a url on a website with a list of posts with titles/URLs/content encoded in XML (I know I know but it only have like 5 tags and is only nested one level deep.) An RSS reader just checks a big list of those URLs every now and then and presents you the latest thing to show up. 

Incidentally this is also how podcasts work, at least for a while, Spotify is clearly trying to capture it.

Anyway, I usually use [theoldreader](https://theoldreader.com/) to read RSS feeds but lately they've implemented a premium version that you have to pay $3 a month for if you have more than 100 feeds (I have 99...).

Honestly, I use their service a lot so somehow $3 doesn't seem so bad, but it spurred me to look into selfhosting. 

Selfhosting seems to be all the rage these days. Probably in response to feeling locked in to corporate mega structures, the aforementioned computery nerdy types have gone looking for ways to maintain their own anarchic web infrastructure. See i.e [the indieweb movement](https://indieweb.org/), [mastodon](https://joinmastodon.org/) etc etc etc

So I want to try out some self hosting. Let's start with an RSS reader. [Miniflux](https://miniflux.app/) seems well regarded. So I popped over their, grabbed a `docker-compose.yml`, ran `docker compose up -d` and we seem to be off to the races.

Ok, a nice thing about Miniflux when compared to theoldreader is the former seems to be better at telling you when there's something wrong with your feeds. It told me about a few blogs it couldn't reach, notably [Derek Lowe's excellent blog about chemical drug discovery](https://www.science.org/blogs/pipeline).

That blog has an [rss feed](https://www.science.org/blogs/pipeline/feed), which loads perfectly find in my browser but doesn't seem to work when outside of that context, i.e in python:

```python
>>> import requests
>>> requests.get("https://blogs.sciencemag.org/pipeline/feed")
<Response [403]>
```

Playing around a bit more, adding in useragents, accepting cookies and following redirects, I eventually get back a page with a challenge that requires JS to run. This is the antithesis of how RSS should work!

Ok so to fix this I came upon [RSSHub](https://docs.rsshub.app/en/) which is a kind of RSS proxy, it parses sites that don't have RSS feeds and generates them for you. I saw that this has pupeteer support so I'm hopping that I can use it to bypass the anti-crawler tactics science.org is using.

Anyway, for how here is a docker-compose.yml for both miniflux and RSSHub. What took me a while to figure out is that docker containers live in their own special network. So to subscribe to a selfhosted RSSHub feed you need to put something like "http://rsshub:1200/" where rsshub is the key to the image in the yaml file below.

```
version: '3'

services:
  miniflux:
    image: miniflux/miniflux:latest
    # build:
    #   context: .
    #   dockerfile: packaging/docker/alpine/Dockerfile 
    container_name: miniflux
    restart: always
    healthcheck:
      test: ["CMD", "/usr/bin/miniflux", "-healthcheck", "auto"]
    ports:
      - "8889:8080"
    depends_on:
      - rsshub
      - db

    environment:
      - DATABASE_URL=postgres://miniflux:secret@db/miniflux?sslmode=disable
      - RUN_MIGRATIONS=1
      - CREATE_ADMIN=1
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=test123
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=miniflux
      - POSTGRES_PASSWORD=secret
    volumes:
      - miniflux-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "miniflux"]
      interval: 10s
      start_period: 30s

  rsshub:
      # two ways to enable puppeteer:
      # * comment out marked lines, then use this image instead: diygod/rsshub:chromium-bundled
      # * (consumes more disk space and memory) leave everything unchanged
      image: diygod/rsshub
      restart: always
      ports:
          - '1200:1200'
      environment:
          NODE_ENV: production
          CACHE_TYPE: redis
          REDIS_URL: 'redis://redis:6379/'
          PUPPETEER_WS_ENDPOINT: 'ws://browserless:3000'  # marked
      depends_on:
          - redis
          - browserless  # marked

  browserless:  # marked
      image: browserless/chrome  # marked
      restart: always  # marked
      ulimits:  # marked
        core:  # marked
          hard: 0  # marked
          soft: 0  # marked

  redis:
      image: redis:alpine
      restart: always
      volumes:
          - redis-data:/data

volumes:
  miniflux-db:
  redis-data:
```