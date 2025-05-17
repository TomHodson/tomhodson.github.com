---
title: Notes on building this site
layout: post
thumbnail: /favicon/android-chrome-512x512.png
excerpt: |
    Mostly a note to self so that I can check this when I forget late how it works.
alt: The site favicon, built from a series of overlapping circles forming a diamond shape. 

---

The site is build by a github action based on the [jekyll recommendation](https://jekyllrb.com/docs/continuous-integration/github-actions/). I did this because I wanted to be  able to use `npm install` like all the cool kids which lead to adding [jekyll-node-module](https://github.com/mintbit/jekyll-node-module#jekyll-node-module) to the site to be able to copy things in from `node_packages` without committing it all to the repo.

The 3D outline rendered images on the [projects pages](/projects) are done with code from [Omaha Shehata](https://omar-shehata.medium.com/better-outline-rendering-using-surface-ids-with-webgl-e13cdab1fd94).

## Future
There are a few plugins I'm thinking of adding:
- [jekyll-auto-image](https://github.com/merlos/jekyll-auto-image) to simply choosing a representative image for a particular post.
-  I'd like to write a jekyll plugin for [D2](https://github.com/terrastruct/d2) diagrams. It doesn't [look too difficult](https://jekyllrb.com/docs/plugins/tags/).
- I'm wondering if I should switch the rendering to use pandoc, I used pandoc in the past to convert my thesis to multiple output formats and I suspect it is now a more active project than jekyll itself, for example someone has already written a D2 pandoc filter. 

There's a good list of jekyll plugins [here](https://github.com/planetjekyll/awesome-jekyll-plugins).