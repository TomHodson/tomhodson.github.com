---
title: Projects
layout: default
redirect_from:
  - /projects/
---
{% for post in site.projects %}
<article class="h-entry project">
    {% unless post.hide_image %}
    <figure class="blogroll">
    <img class="u-photo" src = "{{post.image}}" alt="{{post.alt}}">
    </figure>
    {% endunless %}

    <section>
    <h2 class="p-name blogroll-title"><a class="u-uid u-url" href="{{ post.url }}">{{ post.title }}</a></h2>
    <time class="dt-published" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date_to_string }}</time>
    <summary class="p-summary">{{ post.excerpt | markdownify | remove: '<p>' | remove: '</p>' }}</summary>
    </section>
</article>
{% endfor %}