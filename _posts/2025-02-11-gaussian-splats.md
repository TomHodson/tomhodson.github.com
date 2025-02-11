---
title: Gaussian Splats
layout: post
excerpt: Having a look at how gaussian splats work.
draft: true

assets: /assets/blog/gaussian-splats
thumbnail: /assets/blog/gaussian-splats/thumbnail.svg
social_image: /assets/blog/gaussian-splats/thumbnail.png
alt:
image_class: invertable

mathjax: true
model_viewer: true
---


Gaussian Splatting is where you take a bunch of images and:
    1) Determine the 3d position and angle from which each image was taken.
    2) Stick a bunch of 3d coloured gaussians in 3D space and run a minimisation algorithm to put the min the right places.
    3) Render the resulting scene

COLMAP for step 1 https://colmap.github.io/index.html
OpenSplat for step 2 https://github.com/pierotofy/OpenSplat?tab=readme-ov-file#build
splat for step 3 https://github.com/antimatter15/splat
viewer using only three.js https://github.com/mkkellogg/GaussianSplats3D
splat editor https://playcanvas.com/supersplat/editor/

relightable gaussian splats: https://github.com/andrewkchan/lit-splat