import numpy as np
from PIL import Image


def convert_image(input_path, output_path):
    # Open the image
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

# Example usage
input_file = "simulated_display.png"
output_file = "simulated_display_transparent.png"
convert_image(input_file, output_file)