---
title:  Bathroom Shelf
layout: project
excerpt: A little modification to an IKEA thingy.
permalink: /projects/bathroom_shelf
assets: /assets/projects/bathroom_shelf
date: 2023-12-17

img:
    alt: A small bathroom shelf.
    class: invertable

social_image: /assets/projects/bathroom_shelf/thumbnail.png
model: /assets/projects/bathroom_shelf/models/ikea.glb

---
We got this [IKEA shower shelf thing][shelf] from Ikea which has two sticky pads at the back to attach to the wall. The spacing just didn't work with the tile spacing so I printed a new top bit for it using some natural pla I had lying around.  I think it's the stealthiest print I've done!

<!-- {% include mastodon_post.html post_id = "111822564173512216" %} -->

<outline-model-viewer model = "/assets/projects/bathroom_shelf/models/model.glb" camera='{"type":"perspective","fov":30,"near":10,"far":10000,"position":[364.9,307.2,459.7],"rotation":[-0.5891,0.5833,0.3527],"zoom":250,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "{{page.assets}}/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>


<figure>
<img src="/assets/projects/bathroom_shelf/test.jpeg" alt="test">
<figcaption>The new shelf in place.</figcaption>
</figure>

### Files

* [Liner STL][liner]
* [Back Plat STL][back_plate]
* [STEP file][step]

[liner]: {{page.assets}}/models/liner.stl
[back_plate]: {{page.assets}}/models/back_plate.stl
[step]: {{page.assets}}/models/soap_tray.step
[shelf]: https://www.ikea.com/gb/en/p/oebonaes-wall-shelf-with-suction-cup-grey-green-00498896/