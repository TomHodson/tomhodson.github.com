---
title: Replacing an image colour with transparency
layout: post
excerpt: What happens if you convert an RGB image to RGBA by pretending it was sitting on a white background?

images: /assets/blog/alpha_test
thumbnail: /assets/blog/alpha_test/thumbnail.png
social_image: /assets/blog/alpha_test/thumbnail.png

# The alt text for both images.
alt: An image of Mixtela's latest project, a pendant with a fluid simulation running on a LED matrix.
image_class: no-dim
mathjax: true

---

I was looking at [Mixtela's latest project][mixtelas_project] and admiring how nicely his images blend with the background of the page. He has a simple white background and his images all have perfect white backgrounds with just a little hint of a shadow. 

<figure>
<img src="{{page.images}}/original.jpg" class = "no-dim">
<figcaption markdown=1> An image of [Mixtela's fluid simulation pendant][mixtelas_project].
</figcaption>
</figure>

I think he achieves this through by simply doing very good photography, he probably photographs the object under good lighting in a white booth type thing. I suspect he also adjusts the white balance in post because the white background pixels are all exactly `(255,255,255)`.

But my site has a slightly off white background and it also has a dark mode. Is there some way I could make a similar image that adapts to the background colour?

Well I can kinda think of a crude way. What if we tried to invert the alpha blending process to derive an RGBA image from an RGB image and a background colour?

For a particular pixel of the image, the output pixel $c_{out}$ is just the linear combination of the background $b$ and foreground $f$ colours weighted by the alpha channel $\alpha$:

$$ c_{\text{out}} = f \alpha + b (1 - \alpha) $$

I'm gonna fix the output colour $c_{\text{out}}$ to be the rgb colour of my source image and the background $b$ as white. This gives us:

$$ f = \left( c_{\text{out}} - b (1 - \alpha) \right) / \alpha $$

Now we have to choose alpha for every pixel. Note that's it's not an entirely free choice, any pixel that isn't white in the source image has a maximum alpha we can set before we would start getting negative values in the solution. 

For white the maximum value of alpha turns out to be just the minimum of the r, g and b channels. For a different choice of background colour it would be the minimum of the three channels of $c_{\text{out}} / b$.

Logically some parts of this image should not be transparent, the actual pendant itself is clearly made out of metal so you wouldn't be able to see through it. The shadow on the other hand would make sense as a grey colour with some transparency. 

However I'm just going to see what I get if I set alpha to the maximum possible value for each pixel.

```python
import numpy as np
from PIL import Image
from pathlib import Path

input_path = Path("pendant-complete1.jpg")
    .expanduser()

# convert to 64bit floats from 0 - 1
color = np.asarray(Image.open(input_path)
    .convert("RGB"))
    .astype(np.float64) / 255.0

# The amount of white in each pixel
white = np.array([1.,1.,1.])
alpha = 1 - np.min(color, axis = 2)

premultiplied_new_color = color \
     - (1 - alpha)[:, :, None] \
     * white[None, None, :])

# This does new_color = premultiplied_new_color / alpha
# but outputs 0 when alpha = 0
new_color = \
    np.divide(
        premultiplied_new_color, 
        alpha[:, :, None], 
        out=np.zeros_like(premultiplied_new_color), 
        where = alpha[:, :, None]!=0
    )

new_RGBA = np.concatenate(
    [new_color, alpha[:,:,None]],
    axis = 2)

img = Image.fromarray((new_RGBA * 255)
    .astype(np.uint8), mode = "RGBA")
img.save("test.png")
```

And here are the results, switch the page to dark mode to see more of the effect. With a light, slightly off-white background the transparent image looks very similar to the original but now nicely blends into the background. 



Hit this button to switch to night mode: 
    <button class="toggle-button js-mode-toggle" aria-label="Night Mode Toggle">
      <span class="toggle-button__icon" aria-hidden="true"></span>
    </button>

<figure class="multiple">
<img src="{{page.images}}/original.jpg" class = "no-dim">
<img src="{{page.images}}/white_subtracted.png" class = "no-dim">
<img src="{{page.images}}/white_subtracted.png" class = "brighten">
<img src="{{page.images}}/ai_subtracted.png">
<figcaption> Here are some images, (top left) original, (top right) white subtracted and replaced with alpha, (bottom left) same but brightened in dark mode, (bottom right) cutout based background removal tool (loses shadow)</figcaption>
</figure>

I quite like the effect, and because we chose to make all the pixels as transparent as possible, it has the added bonus that the image dims a bit in dark mode.

## Addendum 

Harking back to my other post about Einstein summation notation, if we have in image with an index for height $$h$$ and width $$w$$ and colour channel $$c$$ that runs over `r,g,b`, we can write these equations as:

$$ c_{\text{out}} = f_{hwc} \alpha_{hw} + b_{hw} (1 - \alpha_{hw}) \;\; \text{(No sum over} h, g)$$

so instead of 
```python
premultiplied_new_color = color - \
    (1 - alpha)[:, :, None] * white[None, None, :]
```

we could also write:

```python
premultiplied_new_color = color - np.einsum(
    "xy, i -> xyi", (1 - alpha), white
)
```

...which is probably not that much simpler for this use case but when it becomes more helpful when you're not just doing elementwise operations and broadcasting.

[mixtelas_project]: https://mitxela.com/projects/fluid-pendant