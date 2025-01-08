---
title: Manipulate image pixels in Python
layout: post
excerpt: I had a black and white image but I wanted a black image with the white bits transparent.

thumbnail: /assets/blog/manipulate_pixels.png
social_image: /assets/blog/manipulate_pixels.png
assets: 
alt: 
image_class: invertable

---

The way I've implemented dark mode on this site is to mark some images with a class `invertable` that means they still look good inverted. And then in CSS I go ahead and invert them if you're in dark mode. For other images I just dim them a bit.


<figure class="two-wide">
<img src="/assets/blog/micropython/simulated_display.png" class="invertable">
<img src="/assets/blog/micropython/simulated_display_transparent.png" class="invertable">
<figcaption>Try switching back and forth between dark mode and light mode, the one on the right works, the one on the left gets and ugly black background.</figcaption>
</figure>

However for some images like this black and white png it looks a bit weird when inverted because the background becomes hard black but my site's background is a dark grey. So I wanted to make the white pixels transparent instead.

Anyway the point of this post is that I knew in terms of pixel values what I wanted to do but wasn't sure how to do this in an image editors. So here's the code for you and my future reference:

```python
import sys

import numpy as np
from PIL import Image

if len(sys.argv) < 3:
    print("Usage: python convert_to_transparent.py <input_image_path> <output_image_path>")
    sys.exit(1)

input_path, output_path = sys.argv[1], sys.argv[2]

grey = np.array(Image.open(input_path).convert("L"))
alpha_channel = 255 - grey

rgba_array = np.zeros((grey.shape[0], grey.shape[1], 4), dtype=np.uint8)
rgba_array[..., 0] = 0  # Red channel
rgba_array[..., 1] = 0  # Green channel
rgba_array[..., 2] = 0  # Blue channel
rgba_array[..., 3] = alpha_channel  # Alpha channel

# Create a new image for the output
rgba_img = Image.fromarray(rgba_array, mode="RGBA")

# Save the result
rgba_img.save(output_path, "PNG")
print(f"Image saved to {output_path}")
```
