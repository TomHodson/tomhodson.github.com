---
title: Unexpected Depths
layout: post
excerpt: Did you know iPhone portrait mode HEIC files have a depth map in them?
assets: /assets/blog/heic_depth_map

thumbnail: /assets/blog/heic_depth_map/thumbnail.png
social_image: /assets/blog/heic_depth_map/thumbnail.png

alt: An image of the text "{...}" to suggest the idea of a template.

head: |
    <script async src="/node_modules/es-module-shims/dist/es-module-shims.js"></script>

    <script type="importmap">
    {
        "imports": {
        "three": "/node_modules/three/build/three.module.min.js",
        "three/addons/": "/node_modules/three/examples/jsm/",
        "lil-gui": "/node_modules/lil-gui/dist/lil-gui.esm.min.js"
        }
    }
    </script>
    <script src="/assets/js/projects.js" type="module"></script>
    

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

<canvas style ="width: 100%;" id="canvas-id-1"></canvas>

<script type="module">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



init('canvas-id-1', '{{page.assets}}/rear_stereo/pointcloud.pcd');
init('canvas-id-2', '{{page.assets}}/front_facing/pointcloud.pcd');

function init(canvas_id, url) {
  let render, gui, orbitControls;
  let canvas = document.getElementById(canvas_id);
  const loader = new PCDLoader();
  let scene = new THREE.Scene();
  scene.add( new THREE.AxesHelper( 1 ) );

    loader.load(url, function ( points ) {
        points.geometry.center();
        points.geometry.rotateZ( -Math.PI/2 );
        points.name = 'depth_map';
        scene.add( points );
        points.material.color = new THREE.Color(0x999999);
        points.material.size = 0.001
        render();

    } );

  // --- Scene ---
  const aspect = canvas.clientWidth / canvas.clientHeight;
  let camera = new THREE.PerspectiveCamera( 30, aspect, 0.01, 40 );
  camera.position.set( -2, 2, 3);
  camera.lookAt(0, 0, 0);

  // --- Renderer (use the existing canvas) ---
  let renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight,);

  render = () => renderer.render(scene, camera);

  // --- OrbitControls ---
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.addEventListener( 'change', render);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5, 5, 10);
  scene.add(dirLight);

  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

}
</script>

## Update

After looking a bit more into this, I found the [Apple docs on capturing depth information](https://developer.apple.com/documentation/avfoundation/capturing-photos-with-depth) which explains that for phones with two or more front cameras, they use the difference in the two images to estimate depth, while the front facing camera on modern phones has [an IR camera](https://developer.apple.com/documentation/avfoundation/avcapturedevice/devicetype-swift.struct/builtintruedepthcamera) that uses a grid of dots to estimate true depth like the good old kinect sensor.

So I had a go with the front facing camera too:

<figure class="two-wide">
<img src="{{page.assets}}/front_facing/rgb.png">
<img src="{{page.assets}}/front_facing/depth.png">
<figcaption> A lovely picture of my face and a depth map of it. </figcaption>
</figure>

The depth information, while lower resolution, is much better. My nose really pops in this one!

<canvas style ="width: 100%;" id="canvas-id-2"></canvas>
