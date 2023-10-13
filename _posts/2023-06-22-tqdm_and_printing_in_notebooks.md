---
title: Progress bars and log output in Jupyter notebooks
excerpt: |
    How to get an updatable message printing a tqdm progress bar. 
layout: post
image: /assets/blog/progress_bars/bar.png
thumbnail: /assets/blog/progress_bars/thumbnail.png
image_class: invertable
alt: An image of a nice animated progress bar in a jupyter notebook output cell.
---
I wanted to have just one updatable line of output that would play nicely with a tqdm progress bar. After playing around with `print(s, end="\r")` I settled on using `Ipython.display` with a handle. The problem with the print approach is that it doesn't work when the output is shorter than the previous line.

```python
import time
import random
from tqdm.auto import tqdm
from IPython.display import display, Markdown

info_line = display(Markdown(''), display_id=True)

for x in tqdm(range(0,5), position = 0):  
    for y in tqdm(range(0,5), position = 1, leave=False):  
        x = random.randint(1, 10)
        b = "Loading" + "." * x
        info_line.update(Markdown(b))
        time.sleep(0.5)
```
<figure>
<img src="/assets/blog/progress_bars/bar.png"/>
<figcaption>
What it looks like in the end.
</figcaption>
</figure>