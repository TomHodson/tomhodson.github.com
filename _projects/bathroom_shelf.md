---
title:  Bathroom Shelf
layout: post
excerpt: A little modification to an IKEA thingy.
permalink: /projects/bathroom_shelf
assets: /assets/projects/bathroom_shelf

img:
    alt: A small bathroom shelf.
    class: invertable

social_image: /assets/projects/bathroom_shelf/thumbnail.png
model: /assets/projects/bathroom_shelf/models/ikea.glb

head: |
    <script async src="/node_modules/es-module-shims/dist/es-module-shims.js"></script>
    <script type="importmap">
    {
        "imports": {
        "three": "/node_modules/three/build/three.module.min.js",
        "three/addons/": "/node_modules/three/examples/jsm/",
        "lil-gui": "/node_modules/lil-gui/dist/lil-gui.esm.min.js"
        }
    }
    </script>
    <script src="/assets/js/outline-model-viewer/index.js" type="module"></script>
---
<outline-model-viewer model = "/assets/projects/bathroom_shelf/models/ikea.glb" zoom=845>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

{% include mastodon_post.html post_id = "111822564173512216" %}

<img src="/assets/projects/bathroom_shelf/test.jpeg" alt="test">