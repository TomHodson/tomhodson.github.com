---
title: Outline Rendering
layout: post
excerpt: I'm currently obsessed with the aesthetic of rendering angular CAD like 3D assets with thin black lines. 

models: /assets/blog/outline_rendering

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
        "lil-gui": "/node_modules/lil-gui/dist/lil-gui.esm.min.js"
        }
    }
    </script>
    <script src="/assets/js/projects.js" type="module"></script>

draft: true
---

First we have the scene exported with no additional normal information. Because of this, the render calculates the normal for each triangle of the mesh and lights it based on that, this is why we can see the individual faces of the cylinder and torus so easily.

<figure>
<outline-model-viewer model = "{{page.models}}/no_uvs_no_normals_no_vertex_colours.glb" materials=keep mode=2 ambient-light="1.5" directional-light="5" camera = '{"position":[-3.493,4.932,-9.259],"rotation":[-2.652,-0.3214,-2.975],"zoom":223.15174865581577,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>
<figcaption>Three simple meshes made in blender. I've exported these with no UVs, nor normals.</figcaption>
</figure>

Next let's add in normals. 

<figure>
<outline-model-viewer model = "{{page.models}}/with_normals.glb" materials=flat mode=2 ambient-light="1.5" directional-light="5" camera = '{"position":[-3.493,4.932,-9.259],"rotation":[-2.652,-0.3214,-2.975],"zoom":223.15174865581577,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>
<figcaption>With smooth normals.</figcaption>
</figure>