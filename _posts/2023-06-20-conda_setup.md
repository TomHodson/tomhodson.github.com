---
title:  Jupyter and Conda setup
date: 2023-06-20
layout: post
image: /assets/blog/mamba/logos.png
social_image: /assets/social/jupyter.png
alt: The orange, abstract, Jupyter logo and the Mamba logo which is a cute black snake.
---

These are my notes to myself about how to setup jupyter+conda/mamba environments.

### Use micromamba instead of conda
Mamba is hugely faster than conda. Use minimamba installed with brew.

Put this in the `~/.condarc` (which mamba obeys too):
```yaml
channel_priority: strict
channels:
  - conda-forge
```

### Useful commands I always forget
Note I've added `-y` to these commands to skip the confirmation dialog.
Create env on command line: `mamba create -c conda-forge -n envname python=3.11 other_package ...`
Create env from file: `mamba env create -y -f file.yaml`
Remove env by name: `mamba env remove -y -n envname`
Export only manually installed packages to file: `mamba env export --from-history`

### Jupyter environmnet
Create a `jupyter_env.yaml` file (so that you can tear it down and rebuild it when everything explodes). Install that.

```yaml
name: jupyter
channels:
  - conda-forge
dependencies:
  - python=3.11 
  - jupyterlab
  - nb_conda_kernels # This makes conda envs visible to jupyterlab
  - jupyterlab_widgets # Makes ipywidgets work in jupyterlab
```
Notes:
(making mamba kernels visible)[https://github.com/Anaconda-Platform/nb_conda_kernels]
(making ipywidgets work)[https://ipywidgets.readthedocs.io/en/latest/user_install.html#installing-the-jupyterlab-extension]
Can get a env yaml with `conda env export --from-history`

#### Child environments
To make other environments visible to the jupyter lab instance and make ipqidgets work (i.e for tqdm progress bars) you need two extra packags:

```yaml
name: child
channels:
  - conda-forge
dependencies:
  - python=3.11
  - ipywidgets # The child to jupyterlab_widgets
  - ipykernel # The child to nb_conda_kernels
```