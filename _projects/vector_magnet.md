---
title:  Vector Magnet
layout: post
excerpt: Make your magnetic fields all 3D like.
permalink: /projects/vector_magnet

img:
    src: /assets/projects/vector_magnet/thumbnail.svg
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
<outline-model-viewer model = "/assets/blog/vector_magnet/vector_magnet.glb" zoom=500 camera='{"position":[-4.187,2.613,-9.927],"rotation":[-2.895,-0.3904,-3.046],"zoom":715.9863905262143,"target":[0.02078,0.1128,-0.01309]}'>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

The project centered around the use of a Nitrogen-Vancancy defect in a nanoscale diamond to detect magnetic fields with ultra high resolution. We experimented with mounting such a nano-diamond to the tip of an atomic force microscope in order to produce field images. I built a 3d vector magnetometer in order to determine the axis of a defect in a nano-diamond.

Check out a little interactive model of the magnetometer below. The device has three pairs of copper Helmholtz coils that generate controlled, linear, magnetic fields in all three directions.

Here's a cutaway view of the interior.

<outline-model-viewer model = "/assets/blog/vector_magnet/vector_magnet_section.glb" zoom=500 spin=false camera='{"position":[-3.078,3.353,10.11],"rotation":[-0.309,-0.2822,-0.08866],"zoom":9794.920097823839,"target":[0.0006876,0.1232,-0.005368]}' true-color=true>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

I should add some color to this but roughly you have:

**AFM Tip**: The atomic force microscope tip (dark blue) with a nano-diamond attached to the very tip. We want to figure out which was the axis the NV defect in this nano-diamond is pointing. To do that we need to expose it to different directions of magnetic field while also blasting it with light and radio waves.

**PCB coil** For the radio wave blasting we have a single turn coil made on a PCB (green). I haven't cut the coil away so that you can see it's whole shape. We'll pump RF power into this tuned to the electronic transitions in the NV defect that we want to probe.

**Microscope Objective** The microscope objective (lower with blue strip) allows us to optically pump the transitions in the NV defect (much like a laser) in order to keep electrons in excited quantum states that they wouldn't normally sit in.

