---
title: Triangle Shelves
layout: project
excerpt: A bookcase to fit in a very particular place.
permalink: /projects/triangle_shelves
assets: /assets/projects/triangle_shelves
date: 2023-02-08
draft: true

img:
  alt: A line drawn CAD model of vector magnet.
  class: invertable
  src: /assets/projects/triangle_shelves/thumbnail.svg

social_image: /assets/projects/triangle_shelves/thumbnail.png
---

This project, part of my Master's thesis in 2018, centered around the use of a Nitrogen-Vancancy defect in a nanoscale diamond to detect magnetic fields with ultra high resolution. We experimented with mounting such a nano-diamond to the tip of an atomic force microscope in order to produce field images. I built a 3d vector magnetometer in order to determine the axis of a defect in a nano-diamond.

<outline-model-viewer model = "/assets/blog/vector_magnet/vector_magnet.glb" camera='{"type":"perspective","fov":30,"near":100,"far":10000,"position":[13.73,540.1,-1020],"rotation":[-2.655,0.0119,3.135],"zoom":428,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

Check out this interactive model of the magnetometer. The device has three pairs of copper Helmholtz coils that generate controlled, linear, magnetic fields in all three directions.

Here's a cutaway view of the interior.

<outline-model-viewer model = "/assets/blog/vector_magnet/vector_magnet_section.glb" spin=false camera='{"type":"perspective","fov":30,"near":100,"far":1000,"position":[-253.2,261.7,839],"rotation":[-0.3023,-0.2805,-0.08613],"zoom":2860.0091628398345,"target":[0,0,0]}' materials=flat ambient-light="5" directional-light="5">
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

**AFM Tip**: The atomic force microscope tip (dark blue) with a nano-diamond attached to the very tip. We want to figure out which was the axis the NV defect in this nano-diamond is pointing. To do that we need to expose it to different directions of magnetic field while also blasting it with light and radio waves.

**PCB coil** For the radio wave blasting we have a single turn coil made on a PCB (green). I haven't cut the coil away so that you can see it's whole shape. We'll pump RF power into this tuned to the electronic transitions in the NV defect that we want to probe.

**Microscope Objective** The microscope objective (lower with blue strip) allows us to optically pump the transitions in the NV defect (much like a laser) in order to keep electrons in excited quantum states that they wouldn't normally sit in.
