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
    <script async src="/node_modules/es-module-shims/dist/es-module-shims.js"></script>
    <script type="importmap">
    {
        "imports": {
        "three": "/node_modules/three/build/three.module.min.js",
        "three/addons/": "/node_modules//three/examples/jsm/",
        "dat.gui": "https://unpkg.com/dat.gui@0.7.9/build/dat.gui.module.js"
        }
    }
    </script>
    <script src="/assets/js/outline-model-viewer/index.js" type="module"></script>
---

<outline-model-viewer model = "{{page.models}}/model.glb" zoom=60>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>