#!/usr/bin/env python3
import sys

import numpy as np
from PIL import Image

if len(sys.argv) < 3:
    print("Usage: python white_to_alpha.py <input_image_path> <output_image_path>")
    sys.exit(1)

input_path, output_path = sys.argv[1], sys.argv[2]

# convert to 64bit floats from 0 - 1
d = np.asarray(Image.open(input_path).convert("RGBA")).astype(np.float64) / 255.0
print("Top left corner colour: ", d[0,0])

#decompose channels
# r,g,b,a = d.T
color = d[:, :, :3]

# The amount of white in each pixel
white = np.array([0.69803922, 0.69803922, 0.69803922])
white_amount = np.min(color / white, axis = 2)
alpha = 1 - white_amount

premultiplied_new_color = (color - (1 - alpha)[:, :, None] * white[None, None, :])
new_color = premultiplied_new_color / alpha[:, :, None]

original_color = alpha[:,:,None] * new_color + (1 - alpha[:,:,None]) * white

new_RGBA = np.concatenate([new_color, alpha[:,:,None]], axis = 2)

# Premultiplied alpha, but PIL doesn't seem to support it
# new_RGBa = np.concatenate([premultiplied_new_color, alpha[:,:,None]], axis = 2)
# print(np.info(new_RGBA))

img = Image.fromarray((new_RGBA * 255).astype(np.uint8), mode = "RGBA")
img.save(output_path)
print(f"Image saved to {output_path}")