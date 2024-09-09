---
title: Projects
layout: default
permalink: /projects/
excerpt: |
  I'm Tom Hodson. Welcome to my little home on the web! There's a blog, a cv and some projects to look at.
img:
    src: /assets/projects/lego_adapters/thumbnail.svg
    alt: 
    class: invertable
    
social_image: /assets/projects/lego_adapters/thumbnail.png
---
<section class="title-date-container">
    <h1 class = "highlights">Projects</h1>
    <span class="dt-label">Last Modified</span>
</section>
<hr class="heading">

{% for post in site.projects %}
{% include project_summary.html %}
{% endfor %}