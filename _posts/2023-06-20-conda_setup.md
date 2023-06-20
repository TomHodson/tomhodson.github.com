---
title:  My Jupyter and Conda setup
date: 2022-02-02
layout: post
image:
---

These are my notes to myseld about how to setup my jupyter environments because I always forget

### Use micromamba instead of conda
Mamba is hugely faster than conda. Use minimamba installed with brew.

Put this in the `~/.condarc` (which mamba obeys):
```yaml
channel_priority: strict
channels:
  - conda-forge
```

### Jupyter environmnet
Create a `jupyter_env.yaml` file (so that you can tear it down and rebuild it when everything explodes)


Create env from file: `mamba env create -f file.yaml`
Remove env by name: `mamba env remove -y -n envname`
Export only manually installed packages to file: `mamba env export --from-history`

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