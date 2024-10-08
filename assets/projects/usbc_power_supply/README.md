To generate the board GLTFs:

```
/Applications/KiCad/KiCad.app/Contents/MacOS/kicad-cli pcb export glb usb-c_psu.kicad_pcb --subst-models -f -o /Users/math/git/tomhodson.github.com/assets/projects/usbc_power_supply/usb-c_psu.glb --include-tracks --include-zones
```

Using `kicad-cli` (/opt/homebrew/bin/kicad-cli) seems to work but a few things are misconfigured, you need to add `-D KICAD8_3DMODEL_DIR=/Applications/KiCad/KiCad.app/Contents/SharedSupport/3dmodels/` and probably other things are broken too. 