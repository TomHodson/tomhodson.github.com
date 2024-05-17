---
title: "Weekend builds: Bookshelf"
layout: post
excerpt: | 
    We needed something to lift our books a little off the surface of the windowsill...

image:
thumbnail: /assets/blog/bookshelf/thumbnail.jpg
assets: /assets/blog/bookshelf/
alt: 
head: <script type="module" src="/assets/js/model-viewer.js"></script>
---

Here's a little weekend project. We have this mezzanine bed with windows and window shelves around it. I'd like to put books there but sometimes condensation pools so I need something to raise the books a little above the level of the shelf.

<figure>
<model-viewer src="{{page.assets}}/scan.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls shadow-intensity="2" shadow-softness="1" camera-orbit="63.08deg 66.62deg 1.102m" field-of-view="30deg" interaction-prompt="none" auto-rotate alt="A scan of some books piled against a yellow pillar."> </model-viewer>
<figcaption>
Because I can't resist, here's a scan of the relevant area. This one was done with <a href="https://poly.cam/">Polycam</a>  
</figcaption>
</figure>



<figure>
<section class="image-grid-4x4">
<img src = "{{page.assets}}/img/all_curves.png">
<img src = "{{page.assets}}/img/lower_curves.png">
<img src = "{{page.assets}}/img/lower_curves_feet.png">
<img src = "{{page.assets}}/img/no_curves.png">
</section>
<figcaption>
Playing around with different designs, I went for the middle ground of having some curves at the base but not the top. I wanted them to be catenary curves but couldn't figure out how to do that in fusion so went with arcs instead. 
</figcaption>
</figure>

<figure>
<section class="image-grid-4x4">
<img src = "{{page.assets}}/img/laser_cutting.jpeg">
<img src = "{{page.assets}}/img/hot_off_the_press.jpeg">
<img src = "{{page.assets}}/img/in_place.jpeg" style=" grid-column: 1 / 3;
  grid-row: 2;">
</section>
<figcaption>
The final product, I'm not fully happy with the proportions, it's a little too big relative to the books in real life. I created the books from that polycam scan so I must have gotten the scale wrong somehow.
</figcaption>
</figure>