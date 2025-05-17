---
title: RARA Elegoo Printer Notes
layout: post
excerpt: Notes for the 3D printer at my co-working space.
exclude_from_rss: true

assets: /assets/blog/rara-elegoo-printer-notes
thumbnail: /assets/blog/rara-elegoo-printer-notes/thumbnail.jpg
social_image: /assets/blog/rara-elegoo-printer-notes/thumbnail.jpg
alt: |
    A photo of the main circuit board in this 3D printer. The board is red and there are a lot of wires everywhere some of which have clearly been added after market.
---

---

| Printer | Elegoo Neptune 2 |
| Control Board | ZNP Robin Nano V1.3 [Schematic of similar board](https://github.com/makerbase-mks/MKS-Robin-Nano-V1.X/blob/master/hardware/MKS%20Robin%20Nano%20V1.3_002/MKS%20Robin%20Nano%20V1.3_002%20SCH.pdf) |
| Microcontroller | STM32F407VET6 |
| Extruder / Hotend combo | [BIQU H2V2](https://biqu.equipment/products/biqu-h2-v2-0-extruder) |
| Original Firmware | [ZNP-Robin-Nano-V1.2-V1.3](https://github.com/NARUTOfzr/ZNP-Robin-Nano-V1.2-V1.3/tree/master/ZNP_Robin_Nano_V1.2%20Firmware) |
| Current Firmware | [Original Board Firmware](https://github.com/NARUTOfzr/ZNP-Robin-Nano-V1.2-V1.3/tree/master/ZNP_Robin_Nano_V1.2%20Firmware)
| Z Probe | [BLTouch](https://www.antclabs.com/_files/ugd/f5a1c8_d40d077cf5c24918bd25b6524f649f11.pdf) |
| Manual | [General Guide](https://github.com/oinosme/elegoo-neptune2-2s-guide) |
| PDF Manual | [PDF]({{ page.assets }}/Neptune 2 & Neptune 2S User Guide (EN).pdf) |
| Default config.cfg for Klipper | [Default config.cfg](https://github.com/Klipper3d/klipper/blob/master/config/printer-elegoo-neptune2-2021.cfg) |
| Currentish config.cfg | [Current config.cfg](/assets/blog/rara-elegoo-printer-notes/klipper_config.cfg)|
| Microcontroller Datasheet | [Datasheet]({{ page.assets }}/micro_datasheet.pdf) |

---

<figure>
    <img src="{{ page.assets }}/mainboard_connectors.png">
</figure>

<figure>
    <img src="{{ page.assets }}/micro_pinout.png">
</figure>

<figure>
    <img src="{{ page.assets }}/pcb.png">
</figure>

<figure>
    <img src="{{ page.assets }}/hotend.png">
</figure>
