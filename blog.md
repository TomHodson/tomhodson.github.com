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

{% assign draft_posts = site.posts | where: "draft", "true" %}
{% assign published_posts = site.posts | where: "draft", "false" %}

{% if jekyll.environment == 'development' %}
{% for post in draft_posts %}
{% include post_summary.html %}
{% endfor %}
{% endif %}

{% for post in published_posts limit:5 %}
{% include post_summary.html %}
{% endfor %}