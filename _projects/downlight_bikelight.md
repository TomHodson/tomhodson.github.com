---
title: Downlight<br>Bikelight
layout: project
excerpt: An old ceiling mounted LED downlight becomes a chonky bike light.
permalink: /projects/downlight_bikelight
assets: /assets/projects/downlight_bikelight
images: /assets/projects/downlight_bikelight/img
date: 2025-05-11

img:
  alt: A CAD model of a Bike light made from an old LED downlight.
  class: invertable
  src: /assets/projects/downlight_bikelight/thumbnail.png

social_image: /assets/projects/downlight_bikelight/thumbnail.png
model: /assets/projects/downlight_bikelight/models

head: |
  <script src="/assets/js/expand_img_tags.js" defer></script>
---
I pulled this dying LED downlight out of my kitchen ceiling. 
<figure>
<img src="{{page.images}}/original_location.jpeg" alt="My hand pulling a circular LED downlight out of the ceiling.">
</figure>

In doing so I realised that this downlight has an amusingly chonky heatsink and a nice lens.

<figure class = "two-wide">
<img src="{{page.images}}/laid_out_front.jpeg" alt="All the parts of the downlight laid out on the carpet. There's a lens, LED and various spacers.">
<img src="{{page.images}}/laid_out_top.jpeg" alt="All the parts of the downlight laid out on the carpet. There's a lens, LED and various spacers.">
</figure>

So I made a front plate for it to turn it into a bicycle light. I think it suits the current cobbled together, solarpunky aesthetic of my bike.

<outline-model-viewer model = "{{page.model}}/fbx_export.glb" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[848.5,470.2,-294.9],"rotation":[-2.131,0.9915,2.214],"zoom":300,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "{{page.assets}}/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>


Next job is to actually mount it!

<figure>
<img src="{{page.images}}/cad.jpeg" alt="Me holding the printed out new front ring in front of the CAD model on my laptop.">
</figure>