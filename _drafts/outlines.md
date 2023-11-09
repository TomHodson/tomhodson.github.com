---
title: Outlines
excerpt: |
    

head: |
    <script async src="https://unpkg.com/es-module-shims@1.8.0/dist/es-module-shims.js"></script>

    <script type="importmap">
    {
        "imports": {
        "three": "https://unpkg.com/three@0.156.1/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.156.1/examples/jsm/"
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