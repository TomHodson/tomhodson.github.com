---
title:  My Jupyter and <s>Conda</s> Mamba setup
thumbnail: /assets/blog/mamba/logos.png
date: 2022-02-02
layout: post
---

I really like working in Jupyterlab but getting it to work nicely is always a bit challenging, these are my notes for roughly how I have it set up.

### Conda
I use miniconda3 with the package directory set up to point to somewhere other than the home directory because the university system I'm working on only gives a small amount of space in your home directory. 

My ~/.condarc contains:
```
channel_priority: strict
channels:
  - conda-forge
  - defaults
```
channel_priority: strict is supposed to speed up conda complicated dependency resolution system, and I heard on the grapevine that conda-forge packages tend to be more up to date than the ones in default so I've switched the priority.

I then have a "base" environment where I've install jupyterlab, 

Hint: you can use `conda env export --from-history` to see the packages you actually installed into a conda environment rather than the ones that were installed as dependencies, I wish there were a shorter form for this command because I think it's really useful.

#### Base env

$(base) conda env export --from-history
name: base
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.8
  - jupyterlab
  - jupyterlab-git
  - nb_conda_kernels

jupyterlab is the package that runs the show, we also have jupyterlab-git which is a git plugin for it and nb_conda_kernels which allows jupyter in the base env to see the other environments on the system.

#### other envs
Now I have project specific envs where I actually run python code. Here's an example one:

name: fk
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.8
  - scipy
  - numpy
  - matplotlib
  - munch
prefix: /home/tch14/miniconda3/envs/fk


### Remote Acess
I often use my laptop to access a Jupyterlab server running on a beefier machine under my desk at work, the ~/.shh/config on my laptop contains 
```
host beefyremote
    user [username]
	hostname [hostname]
	proxyJump [a machine that you need to jump through if necessary]
	IdentityFile ~/.ssh/id_rsa_password_protected
	#give access to the jupyter server on [beefyremote]:8888 to localhost:8889
	LocalForward 8889 localhost:8888
	#LocalCommand 
```

I open this connection and then run `jupyter lab --no-browser --port=8888` within a tmux session on the remote machine so that the server doesn't die with the connection.