---
title: Projects
layout: default
permalink: /projects/
---
{% for post in site.projects %}
<article class="h-entry project">
    <a class="u-uid u-url" href="{{ post.url }}">
    <img class="u-photo {{post.img.class}}" src = "{{post.img.src}}" alt="{{post.img.alt}}">
    </a>

    <section>
    <h2 class="p-name blogroll-title"><a class="u-uid u-url" href="{{ post.url }}">{{ post.title }}</a></h2>
    <!-- <time class="dt-published" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date_to_string }}</time> -->
    <summary class="p-summary">{{ post.excerpt | markdownify | remove: '<p>' | remove: '</p>' }}</summary>
    </section>
</article>
{% endfor %}