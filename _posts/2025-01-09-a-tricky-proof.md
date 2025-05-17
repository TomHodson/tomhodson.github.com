---
title: A tricky index proof
layout: post
excerpt: An 'exercise for the reader' has been bugging me all week.

mathjax: true

thumbnail: /assets/blog/astrophysical_fluids/line_element.svg
social_image: /assets/blogs/astrophysical_fluids/thumbnail.png
assets: 
alt: A sketch of a vector V with arrows coming off both the top and bottom labelled u(x) and u(x+v) that is used in the post to show how a vector gets transported in a fluid.
image_class: invertable

---

I've been trying to prove a theorem from [these notes](https://arxiv.org/abs/1604.03835) for a few days and I finally figured it out so I thought I'd share.

## Line Element

So the setup is this: Imagine we draw a very short line vector $\vec{v}$ and let it flow along in a fluid with velocity field $u(\vec{x}, t)$. 

<figure style="max-width: 250px;">
<img src="/assets/blog/astrophysical_fluids/line_element.svg" class="invertable">
<figcaption>A line element $\delta \vec{v}$ being dragged aloung in a fluid with velocity field $u(\vec{x}, t)$</figcaption>
</figure>

Three things will happen, the vector will be translated along, it will change length and it will change direction. If we ignore the translation, we can ask what the equation would be for the change in length and direction of $\vec{v}$. I'll drop the vector symbols on $v$, $u$ and $x$ from now on.

$$ D_t \; v = ? $$

If we assume $v$ is very small we can think about expanding $u$ to first order along $v$

$$ u(x + v, t) = u(x, t) + v \cdot \nabla u $$

where $v \cdot \nabla$ is the directional derivative $v_x \partial_x + v_y \partial_y + v_y \partial_y$ and when $v$ is infinitesimal it just directly tells us how $u$ will change if we move from point $x$ to point $x + v$.

So from this we can see that one end of our vector $v$ is moving along at $u(x, t)$ while the other end will move at $u(x, t) + v \cdot \nabla u$ hence:

$$ D_t \; v = v \cdot \nabla u $$

## Surface Element

Now the natural next thing you might ask is how will a little surface element will be stretched and rotated as it moves along in the fluid? It's natural to represent the infinitesumal surface element spanned by two small vectors $v^1$ and $v^2$ with the normal vector $S$ whose length is related to the area of the quadrilateral spanned by $v^1$ and $v^2$.

<figure style="max-width: 250px;">
<img src="/assets/blog/astrophysical_fluids/surface_element.svg" class="invertable">
<figcaption>A surface element $\vec{S}$ that represents the quadrilateral swept out by $v^1$ and $v^2$</figcaption>
</figure>

Probably I call it 'natural' because it's easy to compute it with the cross product:

$$ S = v^1 \times v^2 $$

Now, how does this change over time? Slightly surprisingly to me, you can write down a differential equation purely in terms of $S$ and not $x^1$ or $x^2$.

$$ D_t \; S = (\nabla \cdot u) S - \nabla u \cdot S$$

The proof of this is left as an exercise to the reader in the lecture notes and trying to figure it out has bugged me for the last few days. Spoilers ahead if you'd like to try yourself.

Ok first let's apply chain rule (after first squinting at the index definition of the cross product to make sure chain rule still works, never trust vectors).

$$ D_t \; S = (D_t \; v^1) \times v^2 + v^1 \times (D_t \; v^2) $$

And I'll reorder the second term because I want to align indices and pull some stuff out.

$$ D_t \; S = (D_t \; v^1) \times v^2 - (D_t \; v^2) \times v^1 $$

using our equation for the derivative of $v$ from the last bit:

$$ D_t \; S = (v^1 \cdot \nabla u) \times v^2 - (v^2 \cdot \nabla u) \times v^1 $$

Now to convert this to index notation let's go bit by bit:

$$ [v\cdot \nabla u]_i = v_k \partial_k u_i$$

then using $$ [a \times b]_i = \varepsilon_{ijk} a_j b_k $$ the two terms become:

$$ [(v^1 \cdot \nabla u) \times v^2 ]_i = v^1_l \partial_l \; u_j \; \varepsilon_{ijk} v^2_k $$

$$ [(v^2 \cdot \nabla u) \times v^1 ]_i = v^2_l \partial_l \; u_j \; \varepsilon_{ijk} v^1_k $$

Putting these together we can pull out the $\varepsilon$, $\partial$ and $u$ terms. We can move $\partial$ about liberally as long as we remember it is always acting on $u$ and nothing else. 

$$ D_t S_i = \varepsilon_{ijk} \partial_l u_j \; (v^1_l v^2_k - v^1_k v^2_l) $$

Now this is where I got stuck for ages, We know the answer should have a $v^1 \times v^2$ term in it but looking at this all the indices seem to be connect up wrong!! I tried various things, manage to `prove` it in the case that $v^1 = (1,0,0)$ and $v^1 = (0,1,0)$ etc but was left scratching my head for the more general proof. 

*Then I saw it*, there's this identity about products of Levi-Civita symbols
$$ \varepsilon_{iab} \varepsilon_{inm} = \delta_{an}\delta_{bm} - \delta_{am}\delta_{bn}$$
I've only used this this to turn two Levi-Civita symbols into something simpler. But that right hand side actually looks suspiciously like the term
$$ (v^1_l v^2_k - v^1_k v^2_l) $$

What if we use the identity in reverse??????? I sometimes think of $\delta_{ij}$ as the "rename i->j or j->i" operator because in the presence of Einstein summation that's kinda what it does. Using that idea:
 
$$ (v^1_l v^2_k - v^1_k v^2_l) = v^1_\alpha v^2_\beta (\delta_{\alpha l}\delta_{\beta k} - \delta_{\alpha k}\delta_{\beta l})$$

This seems good, we've managed to disconnect $v^1$ and $v^2$ a bit. Now applying the identity in reverse we get:
$$ v^1_\alpha v^2_\beta \varepsilon_{m\alpha\beta} \varepsilon_{mlk}$$

This is amazing because
$$ v^1_\alpha v^2_\beta \varepsilon_{m\alpha\beta} = [v^1 \times v^2]_m = S_m$$

giving us

$$ D_t S_i = \varepsilon_{ijk} \partial_l u_j  \; \varepsilon_{mlk} S_m $$

applying the identity again in the normal direction this time:

$$ D_t S_i =  \partial_l u_j  \; S_m (\delta_{im}\delta_{jl} - \delta_{il}\delta_{jm})$$

and finally performing the renaming:
$$ D_t S_i =  \partial_j u_j S_i - \partial_i u_j S_j$$

gives us what we want!
$$ D_t S =  (\nabla \cdot u) \; S - (\nabla u) \cdot S$$

