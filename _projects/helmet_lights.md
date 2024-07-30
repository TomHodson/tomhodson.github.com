---
title:  Helmet Lights
layout: post
excerpt: A few different custom mounts to attach lights to bike helmets.
permalink: /projects/helmet_lights
assets: /assets/projects/helmet_lights

img:
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
        "lil-gui": "/node_modules/lil-gui/dist/lil-gui.esm.min.js"
        }
    }
    </script>
    <script src="/assets/js/outline-model-viewer/index.js" type="module"></script>
---

<outline-model-viewer model = "{{page.models}}/model.glb" zoom=60>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

Similar to the [bike lights](/projects/bike_lights) project, I've made a few adapters to attach lights to helmets over time. Here's the latest iteration. The light is an off the shelf model that you can slip out the side to recharge it. The two pieces fit snugly in the front air hole in the helmet. 

<img src = "/assets/projects/helmet_lights/with_helmet_model.png" alt="A cad model of the mounts attached to a kinda poor quality 3D scan of the helmet">