---
title: USB-C PSU Monitor Board Bringup
layout: post
excerpt: Finally testing these boards I got back manufactured last year.
draft: true

assets: /assets/blog/usb-c-psu-monitor-board-bringup
thumbnail: /assets/blog/usb-c-psu-monitor-board-bringup/thumbnail.svg
social_image: /assets/blog/usb-c-psu-monitor-board-bringup/thumbnail.png
alt:
image_class: invertable


---

[x] Check power usage at 3v to see if there are any crazy shorts.
[x] Connect up I2C and see if the board is detected.

[x] Detected the board on I2C at address 64 (0b1000000) which makes sense assuming the floating address pins have a pulldown and the address table from the datasheet:

| A1  | A0  | SLAVE ADDRESS |
|-----|-----|--------------|
| GND | GND | 1000000      |
| GND | VS+ | 1000001      |
| GND | SDA | 1000010      |
| GND | SCL | 1000011      |
| VS+ | GND | 1000100      |
| VS+ | VS+ | 1000101      |
| VS+ | SDA | 1000110      |
| VS+ | SCL | 1000111      |
| SDA | GND | 1001000      |
| SDA | VS+ | 1001001      |
| SDA | SDA | 1001010      |
| SDA | SCL | 1001011      |
| SCL | GND | 1001100      |
| SCL | VS+ | 1001101      |
| SCL | SDA | 1001110      |
| SCL | SCL | 1001111      |


Next lets bridge some of these address select pads. In the image below I've connected SEL_0 to GND and SEL_1 to 3v3. This should set the address to 65 / 0b1000001 / 0x41.

<figure class="two-wide">
    <img src="{{ page.assets }}/addr_sel.png">
    <img src="{{ page.assets }}/addr_sel_set.png">
</figure>

Great that works too.

Next I hooked the output up to a 10 Ohm power resistor and ramped the input voltage.  I was interested to see how much voltage was being dropped over the MOSFET but it seems fine. A touch test of the MOSFET also felt good.

<figure class="two-wide">
    <img src="{{ page.assets }}/resistor_load.png">
    <img src="{{ page.assets }}/hotplate_load.jpg">
</figure>

Finally I switched to the other board with the USB-C psu attached, ramped the supply to 24v and connected a hotplate as a test load. All seems good!