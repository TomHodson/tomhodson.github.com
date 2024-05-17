---
title: ThreeJS Earth
layout: post
excerpt: A small earth renderer made using ThreeJS

image:
thumbnail:
assets: 
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
A small earth renderer made using ThreeJS.
<sphere-viewer style="height: 500px; display: block;"></sphere-viewer>