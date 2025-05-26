---
title: Bind, Borrow, Deref
layout: post
excerpt: Safely sharing objects between Python and Rust using PyO3
draft: False

assets: /assets/blog/pyo3-smart-pointers
thumbnail: /assets/blog/pyo3-smart-pointers/thumbnail.svg
social_image: /assets/blog/pyo3-smart-pointers/thumbnail.png
alt:
image_class: invertable
---

<section class="note" markdown=1>
This article works for the rust package PyO3 `v0.25`, check the [migration guide](https://pyo3.rs/latest/migration.html) if you're working with a newer version as the project is changing quickly and I imagine the advent of free-threaded python will lead to some changes.
</section>

If you're doing Rust <-> Python interfaces with PyO3 you'll have to work with PyO3's model of how owning python objects in rust. I'm still on my way to fully getting this but here are my notes on the topic so far.

If `T`{:.language-rust} is a python type (in rust) then `Py<T>`{:.language-rust} is the 'loosest' handle we can have on it. This is the only one you can store in a struct.

The next level up is talking to the python interpreter. To do this you need to 'bind' to the interpreter. In pre-3.13 python, only one thread can get the GIL at a time and so holding the GIL means you have the exclusive right to talk to the Python interpreter. In free-threaded python, multiple threads can talk to the interpreter but they still need to `bind` to it.

<details class="aside" markdown=1>
<summary>Why do we still have to bind in free-threaded python?</summary>
My understanding is that, even in free-threaded python, we still a need a mechanism to keep track of which threads are currently bound to the interpreter because the python garbage collector can only run when no threads are bound to the interpreter. Presumably this means we need to be careful to give the GC a chance to run every now and then but I haven't looked deeply into this aspect.
</details>

Binding requires a `py` which is a token in PyO3 that represents the python interpreter. Calling `let bound = value.bind(py)`{:.language-rust} converts our `Py<T>`{:.language-rust} to a `Bound<'py, T>`{:.language-rust}.

A `Bound<'py, T>`{:.language-rust} is basically a smart pointer like `Rc<T>`{:.language-rust} or `Arc<T>`{:.language-rust} but the reference counting and garbage collection of the value it points to is managed by the Python interpreter instead of Rust. To actually use the value T we need to borrow the `Bound<'py, T>`{:.language-rust} with `bound.borrow()` giving us a `PyRef<'py, T>`{:.language-rust}. This increments the reference count in Python world and gives us a `PyRef<'py, T>`{:.language-rust}. Note that in python there's no distinction between a mutable reference and an immutable one so once we have borrowed we can read or write.

Finally `PyRef<'py, T>`{:.language-rust} implements the `Deref`{:.language-rust} trait so we can use the value as if it were a `T`{:.language-rust} while still having some useful context information about where we borrowed the `T`{:.language-rust} from.

So in summary:

1. Bind a `Py<T>`{:.language-rust} to the GIL to get a `Bound<'py, T>`{:.language-rust}
1. Borrow a `Bound<'py, T>`{:.language-rust} to get a `PyRef<'py, T>`{:.language-rust}
1. Use a `PyRef<'py, T>`{:.language-rust} just like a `T`{:.language-rust}.
