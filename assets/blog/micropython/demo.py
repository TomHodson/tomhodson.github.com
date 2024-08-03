import asyncio
import gc
import sys

import console
import display
import drawing as draw
import fonts
import framebuf

console.log(
    "This is μPython saying hello from the JS console!\n"
    f"Version {sys.version}"
)

w, h = 240, 240
buf = bytearray(w * h * 2)
fbuf = framebuf.FrameBuffer(buf, w, h, framebuf.RGB565)

mode = "day"  # "night"
bg_color = draw.WHITE if mode == "day" else draw.BLACK
text_color = draw.BLACK if mode == "day" else draw.WHITE

def draw_ui(fbuf, power, amps, volts):
    fbuf.fill(bg_color)

    level = power/300
    color = draw.BLACK if level < 0.8 \
            else draw.ORANGE if level < 0.9 \
            else draw.RED 

    if level > 0.8:
        quads = 0b1010 if (i % 10) < 5 else 0b0101
        r1, r2 = 120, 115
        fbuf.ellipse(120, 120, r1, r1, color, True, quads)
        fbuf.ellipse(120, 120, r2, r2, bg_color, True)

    x, y = draw.display_with_units(
        fbuf,
        str(power),
        "W",
        185,
        145,
        color=text_color,
        bg=bg_color,
        mainfont=fonts.gunship45,
        subfont=fonts.gunship25,
    )
    draw.display_with_units(
            fbuf,
            f"{volts:3.1f}",
            "V",
            x,
            y - fonts.gunship45.height(),
            text_color,
            bg=bg_color,
            mainfont=fonts.gunship30,
            subfont=fonts.gunship20,
    )
    draw.display_with_units(
        fbuf,
        f"{amps:3.1f}",
        "A",
        x,
        175,
        text_color,
        bg=bg_color,
        mainfont=fonts.gunship30,
        subfont=fonts.gunship20,
    )

    w = 100
    x = 120 - w//2
    draw.hbar(fbuf, x, 50, w, 10, power / 300, c = draw.BLACK)

    draw.vbar(fbuf, 50, 50, 8, 30, power/300, draw.BLACK)
    draw.vbar(fbuf, 40, 50, 8, 30, volts/50, draw.BLACK)

    draw.curved_bar(fbuf, x=120, y=120, r1=105, r2=110,
               theta1=4, theta2=6, level=level,
               c=color, n=15)

    display.draw_RGB565(buf)

i = 0
while True:
    i += 1
    power = i % 90 + 200
    volts = 24.1 + (i % 10)/10
    amps = power / volts
    draw_ui(fbuf, power, amps, volts)
    gc.collect()

    # Note: Because of the way the webassembly port works, this code is actually running like an asyncio thread
    # This call to asyncio.sleep yields back to the JS event loop and gives the browser a chance to update the display.
    #  This is not needed on a real device.
    # There is way to make it so that a bare time.sleep() will work but it requires emcripten's ASYNCIFY feature
    # Which apparently kills performance. See https://github.com/tomhodson/micropython/commit/2fa6373d226b65f977486ecda32b8786cd1dceed
    await asyncio.sleep(0.1)
