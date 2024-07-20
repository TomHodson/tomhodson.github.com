---
title: Blog
layout: default
excerpt: |
  I'm Tom Hodson. Welcome to my little home on the web! There's a blog, a cv and some projects to look at.
mathjax: false
img:
    src: /assets/images/avatar.jpeg
    alt: A picture of me.
---
{% for post in site.posts %}
{% include post_summary.html %}
{% endfor %}