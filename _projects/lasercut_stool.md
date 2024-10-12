---
title:  Lasercut Stool
layout: post
excerpt: A lasercut hexagonal wooden stool.
permalink: /projects/lasercut_stool
assets: /assets/projects/lasercut_stool

img:
    alt: A CAD model of the this hexagonal lasercut stool.
    class: invertable

# social_image: /assets/projects/
model: /assets/blog/weekend_builds_1/pot.glb

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
<outline-model-viewer model = "{{page.model}}" camera='{"position":[7.699,4.641,6.436],"rotation":[-0.6243,0.7663,0.4633],"zoom":229.77238881409951,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>