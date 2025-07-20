---
title: Elegoo Neptune Hotend Mount
layout: project
excerpt: A quick mount for a new hotend on an Elegoo Neptune 3D printer.
permalink: /projects/elegoo_mount
assets: /assets/projects/elegoo_mount
date: 2024-04-13

img:
  alt: A CAD model of a 3D printable mount for hotend on a 3D printer.
  class: invertable
  src: /assets/projects/elegoo_mount/thumbnail.png

social_image: /assets/projects/elegoo_mount/thumbnail.png
draft: false
---

This is just a quick mount for a [BIQU H2V2](https://biqu.equipment/products/biqu-h2-v2-0-extruder) hotend on an Elegoo Neptune 2.

<outline-model-viewer model = "{{page.assets}}/assembly/assembly.glb" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[364.9,307.2,459.7],"rotation":[-0.5891,0.5833,0.3527],"zoom":250,"target":[0,0,0]}' materials=flat ambient-light=2 directional-light=6>
    <img class="outline-model-poster no-wc" src = "{{page.assets}}/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

The mounting holes don't really line up a simple manner so I made this side arms that attach with some heat set inserts. When it's all tightened down it's rigid but I'm nevertheless having some issues with this the nozzle of this printer lifting up a fraction of a millimeter when it pulls in the filament and dropping back down on z retraction.

That should be solvable with some additional z-hop in the slicer and perhaps a bowden tube the lifting force to the frame of the printer.

<figure class="two-wide">
    <img src="{{ page.assets }}/hotend_side.png">
    <img src="{{ page.assets }}/hotend_front.png">
</figure>

<figure>
    <img src="{{ page.assets }}/side_shot.jpg">
</figure>
