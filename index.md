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
<div class="image-container">
    <img class="u-photo" 
        src = "{{ post.thumbnail | default: post.image }}"
         alt="{{post.alt}}">
</div>

<section class="blogroll">
  <h2 class="p-name blogroll-title"><a class="u-uid u-url" href="{{ post.url }}">{{ post.title }}</a></h2>
  <time class="dt-published" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date_to_string }}</time>
  <summary class="p-summary">{{ post.excerpt | markdownify | remove: '<p>' | remove: '</p>' }}</summary>
</section>
</article>
{% endfor %}