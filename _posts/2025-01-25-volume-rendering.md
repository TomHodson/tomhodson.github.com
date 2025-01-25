---
title: Volume Rendering
layout: post
excerpt: 
assets: /assets/blog/volume_rendering
draft: true

thumbnail: /assets/blog/volume_rendering/thumbnail.png
social_image: /assets/blog/volume_rendering/thumbnail.png

alt: A volumetric render of a CT scan of my jaw.

model_viewer: true
---

Some text

<figure>
<img class="no-wc invertable" src="{{page.assets}}/billboard.png">
<volume-viewer model="{{page.assets}}/volume_scan.data.gz" model-metadata="{{page.assets}}/volume_scan_meta.json" camera = '{"type":"perspective","position":[-3.598,-0.4154,1.971],"rotation":[0.2078,-1.06,0.1819],"zoom":1,"target":[0,0,0]}'>
</volume-viewer>
<figcaption class="no-wc">If you have JS enabled this is interactive.</figcaption>
<figcaption class="has-wc">An interactive point cloud view of the depth data from the rear facing camera of my phone.</figcaption>
</figure>