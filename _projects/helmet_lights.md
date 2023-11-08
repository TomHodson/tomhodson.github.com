---
title:  Helmet Lights
layout: post
excerpt: A few different custom mounts to attach lights to bike helmets.
permalink: /projects/helmet_lights

img:
    src: /assets/projects/helmet_lights/thumbnail.svg
    alt: A CAD model of a 3D printable mount for a common LED light onto a helmet.
    class: invertable

social_image: /assets/projects/helmet_lights/thumbnail.png
models: /assets/projects/helmet_lights/models

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

<outline-model-viewer model = "{{page.models}}/model.glb">
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>