---
title: Notes on building this site
layout: post
excerpt: |
    Mostly a note to self so that I can check this when I forget late how it works.

---

The site is build by a github action based on the [jekyll recommendation](https://jekyllrb.com/docs/continuous-integration/github-actions/). I did this because I wanted to be  able to use `npm install` like all the cool kids which lead to adding [jekyll-node-module](https://github.com/mintbit/jekyll-node-module#jekyll-node-module) to the site to be able to copy things in from `node_packages` without committing it all to the repo.

The 3D outline rendered images on the [projects pages](/projects) are done with code from [Omaha Shehata](https://omar-shehata.medium.com/better-outline-rendering-using-surface-ids-with-webgl-e13cdab1fd94).