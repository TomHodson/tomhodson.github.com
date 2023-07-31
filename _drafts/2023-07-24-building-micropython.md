---
title: Building Micropython from source
layout: post
image:
alt: 
---

These are notes to myself mainly. 
1. Start by following [the main guide](https://docs.micropython.org/en/latest/develop/gettingstarted.html).

2. For Mac you can get the build chain through a [special brew tap](https://github.com/ARMmbed/homebrew-formulae:

```sh
brew tap ArmMbed/homebrew-formulae
brew install arm-none-eabi-gcc
```

You also need the brew equivalents of the dependencies listed:
`brew install gcc cmake libffi-dev git pkg-config`

3. Build `mpy-cross` as directed.

4. Build the unix port just because it's useful

5. Build the port for the board you want, RP2040 for me
```
cd ports/rp2 
make submodules
make -j 16
```

6. Build the port with additional libraries.
I wanted to try out this [display driver](https://github.com/russhughes/gc9a01_mpy) so following the build instructions there, I ran:
```
make USER_C_MODULES=../../../gc9a01_mpy/src/micropython.cmake all
```

If you run into trouble, it helps to `make clean` in between trying things. I upgraded my `cmake` and it didn't seem to help until I ran make clean and tried again.