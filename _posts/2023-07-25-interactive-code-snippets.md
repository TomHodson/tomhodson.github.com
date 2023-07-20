---
title: A little REPL in every blog post
layout: post_klipse
image:
alt: 
---

On someone else's [excellent personal](http://lambdafunk.com/) site I saw [Klipse](https://github.com/viebel/klipse), a little js library that lets you modify and execute code snippets in blogs. How cute!

```klipse-python
print("Hello, world!")
```

There's even a build of python (with the magic of WASM) that includes numpy and pandas!

```klipse-python
import numpy as np
import pandas as pd

np.arange(12).reshape(3,-1)
```

The cells (of a single language) all use the same interpreter so you can share variables across. However this doesn't seem to work when the page first loads.

```klipse-python
import numpy as np
import pandas as pd

a = np.arange(12).reshape(3,-1)
df = pd.DataFrame({"zero" : a[0], "one" : a[2], "twp" : a[2]})
df
```

Hopefully in future this could also hook into the nice html output that many libraries like pandas can produce!