---
title: A new day, a new domain.
layout: post
excerpt: I just registered thod.dev and bought my first VPS.

assets: /assets/blog/a-new-day-a-new-domain
thumbnail: /assets/blog/a-new-day-a-new-domain/thumbnail.svg
social_image: /assets/blog/a-new-day-a-new-domain/thumbnail.png
alt: An image of the text 'thod.dev'.
image_class: invertable
---

I bought [thod.dev](https://thod.dev) a while back because I wanted a slightly shorter domain to play with than [the one you're at](https://thomashodson.com). In light of what's happening in the US I'm also thinking about starting to get onto the self hosting train. These are my baby steps in that direction.

After browsing [european-alternatives.eu](https://european-alternatives.eu/) and reddit a bit I settled on a €4 a month VPS from [netcup](https://www.netcup.com) to start.

I set up the DNS entries in Cloudfare. Not quite an EU alternative but baby steps. Then I Installed caddy. It took me a while to understand how to configure caddy through systemctl but it's [here](https://caddyserver.com/docs/running) if you need it here. Here's my tiny cheatsheet for caddy:

|                                                  	|                                      	|
|--------------------------------------------------	|--------------------------------------	|
| Change Caddy proxy setup                         	| `code /etc/caddy/Caddyfile`          	|
| Reload caddy (also status, start, stop, restart) 	| `systemctl reload caddy`             	|
| More details on caddy                            	| `journalctl -xeu caddy.service`      	|
| Who's listening on a port.                       	| `lsof -i :80`                        	|
| See live access logs                             	| `tail -f /var/log/caddy/access.log ` 	|
| See process logs                                 	| `tail -f /var/log/caddy/process.log` 	|
| Start/stop a service at boot                     	| `systemctl enable [service]`         	|

My caddyfile is a series of entries like this, they just direct subdomains to internal docker images or servers. Note that it's much easier to setup subdomains i.e `git.thod.dev` than it is to do something like `thod.dev/git/*`.

```caddy
git.thod.dev {
  import logging
  reverse_proxy localhost:3000
}

music.thod.dev {
  import logging
  reverse_proxy localhost:4533
}
```

Interesting side note: Caddy handles getting TLS certs and https fr you pretty well! The one slightly unexpected side effect of this is that the moment you get a cert issued (which caddy does automatically) for a subdomain, that will become a matter of public record. There are many many bots configured to automatically start sniffing around for vulnerabilities on your server, here's a snippet of some requests I got within minutes of setting up a new subdomain:

```
GET /@vite/env HTTP/1.1
GET /actuator/env HTTP/1.1
GET /server HTTP/1.1
GET /.vscode/sftp.json HTTP/1.1
GET /about HTTP/1.1
GET /debug/default/view?panel=config HTTP/1.1
GET /v2/_catalog HTTP/1.1
GET /ecp/Current/exporttool/microsoft.exchange.ediscovery.exporttool.application HTTP/1.1
GET /server-status HTTP/1.1
GET /login.action HTTP/1.1
GET /_all_dbs HTTP/1.1
GET /.DS_Store HTTP/1.1
GET /.env HTTP/1.1
GET /.git/config HTTP/1.1
GET /s/3313e22343e28363e2838313/_/;/META-INF/maven/com.atlassian.jira/jira-webapp-dist/pom.properties HTTP/1.1
GET /config.json HTTP/1.1
GET /telescope/requests HTTP/1.1
GET /info.php HTTP/1.1
GET /?rest_route=/wp/v2/users/ HTTP/1.1
```

So far I don't have any data/passwords/private keys/etc on this server that I would particularly mind losing or having stolen. Before changing that I think I'll need to do a thorough security review of this box.

## Experiments so far:

### Mirror of this site @ [thod.dev](https://thod.dev)

This is just a test really, I doubt I'll ever fully move from `thomashodson.com` fully to `thod.dev` but maybe one day!

### Miniflux  @ miniflux.thod.dev

I still need to setup some kind of action to rebuild this mirror.

For a few years now I've paid for [theoldreader](https://theoldreader.com/) as an rss reader but lately I wanted some kind of API to access my lists of read and unread posts and couldn't really find it from theoldreader, so I'm starting to switch over to a self hosted miniflux, so far so good!

### Gitea @ [git.thod.dev](https://git.thod.dev)

I've put up a gitea instance and mirrored a couple repos from github. Haven't quite decided how to use this yet!

### Navidrome @ music.thod.dev

I've uploaded various music that I have locally from bandcamp and such to a navidrome instance. 

### Tiny Webservers

Since I have this server I seems like a good time to play with so more dynamic stuff. My first foray into that is a tiny rust webserver hosted at [api.thod.dev/tiny_servers/single_threaded](https://api.thod.dev/tiny_servers/single_threaded). It just returns a json response telling you how many times this endpoint has been hit since the last time I rebooted it!

<figure id="hit-counter">
<span>??</span>
<figcaption>
hits since last reboot.
</figcaption>
</figure>

<style>
#hit-counter figcaption {
    margin-left: 0.5em;
    text-align: left;
    width: 6em;
}

#hit-counter {
    display: flex;
    justify-content: center;
    align-items: last baseline;
}

#hit-counter span {
    font-family: Impact;
    font-size: 5em;
}
</style>

<script type="module">
let counter = document.querySelector("#hit-counter span");
counter.innerHTML = await fetch("https://api.thod.dev/tiny_servers/single_threaded")
.then(response => response.json())
.then(json => json.hits);
</script>

Try it out with `curl -vvv https://api.thod.dev/tiny_servers/single_threaded` and [the webserver code is here](https://github.com/TomHodson/tomhodson.github.com/blob/main/experiments/tiny_webservers/src/bin/single_threaded.rs).