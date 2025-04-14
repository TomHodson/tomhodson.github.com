---
title: A new day, a new domain.
layout: post
excerpt: I just registered thod.dev and bought my first VPS.
draft: true

assets: /assets/blog/a-new-day-a-new-domain
thumbnail: /assets/blog/a-new-day-a-new-domain/thumbnail.svg
social_image: /assets/blog/a-new-day-a-new-domain/thumbnail.png
alt:
image_class: invertable
---

I bought [thod.dev](https://thod.dev) a while back because I wanted a slightly shorter domain to play with than [the one you're at](https://thomashodson.com). In light of what's happening in the US I'm also thinking about starting to get onto the self hosting train. These are my baby steps in that direction.

After browsing [european-alternatives.eu](https://european-alternatives.eu/) and reddit a bit I settling on a €4 a month VPS from [netcup](https://www.netcup.com) to start.

I set up the DNS entries in Cloudfare. Eeek not quite an EU alternative but baby steps.

Installed nginx and caddy. Took me a while to understand how to configure caddy through systemctl but it's [here](https://caddyserver.com/docs/running).

<figure style="width: 50%">
    <img src="{{ page.assets }}/thumbnail.png">
</figure>

I also put a gitea instance at [git.thod.dev](https://git.thod.dev) to test that out.

<figure style="width: 50%">
    <img src="{{ page.assets }}/gitea.png">
</figure>

I haven't quite decided what I'll use this for yet. Various experiments that require more than just the static file hosting I've been using github pages.
