---
title: My first PCB!
excerpt: |
    I've had a longstanding ambition to get a PCB manufactured but I've always put it off. Lately I had a need for a little adapter board to break out these 1.27mm spaced pins to 2.54mm pins that would fit into a breadboard. Feeling like it was a simple enough board I finally decided to fire up KiCad and give it a go.   <model-viewer alt="An interactive 3D render of a PCB with 2.54mm headers on one side to fit a breadboard and 1.27 inch headers on the other." src="/assets/blog/PCB/model/pcb.glb" ar camera-controls poster="/assets/social/pcb_1.png" interaction-prompt="none" shadow-intensity="1" shadow-softness="1" exposure="0.5" camera-orbit="196.6deg 59.73deg 0.1m" field-of-view="30deg" auto-rotate> </model-viewer>
layout: post
commentid: 110810437631337327
hide_image: true # Only use this image for static previews
social_image: /assets/social/pcb_1.png
alt: A 3D render of a simple PCB.
---
I made my first PCB!

<figure>
<model-viewer alt="An interactive 3D render of a PCB with 2.54mm headers on one side to fit a breadboard and 1.27 inch headers on the other." src="/assets/blog/PCB/model/pcb.glb" ar interaction-prompt="none" camera-controls poster="/assets/blog/PCB/model/poster.webp" shadow-intensity="1" shadow-softness="1" exposure="0.5" camera-orbit="196.6deg 59.73deg 0.1m" field-of-view="30deg" auto-rotate> </model-viewer>
<figcaption>
A little interactive model that you can spin around. You can make these nice 3D renders by exporting from KiCAD as WRL, importing into blender and then exporting as glb.
</figcaption>
</figure>

I've had a longstanding ambition to get a PCB manufactured but I've always put it off. Lately I had a need for a little adapter board to break out these 1.27mm spaced pins to 2.54mm pins that would fit into a breadboard. Feeling like it was a simple enough board I finally decided to fire up KiCad and give it a go.  

The 1.27mm headers in question are on the back of this cute [round lcd breakout board](https://thepihut.com/products/waveshare-rp2040-1-28-ips-lcd-board-with-accelerometer-gyroscope). 

<figure>
<img style="height:300px;" src="/assets/blog/PCB/display_board.webp"/>
<figcaption>
Those headers are much too small to manually push wires into for prototyping.
</figcaption>
</figure>

So I fired up KiCAD and got to work, I had used it a couple time before but had never gotten as far as turning it into a real PCB. Well that changes today!

<figure>
<img src="/assets/blog/PCB/board.svg"/>
<figcaption>
The board layout prior to sending it off to be manufactured.
</figcaption>
</figure>

I used this [excellent KiCAD plugin](https://github.com/Bouni/kicad-jlcpcb-tools) to generate the necessary gerber files that I could upload directly to JLPCB. *Other fast cheap PCB manufactures exist, as you will know if you've ever watched an electronics themed youtube video. PCB manufacturers are to electronics YouTubers as mattresses peddlers are to podcasts.*

<figure>
<img src="/assets/blog/PCB/real.jpeg"/>
<figcaption>
They arrived! Those traces looks very narrow but they're mostly signalling lines. The power rail is doubled up on the connector and ground goes through the ground pour so it should be fine.
</figcaption>
</figure>

After getting the boards I soldering one up. Soldering the 1.27" header was surprisingly difficult to do without causing bridges. And those bridges were tough to remove once there. It didn't help that I had run out off desoldering braid. Anyway I eventually got all the pins connected without overheating and delaminating the board.


<figure>
<img src="/assets/blog/PCB/breadboard.jpeg"/>
<figcaption>
It all looks fine but there are actually four distinct ways you can solder the headers and connect the LCD, I chose wrong.
</figcaption>
</figure>

Next I realised that I had made the obvious error: I put the 1.27" and 2.54" headers on the wrong sides from where the should go. The board isn't reversible so that means the pin assignments are all wrong. By some miracle, the ground pins do have mirror symmetry so at least the ground plane is still the ground plane.

I had thought about trying to squeeze the pin assignments onto the silkscreen, thankfully I didn't because this soldering mistake would have made those completely wrong. 

I cloned the KiCAD file and swapped all the pin assignments around. Giving me this handy little cheat sheet. 


<figure>
<img style="height:400px;" src="/assets/blog/PCB/cheatsheet.png"/>
<figcaption>
I just screenshot'd the KiCAD viewport and inverted the colours to get this. I printed it out on A4 and it makes a handle little notepad.
</figcaption>
</figure>
