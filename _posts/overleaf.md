---
layout: single
title:  "Building Overleaf projects locally"
date: 2022-02-02
---

## Building Overleaf projects locally

For a while I've wanted to be able to build my Overleaf projects locally so that I can work on them when the internet is poor. Well I finally figured out to how to do it!

### Step 1: Install Latex (via TexLive)
Instructions [here](https://www.latex-project.org/get/), it's worth getting the version with all the packages because you'll likely need a bunch and they're a pain to install one by one.

Make sure you have the tex live package manager `tlmgr` which I'm pretty sure is installed with the latex.

### Step 2: Install latexmk and texliveonfly
Update tlmgr, depending on how it's installed `tlmgr` may or may not need root permissions, mine does.
```bash
  sudo tlmgr update --self #update tlmgr because it always complains
```
Overleaf uses [latexmk](latexmk) to manage compilation so you need that. And if you're like me and you only installed the light version of texlive above then you'll likely need a bunch of extra packages for your target overlead project, so install `texliveonfly` which we'll use later to autoinstall the packages.
```bash
sudo tlmgr install latexmk texliveonfly
```

### Step 3: Clone your Overleaf project
You can either [clone your overleaf project directly][git-bridge] with 
```
git clone $overleaf_project_link
```
or create [a linked github repo][github-sync] from the settings tab of Overleaf and clone that.

### Install packages
Now cd into your newly cloned repo and use `texliveonfly` to install the packages that your project depends on by running `sudo texliveonfly` on your main tex file.

```bash
sudo texliveonfly main.tex 
```

### Compilation
The actual compilation is done with `latexmk`:
```bash
latexmk -pdf -shell-escape main.tex
```
I had to add the `-shell-escape` option because I was using a package (latexmarkdown) that requires running external commands.

[latexmk]: https://www.overleaf.com/learn/how-to/How_does_Overleaf_compile_my_project%3F#:~:text=Overleaf%20uses%20the%20latexmk%20build,button%20in%20your%20Overleaf%20project.
[overleafgit]: https://www.overleaf.com/blog/195-new-collaborate-online-and-offline-with-overleaf-and-git-beta
[git-bridge]: https://www.overleaf.com/learn/how-to/Using_Git_and_GitHub#The_Overleaf_Git-Bridge
[github-sync]: https://www.overleaf.com/learn/how-to/Using_Git_and_GitHub#Overleaf_GitHub_Synchronization