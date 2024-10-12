---
title:  Vector Magnet
layout: post
excerpt: Make your magnetic fields all 3D like.
permalink: /projects/vector_magnet
assets: /assets/projects/vector_magnet

img:
    alt: A line drawn CAD model of vector magnet.
    class: invertable

social_image: /assets/projects/vector_magnet/thumbnail.png

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
<outline-model-viewer model = "/assets/blog/vector_magnet/vector_magnet.glb" zoom=500 camera='{"position":[3.118,3.203,10.1],"rotation":[-0.3104,0.2858,0.0902],"zoom":428.68750000000136,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

The project centered around the use of a Nitrogen-Vancancy defect in a nanoscale diamond to detect magnetic fields with ultra high resolution. We experimented with mounting such a nano-diamond to the tip of an atomic force microscope in order to produce field images. I built a 3d vector magnetometer in order to determine the axis of a defect in a nano-diamond.

Check out a little interactive model of the magnetometer below. The device has three pairs of copper Helmholtz coils that generate controlled, linear, magnetic fields in all three directions.

Here's a cutaway view of the interior.

<outline-model-viewer model = "/assets/blog/vector_magnet/vector_magnet_section.glb" spin=false camera='{"position":[-3.069,3.172,10.17],"rotation":[-0.3052,-0.2811,-0.08718],"zoom":2860.0091628398345,"target":[0.007077,-0.02863,0.01116]}' true-color=true>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

I should add some color to this but roughly you have:

**AFM Tip**: The atomic force microscope tip (dark blue) with a nano-diamond attached to the very tip. We want to figure out which was the axis the NV defect in this nano-diamond is pointing. To do that we need to expose it to different directions of magnetic field while also blasting it with light and radio waves.

**PCB coil** For the radio wave blasting we have a single turn coil made on a PCB (green). I haven't cut the coil away so that you can see it's whole shape. We'll pump RF power into this tuned to the electronic transitions in the NV defect that we want to probe.

**Microscope Objective** The microscope objective (lower with blue strip) allows us to optically pump the transitions in the NV defect (much like a laser) in order to keep electrons in excited quantum states that they wouldn't normally sit in.

