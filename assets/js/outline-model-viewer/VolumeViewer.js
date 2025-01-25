import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Timer } from "three/addons/Addons.js";
import { GUI } from "lil-gui";
import { vertexShader, fragmentShader } from "./VolumeShaders.js";

import {
  componentHTML,
  setupThreeJS,
  deserialiseCamera,
  deserialiseControls,
} from "./helpers.js";

async function load_metadata(metadata_path) {
  console.log("Loading metadata from", metadata_path);
  const metadata_res = await fetch(metadata_path);
  return await metadata_res.json();
}

async function load_model_bytes(model_path) {
  console.log("Loading model from", model_path);
  const res = await fetch(model_path);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer); // Create an uint8-array-view from the file buffer.
}

async function load_model_bytes_gzip(model_path, metadata_path, scene) {
  const ds = new DecompressionStream("gzip");
  const response = await fetch(model_path);
  const blob_in = await response.blob();
  const stream_in = blob_in.stream().pipeThrough(ds);
  const buffer = await new Response(stream_in).arrayBuffer();
  console.log("Decompressed Model size", buffer.byteLength);
  return new Uint8Array(buffer);
}

async function load_model(model_path, metadata_path, scene) {
  // If the model path ends in ".gz", we assume that the model is compressed.
  const model_promise = model_path.endsWith(".gz")
    ? load_model_bytes_gzip(model_path, metadata_path, scene)
    : load_model_bytes(model_path);

  const [byteArray, metadata] = await Promise.all([
    model_promise,
    load_metadata(metadata_path),
  ]);

  console.log("Loaded model with metadata", metadata);
  console.log("Model shape", metadata.shape);
  console.log("Model dtype", metadata.dtype);

  const texture = new THREE.Data3DTexture(
    byteArray, // The data values stored in the pixels of the texture.
    metadata.shape[2], // Width of texture.
    metadata.shape[1], // Height of texture.
    metadata.shape[0] // Depth of texture.
  );

  texture.format = THREE.RedFormat; // Our texture has only one channel (red).
  texture.type = THREE.UnsignedByteType; // The data type is 8 bit unsighed integer.
  texture.minFilter = THREE.LinearFilter; // Linear filter for minification.
  texture.magFilter = THREE.LinearFilter; // Linear filter for maximization.

  // Repeat edge values when sampling outside of texture boundaries.
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;

  // Mark texture for update so that the changes take effect.
  texture.needsUpdate = true;

  return { texture, metadata };
}

function make_box() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const box = new THREE.Mesh(geometry);
  box.scale.set(1, 1, 1);
  // box.scale.set(dataDescription.scale[0], dataDescription.scale[1], dataDescription.scale[2]);

  const line = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x999999 })
  );
  box.add(line);
  return box;
}

function volumeMaterial(texture, renderProps) {
  return new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3, // Shader language version.
    uniforms: {
      dataTexture: { value: texture }, // Volume data texture.
      //   colorTexture: { value: colorTexture }, // Color palette texture.
      cameraPosition: { value: new THREE.Vector3() }, // Current camera position.
      samplingRate: { value: renderProps.samplingRate }, // Sampling rate of the volume.
      threshold: { value: renderProps.threshold }, // Threshold for adjusting volume rendering.
      alphaScale: { value: renderProps.alphaScale }, // Alpha scale of volume rendering.
      invertColor: { value: renderProps.invertColor }, // Invert color palette.
    },
    vertexShader: vertexShader, // Vertex shader code.
    fragmentShader: fragmentShader, // Fragment shader code.
    side: THREE.BackSide, // Render only back-facing triangles of box geometry.
    transparent: true, // Use alpha channel / alpha blending when rendering.
  });
}

export class VolumeViewer extends HTMLElement {
  constructor() {
    super();
    this.isVisible = true;
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { container, canvas, scene, renderer, gui } = setupThreeJS(this);

    const model = this.getAttribute("model");
    const model_metadata = this.getAttribute("model-metadata");

    // Make a box that just holds some triangles that our shader will render onto.
    const box = make_box();
    scene.add(box);

    let material = null;
    load_model(model, model_metadata, scene).then(({ texture, metadata }) => {
      // Create the custom material with attached shaders.
      material = volumeMaterial(texture, renderProps);
      box.material = material;
      gui
        .add(material.uniforms.samplingRate, "value", 0.1, 2.0, 0.1)
        .name("Sampling Rate");
      gui
        .add(material.uniforms.threshold, "value", 0.0, 1.0, 0.01)
        .name("Threshold");
      gui
        .add(material.uniforms.alphaScale, "value", 0.1, 2.0, 0.1)
        .name("Alpha Scale");
      gui.add(material.uniforms.invertColor, "value").name("Invert Color");
    });

    const renderProps = {
      samplingRate: 1.0,
      threshold: 0.1,
      alphaScale: 1.0,
      invertColor: false,
    };

    const render = () => renderer.render(scene, this.camera);
    this.render = render;

    // --- OrbitControls ---
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.addEventListener("change", render);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.autoRotate = true;
    deserialiseControls(this);

    canvas.addEventListener("click", () => {
      this.controls.autoRotate = false;
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    window.addEventListener("resize", this.onWindowResize, false);

    this.onWindowResize = () => {
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    const timer = new Timer();

    const update = () => {
      if (this.isVisible) {
        timer.update();
        const delta = timer.getDelta();
        this.controls.update(delta);
        if (material)
          box.material.uniforms.cameraPosition.value.copy(this.camera.position);
        this.render();
        requestAnimationFrame(update);
      }
    };
    update();
  }
}
