---
title: Blog
layout: default
permalink: /blog-alt/
mathjax: false
---
{% for post in site.posts %}
<article class="h-entry blogroll">

<figure>
<img class="u-photo" 
    src = "{{ post.thumbnail | default: post.image }}"
    class = "{{ post.image_class }}"
    alt="{{post.alt}}">
</figure>

<section>
  <h2 class="p-name blogroll-title"><a class="u-uid u-url" href="{{ post.url }}">{{ post.title }}</a></h2>
  <time class="dt-published" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date_to_string }}</time>
  <summary class="p-summary">{{ post.excerpt | markdownify | remove: '<p>' | remove: '</p>' }}</summary>
</section>
</article>
{% unless forloop.last %}
  <hr class="blogroll">
{% endunless %}

{% endfor %}