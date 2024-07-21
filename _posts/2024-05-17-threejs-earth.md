---
title: ThreeJS Earth
layout: post
excerpt: A small earth renderer made using ThreeJS

image:
thumbnail: /assets/blog/sphere_geodesics/thumbnail.png
assets: /assets/blog/sphere_geodesics/
alt: 

head: |
    <script async src="/node_modules/es-module-shims/dist/es-module-shims.js"></script>
    <script type="importmap">
    {
        "imports": {
        "three": "/node_modules/three/build/three.module.min.js",
        "three/addons/": "/node_modules/three/examples/jsm/",
        "three/examples/": "/node_modules/three/examples/jsm/",
        "lil-gui": "/node_modules/lil-gui/dist/lil-gui.esm.min.js"
        }
    }
    </script>
    <script src="/assets/blog/sphere_geodesics/index.js" type="module"></script>
---
A small earth renderer made using ThreeJS. The most fun thing here is to max out the dislacement scale to see how big the Himalayas are! <a href = "https://github.com/TomHodson/tomhodson.github.com/tree/main/assets/blog/sphere_geodesics">Code here.</a>
<sphere-viewer style="height: 500px; display: block;"></sphere-viewer>