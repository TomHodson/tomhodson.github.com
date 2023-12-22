---
title:  Lasercut Stool
layout: post
excerpt: A lasercut hexagonal wooden stool.
permalink: /projects/lasercut_stool

img:
    src: /assets/projects/lasercut_stool/thumbnail.svg
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
<outline-model-viewer model = "{{page.model}}" camera='{"position":[2.11,4.722,9.765],"rotation":[-0.4425,0.1813,0.08522],"zoom":471.1588632880538,"target":[0.1159,0.06564,-0.06329]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>