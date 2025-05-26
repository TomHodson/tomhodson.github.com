---
title: A Portfolio Website
layout: project
excerpt: A portfolio website for a friend of mine who is an artist and musician. He did the art I just added CSS.
permalink: /projects/montys_website
assets: /assets/projects/montys_website
date: 2023-11-12
draft: True

img:
  alt:
  class: invertable
  src: /assets/projects/montys_website/thumbnail.svg

social_image: /assets/projects/montys_website/bio_pic.png

head: |
  <script type="module" src="/assets/js/model-viewer.js"></script>
---

<figure>
<img src="{{page.assets}}/bio_page.png">
</figure>

<figure>
<img src="{{page.assets}}/map_page.png">
<figcaption>Click to zoom</figcaption>
</figure>

<model-viewer src = "{{page.assets}}/test.glb" camera-controls></model-viewer>

<model-viewer src = "{{page.assets}}/test2.glb" camera-controls></model-viewer>

<model-viewer src = "{{page.assets}}/test3.glb" camera-controls></model-viewer>

<!-- <outline-model-viewer model = "{{page.assets}}/test.glb" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[364.9,307.2,459.7],"rotation":[-0.5891,0.5833,0.3527],"zoom":250,"target":[0,0,0]}'
ambient-light="6" directional-light="0.8" materials=keep mode=2

>

    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>

</outline-model-viewer>

<outline-model-viewer model = "{{page.assets}}/test2.glb" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[364.9,307.2,459.7],"rotation":[-0.5891,0.5833,0.3527],"zoom":250,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

<outline-model-viewer model = "{{page.assets}}/test3.glb" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[364.9,307.2,459.7],"rotation":[-0.5891,0.5833,0.3527],"zoom":250,"target":[0,0,0]}' materials=keep mode=2 ambient-light="6" directional-light="0.8">
    <img class="outline-model-poster no-wc" src = "{{page.models}}/pots/pots.png">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer> -->
