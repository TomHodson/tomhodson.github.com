---
title: MicroPython
layout: post
excerpt: Embedded Programming is fun again!

image: /assets/blog/micropython/xkcd.png
thumbnail: /assets/blog/micropython/thumbnail.png
assets: /assets/blog/micropython
alt: A crudely edited version of XKCD 353, the one about python, but with a greek letter mu stuck in front of "python".

head: |
    <script src="/assets/blog/micropython/micropython.min.mjs" type="module"></script>
---

<figure style="width:max(300px, 100%);">
<img src="{{page.assets}}/xkcd.png"/>
<figcaption>
<small><a href = "https://xkcd.com/353/">Original</a></small>
</figcaption>
</figure>

My first exposures to programming as a kid were through [processing](https://processing.org/) and arduino. 

With Arduino, I understood that it's really just C with some libraries and a toolchain and started to read the datasheets of things like the [ATmega328][atmega328_datasheet]. This is super fun because the atmega328 is a relatively simple computer and you can just about read through the datasheeet. 

The atmega328 has all sorts of hardware that you can configure, like the timers that you can set up to count up/down, to trigger interupts, toggle pins etc. I had loads of fun with this as a nerdy kid. 

However the compile and upload time is kinda long, C that hits registers directly is both ugly and hard to debug and when you start to work with bigger systems like the ESP32 and RP2040 that have WiFi and multiple cores and stuff this all starts to get a bit less fun, at least for me. 

But because the likes of the ESP32 and the RP2040 are so much more powerful **they can run a python interpreter and it's surprisingly fast and really fun!**

Everyone loves to hate on python for being slow, and obviously don't write your tight loops in it (or do, I can't tell you what to do). But even on a resource constrained microprocessor you can have a fun time!

So anyway, here is a compendium of things I've being doing with [micropython][micropython]. Some of this is so that I don't forget how to do it later so there's a little more detail than might be warranted. 

[micropython]: https://micropython.org/
[atmega328_datasheet]: https://ww1.microchip.com/downloads/en/DeviceDoc/40001906A.pdf

## Get yourself a dev board

<figure style="width:max(300px, 100%);">
<img src="{{page.assets}}/four_picos.jpg"/>
</figure>

The Raspberry Pi Pico is really nice, if you went to EMFcamp you can use [the badge][badge], and ESP32 boards work really well too! The easiest way to start is to flash a prebuilt firmware (for RP2040 boards that means putting the board in boot mode and then dragging and dropping a .uf2 file onto a virtual file system that appears.)

[badge]: https://tildagon.badge.emfcamp.org/

## Run some code!

mpremote is a really handy little tool for interacting with a micropython board. My first scripts to play with this looked like this
```sh
mpremote cp main.py :main.py
mpremote run main.py
```
You can also just run code 

```python
{% flexible_include assets/blog/micropython/example_micropython.py %}
```


## Webassembly port 

People are staring to use webassembly to create simulators for physical hardware that run in the browser, this can make the dev loop super fast. [More details here](https://github.com/micropython/micropython/blob/master/ports/webassembly/README.md)

For me this looks like:
```sh
cd /ports/webassembly
make min FROZEN_MANIFEST=/path/to/font_sources/manifest.py
cp ...wasm and ....min.mjs to your webserver directory
```

Then in the js console you can do:
```
const mp = await loadMicroPython();
mp.runPython("import fonts; print(fonts.gunship30)")
```

Note that I've got access to my compiled in code here. 

<section class = "micropython-simulator">
<div id="editor"></div>
<button id=run title="Run code (Ctrl-Enter)" aria-title="Run code (Ctrl-Enter)">Run</button>
<canvas height="240" width="240" class = screen></canvas>
<pre id="micropython-stdout"></pre>
</section>

<script src="{{page.assets}}/cm6.bundle.min.js"></script>
<script src="{{page.assets}}/simulator.js" type = "module"></script>

<usbc-power-supply-simulator></usbc-power-supply-simulator>