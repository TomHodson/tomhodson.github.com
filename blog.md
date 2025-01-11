---
title: Blog
layout: default
permalink: /blog/
excerpt: |
  I'm Tom Hodson. Welcome to my little home on the web! There's a blog, a cv and some projects to look at.
mathjax: false
img:
    src: /assets/images/avatar.jpeg
    alt: A picture of me.
---
<section class="title-date-container">
    <h1 class = "highlights">Blog</h1>
    <span class="dt-label">Date Posted</span>
</section>
<hr class="heading">
{% for post in site.posts %}
{% if post.draft == false or jekyll.environment == "development" %}
{% include post_summary.html %}
{% endif %}
{% endfor %}