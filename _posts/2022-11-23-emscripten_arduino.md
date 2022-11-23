---
title:  Using emscripten to simulate an arduino project
layout: post
image: /assets/blog/emscripten_arduino/arduino.svg
---

In [another post](/2022/11/22/sensor_watch.html) I talked about the [Sensor Watch](https://www.oddlyspecificobjects.com/products/sensorwatch/) project which has this nifty JS simulation for testing the firmware. This saves you having to dissasemble the watch every time you want to test a change to the firmware so makes the develop/test loop much faster. Here I'll go through a toy example of how that works. 

In the end we'll end up with this:
<figure>
{% flexible_include assets/blog/emscripten_arduino/arduino.svg do_not_escape %}
Serial Console
<textarea class="emscripten" id="output" rows="8" style="width: 80%; display: block; margin: 1em;"></textarea>
<figcaption>
The finished arduino simulation.
</figcaption>
</figure>

<script async type="text/javascript" src="/assets/blog/emscripten_arduino/loader.js"></script>
<script async type="text/javascript" src="/assets/blog/emscripten_arduino/main.js"></script>

We could easily add buttons, extra inputs and outputs etc. If you're working on a project where much of the work consists of configuring the hardware correctly then the effort of making a simulation like this is probably not worth it. For projects like the sensor watch, however, where the inputs and outputs are pretty much fixed while lots of people will want to modify the software it makes a lot of sense.

The sensor watch project has a firmware with a clearly defined interface and the trick is that you swap out the implementation of this interface between the real hardware and the simulation. I wanted to get a better understanding of this so I thought I'd so a super simple version myself, let's do that classic arduino project... blinky! 

Let's grab [the code](https://docs.arduino.cc/built-in-examples/basics/Blink) for blinky.ino, we could easily compile this for a real arduino using the IDE or using a makefile. I'm gonna skip the details of getting this working for both real hardware and for emscripten to keep it simple.[^1] The starting point is to try to compile a simple arduino sketch like this one:
```c
#include <Arduino.h>

void setup() {
  Serial.println("Setting pinMode of pin 13");
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  Serial.println("LED On");
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  Serial.println("LED Off");
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
```

In order to get this to compile using emscripten we need to do two things: 
1. write a wrapper script that runs `setup()` and then calls `loop()` in an infinite loop
2. provide implementations of functions like `digitalWrite` and `delay` that interface with emscripten.

The first bit is pretty easy:
```c
#include "blink.c"

int main() {
  setup();
  while(1) loop();
}
```
It's not typical to include a .c file like this. To avoid having to recompile everything all the time, you're really supposed to just include the .h file, compile .c files to .o object files and then link them all together at the end. For this small example it's fine though.

## Writing Arduino.h

Ok, now let's write a quick implementation of `Arduino.h` that just covers what we need for this example, I'll include the code in the header file for brevity. First we have some includes. We need `stdint` for the fixed width integer types like `uint8_t`, stdio for `printf` which emscripten provides its own implementation of and `<emscripten.h>` to embed javascript implementations. We also have some simple definitions that appear in our sketch.

```c++
#include <stdint.h>
#include <stdio.h>
#include <emscripten.h>
#include <emscripten/html5.h>

#define HIGH 1
#define LOW 0
#define LED_BUILTIN 13
#define OUTPUT 1
#define INPUT 0
```

Next we do `digitalWrite`. We use the `EM_ASM` macro which just pastes that JS code into the compiled wasm, substiting in the `value` for `$0`. I grabbed a creative commons licensed [svg](https://commons.wikimedia.org/wiki/File:Led_lampeggiante_con_arduino.svg) off wikipedia, added a little overlay in inkscape with the id `light_led` and then we toggle it's opacity.

```c
void pinMode(uint8_t pin, uint8_t value) {}
void digitalWrite(uint8_t pin, uint8_t value) {
    if(pin == 13) {
    EM_ASM({
      document.getElementById("light_led").style.opacity = $0 ? 1 : 0;
    }, value);
}
}
```

For `delay`, it's a bit more complicated because the JS that runs in browsers has to share the CPU, it can't delay by just wasting cycles the way we can on an arduino. So we use the [asyncify](https://emscripten.org/docs/porting/asyncify.html) feature of emscripten. This gives us a function `emscripten_sleep` that effectively yields to other code running on the page for a certain period of time, this allows us to implement `delay` in a non-blocking way.

```c
void delay(uint32_t milliseconds) {
    emscripten_sleep(milliseconds);
}
```

Finally, `Serial.println` should be pretty easy, we just call `printf`. However we need to do something to mimic to the `Serial.print` syntax which involves a little C++:
```c

class SerialClass {
    public:
    void begin(uint32_t baud) {}
    void println(const char string[]) {
        printf("%s\n", string);
    }
};

SerialClass Serial;
```

## Compiling it

And with that we're almost done! We have three files, `blink.c` that represents our arduino sketch, `main.c` that wraps it and `Arduino.h` that implements the lower level stuff. To compile it we need the emscripten C++ compiler `em++`
```bash
em++ -sASYNCIFY -O3 main.c -o build/main.js -I./
```
`-sASYNCIFY` tells emscripten that it should us asyncify, `-O3` runs optimisations as recommended when using asyncify and `-I./` tells the compiler that `Arduino.h` can be found in the same directory as `main.c`. We get two files as output `main.js` and `main.wasm`. The former is another wrapper script and `main.wasm` contains the actual compiled webassembly code.

## Another Wrapper to wrap it up
So how do we use `main.js` and `main.wasm`? We need to include `main.js` and some extra glue code `loader.js` on our HTML page, along with our SVG and a textarea tag that the serial output will go to:

```html
<figure>
<svg>...</svg>
Serial Console
<textarea class="emscripten" id="output" rows="8" 
      style="width: 80%; display: block; margin: 1em;"></textarea>
<figcaption>
The finished arduino simulation.
</figcaption>
</figure>

<script async type="text/javascript" src="loader.js"></script>
<script async type="text/javascript" src="main.js"></script>
```

And that gives us the final result. I've put all the files in [this repository](https://github.com/TomHodson/arduino-emscripten).

[^1]: For a real project it'd be nice to integrate emscripten with a makefile that can compile for real hardware [this one](https://github.com/sudar/Arduino-Makefile)



