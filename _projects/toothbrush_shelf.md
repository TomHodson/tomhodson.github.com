---
title:  Toothbrush Shelf
layout: post
excerpt: A shelf to put your toothbrush charger on.
permalink: /projects/toothbrush_shelf
assets: /assets/projects/toothbrush_shelf

img:
    alt: A CAD model of a small shelf to put a toothbrush right above the charging socket so that the cabling can be hidden inside the shelf.
    class: invertable

social_image: /assets/projects/toothbrush_shelf/thumbnail.png
model: /assets/blog/toothbrush_shelf/model/toothbrush_shelf.glb

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
<outline-model-viewer model = "{{page.model}}" camera='{"position":[5.148,4.038,8.952],"rotation":[-0.4169,0.4809,0.2021],"zoom":1248.587161014231,"target":[0.03319,0.06938,-0.01135]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>