---
title:  Making a custom bootscreen for your TS100 Soldering Iron
date: 2022-02-02
layout: post
image: /assets/blog/TS100/real.jpeg
---



There are a bunch of [posts](https://blog.dbrgn.ch/2017/9/5/creating-custom-ts100-logo-with-gimp/) online about how to add a custom bootscreen to a TS100 soldering iron. These things are great, if you get a little USB-C to jack adapter you can run them off a powerbank and they're tiny so you can keep them with you wherever you go. Which of course you should. 

I did have some trouble getting the image into the write format though, after messing around a little I settled on this command using ImageMagick:
```bash
convert image.png -depth 1 -monochrome BMP3:LOGOIN.BMP
```
Then you can use `identify` to check that the metadata of the output is indeed 1-bit in depth.

```bash
identify LOGOIN.BMP
```

<figure>
<img src = "/assets/blog/TS100/pixels.jpeg">
<figcaption>
Designing my custom bootscreen in an Ipad app
</figcaption>
</figure>


<figure>
<img src = "/assets/blog/TS100/real.jpeg">
<figcaption>
What it looks like on the iron.
</figcaption>
</figure>