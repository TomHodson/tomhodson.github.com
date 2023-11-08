---
title:  Bike Lights
layout: post
excerpt: Making a custom 3W dynamo light for a bike.
permalink: /projects/bike_lights

img:
    src: /assets/projects/bike_lights/thumbnail.svg
    alt: A CAD model of a 3D printable mount for a common LED light onto a bike handlebar.
    class: invertable

social_image: /assets/projects/bike_lights/thumbnail.png
model: /assets/projects/bike_lights/model

head: |
    <script async src="https://unpkg.com/es-module-shims@1.8.0/dist/es-module-shims.js"></script>

    <script type="importmap">
    {
        "imports": {
        "three": "https://unpkg.com/three@0.156.1/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.156.1/examples/jsm/",
        "dat.gui": "https://unpkg.com/dat.gui@0.7.9/build/dat.gui.module.js"
        }
    }
    </script>
    <script src="/assets/js/three/index.js" type="module"></script>
---

<outline-model-viewer model = "/assets/projects/bike_lights/models/bigger.glb">
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

<img src = "/assets/projects/bike_lights/bike_light.jpg">

