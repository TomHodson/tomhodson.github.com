---
title: This site now has an .onion address
layout: post
excerpt: Not that it particularly needs one but anyway.

assets: /assets/blog/this-site-now-has-a-onion-address
thumbnail: /assets/blog/this-site-now-has-a-onion-address/thumbnail.svg
social_image: /assets/blog/this-site-now-has-a-onion-address/thumbnail.png
alt:
image_class: invertable

---

I was thinking about the UK's [online safety act], which, at best, is very poorly thought out legislation and, at worse, is a plot to further de-anonymise UK internet users. This got me thinking about VPNs and Tor which lead me to wonder how hard it is to serve a site through a .onion address. 

Behold!

[`thod62d5r447cbmzxysd7xxpotsbbddspmn7q74ekewry4v7hbixv7yd.onion`](http://thod62d5r447cbmzxysd7xxpotsbbddspmn7q74ekewry4v7hbixv7yd.onion)

Turns out it's really easy, [install Tor](https://community.torproject.org/onion-services/setup/) then point Tor at a server on your VPS that's serving the website in question. I had to fiddle a bit to prevent Caddy from redirecting HTTP to HTTPS but apart from that it was simple.

## Optional

**Generate a [vanity address]**. I used this to set the first 4 characters of mine to `thod` followed by. a number. It works by randomly generating addresses so the more characters you want the longer it takes, exponentially.

[**Setup HTTPS**](https://community.torproject.org/onion-services/advanced/https/).
Most .onion sites don't use https on the basis that tor traffic is already encrypted. However as of 2020 you can create TLS certs for .onion address. The main blocker is that currently Let's Encrypt, the de facto TLS CA for everything now, does support generating certs for .onion addresses yet. You can still do it if you're willing to shell out 30 euros a year for it, Neil has a [write up](https://neilzone.co.uk/2022/03/upgrading-my-onion-site-to-https/).


**Add an [Onion-Location] to your cleartext site** so that Tor users know there's an onion alternative available. The best way to do this is with a custom HTTP header, see the linked site for ways to do this, for caddy it looks like:

```
header Onion-Location http://example.onion{path}
```

You can also do it using a HTML, here I've used the jekyll `page.url` variable, which I can actually also evaluate inline look: `{{page.url}}`, to make the link point to whichever page you're currently on.

```html
<meta 
    http-equiv="onion-location" 
    content="http://example.onion{{ page.url }}" 
/>
```

[Onion-Location]: https://community.torproject.org/onion-services/advanced/onion-location/
[vanity address]: https://community.torproject.org/onion-services/advanced/vanity-addresses/
[online safety act]: https://en.wikipedia.org/wiki/Online_Safety_Act_2023#Criticism