import asyncio
import gc
import sys

import console
import display
import drawing as draw
import fonts
import framebuf

WHITE = 255
BLACK = 0

print(
    "This is μPython saying hello from the on page console!\n"
    f"Version {sys.version}"
)
console.log(
    "This is μPython saying hello from the JS console!"
)

print(
    f"Stack: alloc'd: {gc.mem_alloc()} free {gc.mem_free()} total {gc.mem_alloc() + gc.mem_free()}"
)

w, h = 240, 240
buf = bytearray(w * h)
fbuf = framebuf.FrameBuffer(buf, w, h, framebuf.GS8)

mode = "night"  # "night"
bg_color = WHITE if mode == "day" else BLACK
text_color = BLACK if mode == "day" else WHITE

def hbar(fbuf, x, y, w, h, level, c=BLACK):
    fbuf.rect(x, y, w, h, c)
    fbuf.rect(x, y, int(w*level), h, c, True)

def vbar(fbuf, x, y, w, h, level, c=BLACK):
    fbuf.rect(x, y, w, h, c)
    fbuf.rect(x, y, w, int(h*level), c, True)

def curved_bar(fbuf, x, y, r1, r2, theta1, theta2, level, c=0, n = 10):
    dtheta = theta2 - theta1
    w = draw.wedge(r1, r2, theta1, theta2, n)
    fbuf.poly(x, y, w, c, False)
    w2 = draw.wedge(r1, r2, theta1, theta1 + dtheta*level, n)
    fbuf.poly(x, y, w2, c, True)

i = 0
while True:
    i += 1
    fbuf.fill(255)

    quads = 0b1010 if (i % 10) < 5 else 0b0101

    r1, r2 = 120, 115
    fbuf.ellipse(120, 120, r1, r1, 0, True, quads)
    fbuf.ellipse(120, 120, r2, r2, 255, True)
    power = i % 90 + 200
    volts = 24.1 + (i % 10)/10
    amps = power / volts

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
    hbar(fbuf, x, 50, w, 10, power / 300)

    vbar(fbuf, 50, 50, 8, 30, power/300)
    vbar(fbuf, 40, 50, 8, 30, volts/50)
    curved_bar(fbuf, x=120, y=120, r1=105, r2=110,
               theta1=4, theta2=6, level=power/300,
               c=0, n=15)

    display.draw_GS8(buf)
    print(gc.mem_free())
    gc.collect()

    # Note: Because of the way the webassembly port works, this code is actually running like an asyncio thread
    # This call to asyncio.sleep yeilds back to the JS event loop and gives the browser a chance to update the display.
    #  This is not needed on a real device.
    # There is way to make it so that a bare time.sleep() will work but it requires emcripten's ASYNCIFY feature
    # Which apparently kills performance. See https://github.com/tomhodson/micropython/commit/2fa6373d226b65f977486ecda32b8786cd1dceed
    await asyncio.sleep(0.1)
