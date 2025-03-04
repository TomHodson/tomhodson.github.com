---
title: Executable code snippets in docs and HTML object representations
layout: post
excerpt: "It just looks so nice."

assets: /assets/blog/executable-code-snippets-in-docs-and-html-object-representations
thumbnail: /assets/blog/executable-code-snippets-in-docs-and-html-object-representations/thumbnail.png
social_image: /assets/blog/executable-code-snippets-in-docs-and-html-object-representations/thumbnail.png
alt:
image_class: invertable


---

Just a quick one. Lately I've started writing the documention for [a new software project involving trees](https://qubed.readthedocs.io). 

While debugging that in a Jupyter notebook I made a small HTML representation of the tree that mimis the output of `tree` but using the HTML details tag so you can open and close the subtrees.

This works using by giving the object a "_repr_html_" method that returns a HTML string. If it's present, Jupyter notebooks will use the output of that instead of `repr` to display a rich version of the object in a notebook.

```python
class Title():
    def __init__(self, x):
        self.x = x
    def _repr_html_(self):
        return f"<h1>{self.x}</h1>"
```

I then set up executable code snippets in these docs so I could give code examples and not have to paste the output in myself. I'm using MyST-NB in sphinx to do this, it gives you a nicely syntax highlighted code block along with the output evaluated against the actual code.  Since the NB in Myst-NB stands for notebook, it's perhaps not so surprising that the HTML inline output also works!

The overall effect looks a bit like the below but see it [in place](https://qubed.readthedocs.io) for a better idea of how it looks with proper CSS.

```python
from qubed import Qube

q = Qube.from_dict({
    "class=od" : {
        "expver=0001": {"param=1":{}, "param=2":{}},
        "expver=0002": {"param=1":{}, "param=2":{}},
    },
    "class=rd" : {
        "expver=0001": {"param=1":{}, "param=2":{}, "param=3":{}},
        "expver=0002": {"param=1":{}, "param=2":{}},
    },
})

# depth controls how much of the tree is open when rendered as html.
q.html(depth=100)
```

<div class="output text_html">
<style>
pre#qubed-tree-555631 {
    font-family: monospace;
    white-space: pre;
    font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,Courier,monospace;
    font-size: 12px;
    line-height: 1.4;
    
    details {
        margin-left: 0;
    }

    summary {
        list-style: none;
        cursor: pointer;
        text-overflow: ellipsis;
        overflow: hidden;
        text-wrap: nowrap;
        display: block;
    }

    summary:hover,span.leaf:hover {
        background-color: #f0f0f0;
    }

    details > summary::after {
        content: ' ▲';
    }

    details:not([open]) > summary::after {
        content: " ▼";
    }

    .leaf {
        text-overflow: ellipsis;
        overflow: hidden;
        text-wrap: nowrap;
        display: block;
    }

    summary::-webkit-details-marker {
        display: none; 
        content: "";
    }

}
</style>
<pre class="qubed-tree" id="qubed-tree-555631"><details open=""><summary>root</summary><details open=""><summary>├── class=od</summary><details open=""><summary>│   ├── expver=0001</summary><span class="leaf">│   │   ├── param=1</span><span class="leaf">│   │   └── param=2</span></details><details open=""><summary>│   └── expver=0002</summary><span class="leaf">│       ├── param=1</span><span class="leaf">│       └── param=2</span></details></details><details open=""><summary>└── class=rd</summary><details open=""><summary>    ├── expver=0001</summary><span class="leaf">    │   ├── param=1</span><span class="leaf">    │   ├── param=2</span><span class="leaf">    │   └── param=3</span></details><details open=""><summary>    └── expver=0002</summary><span class="leaf">        ├── param=1</span><span class="leaf">        └── param=2</span></details></details></details></pre></div>