import sys

import numpy as np
from PIL import Image

if len(sys.argv) < 3:
    print("Usage: python convert_to_transparent.py <input_image_path> <output_image_path>")
    sys.exit(1)

input_path, output_path = sys.argv[1], sys.argv[2]

grey = np.array(Image.open(input_path).convert("L"))
alpha_channel = 255 - grey

rgba_array = np.zeros((grey.shape[0], grey.shape[1], 4), dtype=np.uint8)
rgba_array[..., 0] = 0  # Red channel
rgba_array[..., 1] = 0  # Green channel
rgba_array[..., 2] = 0  # Blue channel
rgba_array[..., 3] = alpha_channel  # Alpha channel

# Create a new image for the output
rgba_img = Image.fromarray(rgba_array, mode="RGBA")

# Save the result
rgba_img.save(output_path, "PNG")
print(f"Image saved to {output_path}")