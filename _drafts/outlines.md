---
title: Outlines
excerpt: |
    

head: |
    <script async src="/node_modules/es-module-shims/dist/es-module-shims.js"></script>

    <script type="importmap">
    {
        "imports": {
        "three": "/node_modules/three/build/three.module.min.js",
        "three/addons/": "/node_modules/three/examples/jsm/",
        }
    }
    </script>

layout: post
hide_image: true # Only use this image for static previews
image: 
alt: A render of a 3D printed shelf sitting above a shaver outlet, it spins slowly. 
---


<figure>
<canvas id = "threejs" style="width:100%; height: 500px"></canvas>
<figcaption>
Hey look, threeJS!
</figcaption>
</figure>

<script src="/assets/js/three/index.js" type="module"></script>