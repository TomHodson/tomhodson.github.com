---
title: Blog
layout: default
permalink: /
redirect_from:
  - /blog/
head: <script type="module" src="/assets/js/model-viewer.js"></script>
---
{% for post in site.posts %}
<article class="h-entry blogroll">

<img class="u-photo" 
    src = "{{ post.thumbnail | default: post.image }}"
      alt="{{post.alt}}">

<section class="title">
  <h2 class="p-name blogroll-title"><a class="u-uid u-url" href="{{ post.url }}">{{ post.title }}</a></h2>
  <time class="dt-published" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date_to_string }}</time>
</section>

<summary class="p-summary">{{ post.excerpt | markdownify | remove: '<p>' | remove: '</p>' }}</summary>

</article>
{% endfor %}