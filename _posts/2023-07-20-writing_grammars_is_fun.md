---
title: Parsing is fun!
excerpt: |
    I came across something I wanted to quickly parse that was too niche to find a ready made parser for. Join me on a quick whip tour of writing a grammar for a PEG parser.
    ```python
    import pe

    parser = pe.compile(
        r'''
        List    <- "[" String ("," Spacing String)* "]"
        String  <- ~[a-zA-Z]+
        Spacing <- [\t\n\f\r ]*
        ''',
    )
    parser.match("[a, b, c]").groups()

    >>> ('a', 'b', 'c')
    ```
layout: post
commentid: 110746239432993930
---

Usually when I want to parse something so that I can manipulate it in code, be it JSON, YAML, HTML, XML, whatever, there is a nice existing library to do that for me. The solution is a simple `import json` away. However if the language is a bit more niche, there maybe won't be a good parser for it available or that parser might be missing features. 

Recently I came across a tiny language at work that looks like this:

```python
[foo, bar, bazz
    [more, names, of, things
     [even, more]]]

[another, one, [here, too]]
```

I won't get into what this is but it was an interesting excuse to much about with writing a grammar for a parser, something I had never tried before. So I found a library, after a false start, I settled on [pe](https://github.com/goodmami/pe). Don't ask me what the gold standard in this space is, but I like pe. 

To avoid getting too verbose, let's just see some examples. Let's start with an easy version of this problem: "[a, b, c]".

```python
import pe

parser = pe.compile(
    r'''
    List    <- "[" String ("," Spacing String)* "]"
    String  <- ~[a-zA-Z]+
    Spacing <- [\t\n\f\r ]*
    ''',
)
parser.match("[a, b, c]").groups()

>>> ('a', 'b', 'c')
```

So what's going on here? Many characters mean the same as they do in regular expressions, so "[a-zA-Z]+" is one or more upper or lowercase letters while "[\t\n\f\r ]*" matches zero or more whitespace characters. The tilde "~" tells pe that we're interested in keeping the string, while we don't really care about the spacing characters. The pattern "String ("," Spacing String)*" seems to be the classic way to express a list like structure or arbitrary length.

Whitespace turns out to be annoying, "[ a, b, c]" does not parse with this, we'd have to change the grammar to something like this:
```python
import pe

parser = pe.compile(
    r'''
    List    <- "[" Spacing String (Comma String)* Spacing "]"
    Comma <- Spacing "," Spacing
    String  <- ~[a-zA-Z]+
    Spacing <- [\t\n\f\r ]*
    ''',
)
parser.match("[ a, b , c ]").groups()
```

NB: there is a [branch of pe](https://github.com/goodmami/pe/blob/fix-6-autoignore/), which hopefully will be merged soon, that includes the ability to auto-ignore whitespace.

We can now allow nested lists by changing the grammar slightly, we also add a hint to pe for what kind of python object to make from each rule:
```python
import pe
from pe.actions import Pack

parser = pe.compile(
    r'''
    List    <- "[" Spacing Value (Comma Value)* Spacing "]"
    Value   <- List / String
    Comma   <- Spacing "," Spacing
    String  <- ~[a-zA-Z]+
    Spacing <- [\t\n\f\r ]*
    ''',
    actions={
        'List': Pack(list),
    },
)
parser.match("[ a, b , c, [d, e, f]]").value()
>>> ['a', 'b', 'c', ['d', 'e', 'f']]
```

I'll wrap up here because this post already feels long but one thing I really like about pe is that you can easily push parts of what you're parsing into named arguments to python functions, in the below I have set it up so that anytime a "Name" rule gets parsed, the parser will call `Name(name = "foo", value = "bar")` and this even works well with optional values too. 
```python
import pe
from pe.actions import Pack
from dataclasses import dataclass

@dataclass
class N:
    name: str
    value: str | None = None

parser = pe.compile(
    r'''
    List    <- "[" Spacing Value (Comma Value)* Spacing "]"
    Value   <- List / Name
    Name    <- name:String Spacing ("=" Spacing value:String)?
    Comma   <- Spacing "," Spacing
    String  <- ~[a-zA-Z]+
    Spacing <- [\t\n\f\r ]*
    ''',
    actions={
        'List': Pack(list),
        'Name': N,
    },
)
parser.match("[ a=b, b=g, c, [d, e, f]]").value()
>>>[N(name='a', value='b'),
    N(name='b', value='g'),
    N(name='c', value=None),
    [N(name='d', value=None), N(name='e', value=None), N(name='f', value=None)]]
```