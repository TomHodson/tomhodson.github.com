---
title:  USB-C Power Book
layout: project
excerpt: An ongoing quest to fix a problem I don't have.
permalink: /projects/usbc_charging_station
assets: /assets/projects/usbc_power_supply

img:
    src: /assets/projects/usbc_power_supply/thumbnail.svg
    alt: A line rendered CAD model of a laser-cut, book shaped device with exposed internal parts. It wouldn't be obvious without reading the description but it's a USB-C power supply.
    class: invertable

social_image: /assets/projects/usbc_power_supply/thumbnail.png
model: /assets/projects/usbc_power_supply/usb-c_psu.glb

head: |
    <script type="module" src="/assets/js/kicanvas.js"></script>
    <script src="/assets/blog/micropython/micropython.min.mjs" type="module"></script>
    <script src="/assets/blog/micropython/cm6.bundle.min.js"></script>
    <script src="/assets/blog/micropython/simulator.js" type = "module"></script>

---

<!-- {% include mastodon_post.html post_id = "111813225328398667" %}
{% include mastodon_post.html post_id = "111816310882560850" %} -->

I'm kinda fascinated by USB-C. It has it's issues but I can't help but love this magical omni-cable that holds the promise of hundreds of watts of power and gigagbits per second of bandwidth. It's reversible, you can negotiate the supply voltage (PD), send power in either direction, pipe PCIe or DisplayPort and talk to the cable itself. 


USB PD lets you ask for different supply voltages, roughly you can ask for, the voltage is fixed and the amps and power column are the max you're allowed to pull for that profile.

| Power | Voltage | Current |
|-------|---------|---------|
| 15W   | 5 V     |   3A    |
| 27W   | 9 V     |   3A    |
| 45W   | 15 V    |   3A    |
| 60W   | 20 V    |   3A    |
| 100W* | 20V     |    5A   |

100W mode requires the cable to have a special E-marker that reports that it supports the extra current. Later revision of the standard have added higher voltages (EPR) and fully adjustable supply voltage (PPS) but I won't go into that here.

I'm going to be using a cheap 60W and 100W USB modules from AliExpress. These boards take 24V input and have a DC-DC converter and IC onboard to negotiate and generate the requested voltage. So the basic idea is to connect a bunch of these connect to a 24V power supply.

I had a look online to see what the maximum charging rate of some common devices are:

| Device         | Max Charge Rate    |
|----------------|--------------------|
| Framework      | 180W               |
| Some Macbooks  | 140W               |
| Most Laptops   | 100W*              |
| Beefy Battery  | 60W                |
| Steam Deck     | 40W                |
| iPhone         | 27W                |
| Airpods        | 5W                 |

I'll be using 100W modules so let's ignore anything above that say the most I could reasonable want to charge at once would be two phones, two wireless headphones, a portable battery, a laptop and a steamdeck. That sums to about 300W total. I'm going to go for 3 100W modules and 5 60W modules for a theoretical maximum draw of 600W but I don't have enough devices to achieve that.

This project has been the subject of a ridiculous amount of scope creep. What follows is basically my notes on what I've done so far.

## Case Design 

After initially thinking I would do some kind of charging tray type design I eventually decided to model the PSU into a book-like form factor so that it can hide on the bookshelf in our living room, nestled between real books. The cables will then snake out of the back and emerge from between the books. This keeps the cables nicely separated and hides the extra cable length well. I'll need to be careful about cooling though.

This is what I've come up with so far, it's lasercut from 3mm ply (but I need to switch to 4mm because 3mm is a bit flimsy)

<figure style="max-width: 250px;">
<img src="{{page.img.src}}">
</figure>

I've put a 240x240 pixel colour screen on the front to show metrics like total charge power, temperature and maybe daily energy use.


## Electronics 

Because I am taking this way too far, I wanted to do per port enable/disable and current monitoring. To implement this I'm designing a PCB with 5 channels where each channel consists of this schematic.  

<figure style="max-width: 350px;">
<img src="{{page.assets}}/channel_sch.png">
</figure>

There's an INA219 and a shunt resistor for current and voltage monitoring and a chunky MOSFET for enabling and disabling the channel. 

<figure class="two-wide">
<img src="{{page.assets}}/channel_board.png">
<img src="{{page.assets}}/channel_3d.png">
</figure>

For now I've broken the functionality for one channel out into a test board that I've sent off to JLCPB for manufacturing with and to be populated with SMT components. This ended up costing about 50 dollars for 5 boards. In future I want to have a go at doing the component placement and reflow myself. 

<outline-model-viewer model = "{{page.assets}}/test_board.glb" true-color=true spin=true camera='{"position":[4.016,7.557,6.841],"rotation":[-0.8351,0.3753,0.3848],"zoom":241.86567243589988,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

## Software 

In other posts I've described how I made this simulator the test out possible GUIs for this thing.

TODO: Add some knobs to the simulator so you can test different conditions such as overcurrent, overtemp, sleep, nightmode etc.

<!-- <usbc-power-supply-simulator disable-console disable-editor code="/assets/blog/micropython/demo.py"></usbc-power-supply-simulator>
 -->


<!-- <outline-model-viewer model = "{{page.model}}" true-color=true spin=false camera='{"position":[-6.425,8.003,-3.751],"rotation":[-2.016,-0.6378,-2.246],"zoom":6784.844370099355,"target":[0.1581,-0.01497,0.07167]}'>
    <img class="outline-model-poster no-wc" src = "{{page.img.src}}">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer> -->

<!-- <kicanvas-embed src="/assets/projects/usbc_power_supply/usb-c_psu.kicad_sch" controls="basic"> </kicanvas-embed> -->
