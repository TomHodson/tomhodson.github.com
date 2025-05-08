# Run me with uv run scripts/colour_to_alpha.py INPUT_PATH -o [OUTPUT_PATH]
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "click",
#     "numpy",
#     "pillow",
# ]
# ///

from pathlib import Path

import click
import numpy as np
from PIL import Image


@click.command()
@click.argument('input_path', type=click.Path(exists=True, dir_okay=False, path_type=Path))
@click.option('--output', '-o', type=click.Path(dir_okay=False, path_type=Path), help="Path to save the output image.")
def process_image(input_path, output):
    output_path = output or input_path

    # Convert to 64bit floats from 0 - 1
    color = np.asarray(Image.open(input_path).convert("RGB")).astype(np.float64) / 255.0

    white = np.array([1., 1., 1.])
    alpha = 1 - np.min(color, axis=2)
    premultiplied_new_color = (color - (1 - alpha)[:, :, None] * white[None, None, :])

    new_color = np.divide(
        premultiplied_new_color,
        alpha[:, :, None],
        out=np.zeros_like(premultiplied_new_color),
        where=alpha[:, :, None] != 0
    )

    new_RGBA = np.concatenate([new_color, alpha[:, :, None]], axis=2)
    img = Image.fromarray((new_RGBA * 255).astype(np.uint8), mode="RGBA")
    img.save(output_path)

    click.echo(f"Saved processed image to: {output_path}")

if __name__ == "__main__":
    process_image()
