---
title:  Lasercut Stool
layout: project
excerpt: A lasercut hexagonal wooden stool.
permalink: /projects/lasercut_stool
assets: /assets/projects/lasercut_stool
date: 2023-08-29

img:
    alt: A CAD model of the this hexagonal lasercut stool.
    class: invertable

# social_image: /assets/projects/
model: /assets/blog/weekend_builds_1/pot.glb

---
<outline-model-viewer model = "{{page.model}}" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[364.9,307.2,459.7],"rotation":[-0.5891,0.5833,0.3527],"zoom":250,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>


<figure>
    <img src="{{ page.assets }}/sketch.jpg">
</figure>
