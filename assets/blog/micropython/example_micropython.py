import gc
import struct
import time
from array import array

import console
import display
import fonts
import framebuf

WHITE = 255


def palette_from_colors(*args):
    pbuf = array("H", range(len(args)))
    struct.pack_into(">HH", pbuf, 0, *args)
    p = framebuf.FrameBuffer(
        pbuf, len(args), 1, framebuf.RGB565
    )
    return p


def str_width(string, font, xpad=0):
    return sum(font.get_ch(c)[2] + xpad for c in string)


def print_buf(
    framebuffer,
    string,
    x,
    y,
    color,
    font,
    ha="left",
    va="top",
    bg=WHITE,
    xpad=0,
):
    total_width = str_width(string, font, xpad)
    if ha == "center":
        x -= total_width // 2
    elif ha == "right":
        x -= total_width
    if va == "center":
        y -= font.height() // 2
    elif va == "bottom":
        y -= font.height()
    p = palette_from_colors(bg, color)

    for c in string:
        b, height, width = font.get_ch(c)
        c_fbuf = framebuf.FrameBuffer(
            array("B", b), width, height, framebuf.MONO_HLSB
        )
        framebuffer.blit(c_fbuf, x, y, bg, p)
        x += width + xpad
    return x, y


print(
    "This is μPython saying hello from the on page console!"
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

i = 0
while True:
    i += 1
    fbuf.rect(0, 0, 240, 240, 255, True)
    fbuf.pixel(120, 120, 128)
    x, y = print_buf(
        fbuf,
        str(i % 150),
        140,
        145,
        255,
        font=fonts.gunship50,
        ha="right",
        va="bottom",
        bg=0,
    )

    x, y = print_buf(
        fbuf,
        "mW",
        x,
        145,
        255,
        font=fonts.gunship30,
        ha="left",
        va="bottom",
        bg=0,
    )

    display.draw(buf)
    # The 'await' is necessary here to yield back to the JS event loop
    # I tried to figure out how to hide this inside the JS implementation of sleep but
    # couldn't make it work.
    await time.sleep(0.2)
