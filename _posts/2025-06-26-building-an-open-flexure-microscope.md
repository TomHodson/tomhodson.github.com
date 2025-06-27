---
title: Building an Open Flexure Microscope
layout: post
excerpt: Let's build an open source 3D printed micrscope from a kit!
draft: true

assets: /assets/blog/building-an-open-flexure-microscope
thumbnail: /assets/blog/building-an-open-flexure-microscope/thumbnail.png
social_image: /assets/blog/building-an-open-flexure-microscope/thumbnail.png
alt:
image_class: invertable
model_viewer: true
---

This is a page about building an [OpenFlexure Microscope v7](https://openflexure.org/projects/microscope/build). I got the parts as a kit from [Lab Crafter](https://labcrafter.co.uk/products/openflexure-microscope)

<outline-model-viewer model = "{{page.assets}}/complete_microscope.glb" camera='{"type":"perspective","fov":30,"near":0.1,"far":100,"position":[1.736,0.7348,1.667],"rotation":[-0.429,0.7685,0.3078],"zoom":1,"target":[-0.03097,-0.02533,0.004897]}' materials=keep directional-light=15 ambient-light=15>
    <img class="outline-model-poster no-wc" src = "{{page.assets}}/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

## Printing

<figure class="two-wide">
<img src="{{page.assets}}/printing.jpeg" alt = "A quick snap of a 3D printer (heavily modified ender 3) that’s about 12 hours into a 2 day print. The print itself is particularly complex, it looks like some kind of fancy high rise building. Multi coloured wires and zip ties emerge from the hotend. A blue aura comes of the screen to the right. ">
<img src="{{page.assets}}/plate1.jpg" alt = "A photo of a magnetic 3D printer plate, removed from the bed. On top is a plate of complicated looking parts in a dark brown/reddish colour. Three gears are recognisable in the front.">
</figure>

## Further Reading

- [A plugin to record video](https://gitlab.com/openflexure/microscope-extensions/openflexure-videoplugin)
- [A short guide to soil microscopy](https://mikrobiomik.org/inc/Soil_Microscopy_Guide_EN.pdf)
- [A structured illumintation microscope using open flexure stages](https://doi.org/10.1364/OE.461910)
  And [repo](https://github.com/tatsunosukematsui/.stl-files-for-3d-printing-daigo)

- [Contributed mods to the microscope](https://gitlab.com/openflexure/openflexure-microscope-extra)
- Helpful [fedi replies](https://fediscience.org/@Birk_lab/114754694379756310)
