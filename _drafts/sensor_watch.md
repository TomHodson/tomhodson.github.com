---
title:  Sensor Watch
date: 2022-02-03
layout: post
image: /assets/blog/SensorWatch/watch.svg
---

A while ago I backed a crowdsupply project called [Sensor Watch](https://www.oddlyspecificobjects.com/products/sensorwatch/). It's a replacement logic board for those classic Casio watches that you probably don't know the name of but have certainly seen around. This post goes through the process of getting the board swapped out and programming custom firmware on it. I also went opted for the [temperature sensor addon board](https://www.sensorwatch.net/docs/sensorboards/).

<figure>
<img src="/assets/blog/SensorWatch/real_watch.jpg" alt="A photo of a slightly scratched Casio A164W stainless steel wristwatch">
<figcaption>
I got this Casio A164W off ebay, it's not quite the classic F-91W model but they all use the same 593 module internally and the sensor watch board replaces that module.
</figcaption>
</figure>

## The watch firmware
There is a firmware called Movement that already supports most of the things you probably want a watch to do, uses very little power and exposes a nice interface for writing extensions.

To compile it you need the the [ARMmbed](https://github.com/ARMmbed/homebrew-formulae) toolchain and if you want to test the firmware in a javascript simulator (you do!) then you also need [emscriptem](https://emscripten.org/docs/getting_started/downloads.html):
```bash
# first make sure you've activated emscripten
# in the current shell, see emscripten docs
# for me this means running
source ~/git/emsdk/emsdk_env.sh
cd ~/git/Sensor-Watch/movement/make

# emmake takes a normal makefile for a C project
# and compiles it to JS instead
emmake make 

# Serve watch.html locally
python3 -m http.server 8000 -d build
```
The simulator itself is an adapted version of this lovely [simulation of the original watch firmware](https://github.com/alexisphilip/Casio-F-91W) for the sensorwatch project. The contents of watch.html is basically an svg of the watchface, some glue code and the watch firmware in watch.wasm. I factored out the inline svg and glue code to end up with a snippet that I could embed in this page:

```html
<figure>
{% raw %}{% include watch.svg %}{% endraw %}
<!-- change display from none to inline to see the debug output -->
<textarea id="output" rows="8" style="width: 100%; display: none;"></textarea>
<figcaption>
Click the buttons to interact with my watch firmware!
</figcaption>
</figure>
<script async type="text/javascript" src="/assets/blog/SensorWatch/emulator.js"></script>
<script async type="text/javascript" src="/assets/blog/SensorWatch/watch.js"></script>
```

Which I can update by re-running emmake and copying over watch.js and watch.wasm:
```bash
 emmake make && \
 cp ./build/watch.wasm ./build/watch.js  ~/git/tomhodson.github.com/assets/blog/SensorWatch
```

<figure>
{% include watch.svg %}
<!-- change display from none to inline to see the debug output -->
<textarea id="output" rows="8" style="width: 100%; display: none;"></textarea>
<figcaption>
Click the buttons to interact with my watch firmware!
</figcaption>
</figure>
<script async type="text/javascript" src="/assets/blog/SensorWatch/emulator.js"></script>
<script async type="text/javascript" src="/assets/blog/SensorWatch/watch.js"></script>

<!-- <button onclick="getLocation()">Set location register (will prompt for access)</button>
<br>
<input id="input" style="width: 500px"></input>
<button id="submit" onclick="sendText()">Send</button>
<br> -->

# Customising the firmware
TODO 

# Doing the board swap
TODO  












## Related links
- [TOTP tokens](https://blog.singleton.io/posts/2022-10-17-otp-on-wrist/)
- [Data Runner](https://n-o-d-e.net/datarunner.html)
- [A buzzer instead of a piezo?](https://www.instructables.com/MAKE-IT-VIBRATE-Vibrator-Module-for-Casio-F-91W/)