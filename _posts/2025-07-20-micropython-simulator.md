---
title: MicroPython Simulator
layout: post
excerpt: Embedded Programming is fun again!

image: /assets/blog/micropython/simulated_display.png
thumbnail: /assets/blog/micropython/simulated_display.png
assets: /assets/blog/micropython
alt: A simulator for my USB C Power supply project using Micropython running in websassembly.

head: |
    <script src="/assets/blog/micropython/micropython.min.mjs" type="module"></script>
---

This simulator lets me quickly try out micropython code drawing to a 240x240 pixel color lcd display. * 

This particular display uses 5, 6 and 5 bits for each channel, respectively. The raw pixel data gets passed from micropython to javascript where it gets converted to normal RGB before being blitted to the `<canvas>` tag. Under the hood it uses the fact that the micropython VM supports being compiled to WASM.

I'm using a ttf font called [gunship](https://www.iconian.com/g.html) converted to bitmap format and frozen into the firmware along with other library code.


Building the code looks like:
```sh
cd /ports/webassembly
make min FROZEN_MANIFEST=/path/to/custom/manifest.py
cp ...wasm and ....min.mjs to your webserver directory
```


<script src="{{page.assets}}/cm6.bundle.min.js"></script>
<script src="{{page.assets}}/simulator.js" type = "module"></script>

<usbc-power-supply-simulator code="{{page.assets}}/demo.py" ></usbc-power-supply-simulator>