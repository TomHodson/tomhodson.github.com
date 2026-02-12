---
title: Sums of the choose function and the Binomial Formula
layout: post
excerpt: A satisfying little exact formula.
draft: false

assets: /assets/blog/sums-of-the-choose-function-and-the-binomial-formula
thumbnail: /assets/blog/sums-of-the-choose-function-and-the-binomial-formula/thumbnail.svg
social_image: /assets/blog/sums-of-the-choose-function-and-the-binomial-formula/thumbnail.png
alt: The expression (p + q)^m or in words p + q all raised to the power m
image_class: invertable
mathjax: true

---
Here's a nice maths thing. I was thinking about this game called Kniffel, which is a German game played with 5 dice. The internet says it has similar rules to Yahtzee though both seem to have many variants.

The aspect that is important here is that you roll your 5 dice and then you may choose to re-roll any subset of them (up to twice). You choose which subset to re-roll in order to maximise your chances of achieving certain goals, like getting 5 of the same value (and shouting Kniffel!) or a consecutive run etc. 

I was thinking about how one might compute the optimum choice of subset to re-roll given a starting point. Let's say you were going to just brute force it. How hard would that be?

Well you have 5 dice and you want to choose a good subset to roll, there are $2^5 = 32$ possible subsets. How many of each subset are there? That's actually easy, it's the choose function:

$$ {n \choose r} = \frac{n!}{r! \; (n - r)!}$$

which tells you how many ways there are to choose a subset of size r from a set of size n if you don't care how it's ordered. 

Let's quickly look at how many choices there are if we choose to re-roll $r$ dice:

<div class="code-cell" markdown=1>
```python
def fact(n): return n*fact(n-1) if n != 0 else 1
def ncr(n, r): return fact(n) // (fact(r) * fact(n - r))

for r in range(6):
    print(f"{r = }, ncr(5,{r}) = {ncr(5,r)}")
```
```plaintext
r = 0, ncr(5,0) = 1
r = 1, ncr(5,1) = 5
r = 2, ncr(5,2) = 10
r = 3, ncr(5,3) = 10
r = 4, ncr(5,4) = 5
r = 5, ncr(5,5) = 1
```
</div>

That checks out, there's only one way to choose all or none of the dice, are there are more ways when you choose about half of them.

This is actually the origin of that nice identity about rows in Pascals triangle adding to powers of 2:

$$ 2^5 = 32 = {5 \choose 0} + {5 \choose 1} + {5 \choose 2} + {5 \choose 3} + {5 \choose 4} + {5 \choose 5} = $$

$$ = 1 + 5 + 10 + 10 + 5 + 1 $$

What I want to know though, is how many outcomes do we need to consider? Because for each of those ways of choosing $r$ dice, we will have to evaluate every possible outcome of rolling those $r$ dice. Since a die has 6 values there are $6^r$ possible outcomes.

If we loop over every subset of size $r$ and perform $6^r$ computations, how big is that number? It's:

$$ N = \sum_{r = 0}^5 {5 \choose r} 6^r $$

This is the bit that surprised me, it turns out we can evaluate that sum in closed form! I've hidden the answer below just in case you want to try yourself.

<details markdown=1>
<summary>Hint</summary>
Recall or look up the [binomial formula](https://en.wikipedia.org/wiki/Binomial_theorem).
</details>

<details markdown=1>
<summary>Answer</summary>
By noticing that it looks a bit like the binomial formula:

$$ (p + q)^m = \sum_{r = 0}^m {m \choose r} p^r q^{m-r} $$

By setting $m=5, p=6, q=1$ we get:

$$ \sum_{r = 0}^5 {5 \choose r} 6^r  = (6 + 1)^5 = 16807 $$

We can check this number quickly with some python, `itertools` has a handy function `it.product((0,1), repeat = 5)` that will give us all 32 possible subsets in the form `(1,1,0,0,0)` where a 1 means 'roll that die'. 

With that representation, `sum(subset)` is how many dice we have to roll and `6 ** sum(subset)` is how many outcomes we have to consider.

<div class="code-cell" markdown=1>
```python
import itertools as it
sum(6 ** sum(subset) for subset in it.product((0,1), repeat = 5))
```
```plaintext
16807
```
</div>

Yay!

<div class="code-cell" markdown=1>
```python
7**5
```
```plaintext
16807
```
</div>

</details>

