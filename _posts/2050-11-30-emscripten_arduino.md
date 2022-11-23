---
title:  Using emscripten to simulate an arduino project
layout: post
image: /assets/blog/emscripten_arduino/arduino.svg
---

NB: try to copy the approach from here

In [another post](/2022/11/22/sensor_watch.html) I talked about the [Sensor Watch](https://www.oddlyspecificobjects.com/products/sensorwatch/) project which has this nifty JS simulation for testing the firmware. This saves you having to dissasemble the watch every time you want to test a change to the firmware so makes the develop/test loop much faster. 

If you're working on a project where much of the work consists of configuring the hardware correctly then the effort of making a simulation like this is probably not worth it. For projects like the sensor watch, however, where the inputs and outputs are pretty much fixed while lots of people will want to modify the software it makes a lot of sense.

The sensor watch project has a firmware with a clearly defined interface and the trick is that you swap out the implementation of this interface between the real hardware and the simulation. I wanted to get a better understanding of this so I thought I'd so a super simple version myself, let's do that classic arduino project... blinky! 

Let's grab [the code](https://docs.arduino.cc/built-in-examples/basics/Blink) for blinky.ino, we could easily compile this for a real arduino using the IDE or using a makefile. The approach that 
```c
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
```

I'm going to use the makefile approach because emscripten knows how to work with makefiles. I installed [this one](https://github.com/sudar/Arduino-Makefile) and wrote a small child makefile:
```make

```







