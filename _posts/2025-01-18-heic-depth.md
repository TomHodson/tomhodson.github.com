---
title: Unexpected Depths
layout: post
excerpt: Did you know iPhone portrait mode HEIC files have a depth map in them?
assets: /assets/blog/heic_depth_map

thumbnail: /assets/blog/heic_depth_map/thumbnail.png
social_image: /assets/blog/heic_depth_map/thumbnail.png

alt: An image of my face, half is a normal colour photograph and half is a depth map in black and white.

model_viewer: true
---

You know how iPhones do this fake depth of field effect where they blur the background? Did you know that the depth information used to do that effect is stored in the file?

```python
# pip install pillow pillow-heif pypcd4

from PIL import Image, ImageFilter
from pillow_heif import HeifImagePlugin

d = Path("wherever")

img = Image.open(d / "test_image.heic")

img = Image.open(d / "test_image.heic")

depth_im = img.info["depth_images"][0]
pil_depth_im = depth_im.to_pillow()
pil_depth_im.save(d / "depth.png")
depth_array = np.asarray(depth_im)

rgb_rescaled = img.resize(depth_array.shape[::-1])
rgb_rescaled.save(d / "rgb.png")
rgb_array = np.asarray(rgb_rescaled)

print(pil_depth_im.info["metadata"])
print(f"{depth_array.shape = }, {rgb_array.shape = }")
```

<figure class="two-wide">
<img src="{{page.assets}}/rear_stereo/rgb.png">
<img src="{{page.assets}}/rear_stereo/depth.png">
<figcaption> A lovely picture of my face and a depth map of it. </figcaption>
</figure>


Crazy! I had a play with projecting this into 3D to see what it would look like. I was too lazy to look deeply into how this should be interpreted geometrically, so initially I just pretended the image was taken from infinitely far away and then eyeballed the units. The fact that this looks at all reasonable makes me wonder if the depths are somehow reprojected to match that assumption. Otherwise you'd need to also know the properties of the lense that was used to take the photo.

This handy `pypcd4` python library made outputting the data quite easy and three.js has a module for displaying point cloud data. You can see that why writing numpy code I tend to scatter `print(f"{array.shape = }, {array.dtype = }")` liberally throughout, it just makes keeping track of those arrays so much easier.

```python
from pypcd4 import PointCloud

n, m = rgb_array.shape[:2]
aspect = n / m

x = np.linspace(0,2 * aspect,n)
y = np.linspace(0,2,m)

rgb_points = rgb_array.reshape(-1, 3)
print(f"{rgb_points.shape = }, {rgb_points.dtype = }")

rgb_packed = PointCloud.encode_rgb(rgb_points).reshape(-1, 1)
print(f"{rgb_packed.shape = }, {rgb_packed.dtype = }")

mesh = np.array(np.meshgrid(x, y, indexing='ij'))

xy_points = mesh.reshape(2,-1).T
print(f"{xy_points.shape = }")

z = depth_array.reshape(-1, 1).astype(np.float64) / 255.0

m = pil_depth_im.info["metadata"]
range = m["d_max"] - m["d_min"]
z = range * z + m["d_min"]

print(f"{xyz_points.shape = }")
xyz_rgb_points = np.concatenate([xy_points, z, rgb_packed], axis = -1)

pc = PointCloud.from_xyzrgb_points(xyz_rgb_points)
pc.save(d / "pointcloud.pcd")
```

Click and drag to spin me around. It didn't really capture my nose very well, I guess this is more a foreground/background kinda thing. 

<figure>
<img class="no-wc" src="{{page.assets}}/rear_stereo/point_cloud_preview.png">
<point-cloud-viewer model="/assets/blog/heic_depth_map/rear_stereo/pointcloud.pcd" camera = '{"type":"perspective","position":[-3.598,-0.4154,1.971],"rotation":[0.2078,-1.06,0.1819],"zoom":1,"target":[0,0,0]}'>
</point-cloud-viewer>
<figcaption class="no-wc">If you have JS enabled this is interactive.</figcaption>
<figcaption class="has-wc">An interactive point cloud view of the depth data from the rear facing camera of my phone.</figcaption>
</figure>

## Update

After looking a bit more into this, I found the [Apple docs on capturing depth information](https://developer.apple.com/documentation/avfoundation/capturing-photos-with-depth) which explains that for phones with two or more front cameras, they use the difference in the two images to estimate depth, while the front facing camera on modern phones has [an IR camera](https://developer.apple.com/documentation/avfoundation/avcapturedevice/devicetype-swift.struct/builtintruedepthcamera) that uses a grid of dots to estimate true depth like the good old kinect sensor.

So I had a go with the front facing camera too:

<figure class="two-wide">
<img src="{{page.assets}}/front_facing/rgb.png">
<img src="{{page.assets}}/front_facing/depth.png">
<figcaption> A lovely picture of my face and a depth map of it.</figcaption>
</figure>

The depth information, while lower resolution, is much better. My nose really pops in this one!

<figure>
<img class="no-wc" src="{{page.assets}}/front_facing/point_cloud_preview.png">
<point-cloud-viewer model="/assets/blog/heic_depth_map/front_facing/pointcloud.pcd" camera = '{"type":"perspective","position":[-3.682,0.3606,1.82],"rotation":[-0.1955,-1.104,-0.1751],"zoom":1,"target":[0,0,0]}'>
</point-cloud-viewer>
<figcaption class="no-wc">If you have JS enabled this is interactive.</figcaption>
<figcaption class="has-wc">An interactive point cloud view of the depth from the front facing camera of an iPhone.</figcaption>
</figure>