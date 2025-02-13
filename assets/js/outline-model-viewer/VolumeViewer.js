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

// See https://stackoverflow.com/questions/62003464/what-is-relation-between-type-and-format-of-texture
// https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
const dtypes = {
  uint8: {
    internalFormat: "R8",
    format: THREE.RedFormat,
    type: THREE.UnsignedByteType,
    array_type: Uint8Array,
  },
  float16: {
    internalFormat: "R16F",
    format: THREE.RedFormat,
    type: THREE.HalfFloatType,
    array_type: Uint16Array,
  },
  float32: {
    internalFormat: "R32F",
    format: THREE.RedFormat,
    type: THREE.FloatType,
    array_type: Float32Array,
  },
};

async function load_metadata(metadata_path) {
  console.log("Loading metadata from", metadata_path);
  const metadata_res = await fetch(metadata_path);
  return await metadata_res.json();
}

async function load_model_compressed_bytes(model_path) {
  const model_response = await fetch(model_path);
  const ds = new DecompressionStream("gzip");
  const blob_in = await model_response.blob();
  console.log("Compressed Model size", blob_in.size);
  const stream_in = blob_in.stream().pipeThrough(ds);
  const buffer = await new Response(stream_in).arrayBuffer();
  console.log("Decompressed Model size", buffer.byteLength);
  return buffer;
}

async function load_model_bytes_gzip(model_path, metadata_path) {
  const [metadata, model_buffer] = await Promise.all([
    load_metadata(metadata_path),
    load_model_compressed_bytes(model_path),
  ]);

  const array_type = dtypes[metadata.dtype].array_type;
  return [metadata, new array_type(model_buffer)];
}

async function load_model(model_path, metadata_path, scene) {
  // If the model path ends in ".gz", we assume that the model is compressed.
  const [metadata, model_data] = await load_model_bytes_gzip(
    model_path,
    metadata_path
  );

  console.log("Loaded model with metadata", metadata);
  console.log("Model shape", metadata.shape);
  console.log("Model dtype", metadata.dtype);

  const texture = new THREE.Data3DTexture(
    model_data, // The data values stored in the pixels of the texture.
    metadata.shape[2], // Width of texture.
    metadata.shape[1], // Height of texture.
    metadata.shape[0] // Depth of texture.
  );
  texture.internalFormat = dtypes[metadata.dtype].internalFormat;
  texture.format = dtypes[metadata.dtype].format;
  texture.type = dtypes[metadata.dtype].type;

  texture.minFilter = THREE.LinearFilter; // Linear filter for minification.
  texture.magFilter = THREE.LinearFilter; // Linear filter for maximization.
  //   texture.minFilter = THREE.NearestFilter; // Nearest filter for minification.
  //   texture.magFilter = THREE.NearestFilter; // Nearest filter for maximization.

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
      renderMode: { value: renderProps.renderMode }, // Rendering mode.
      cameraPosition: { value: new THREE.Vector3() }, // Current camera position.
      samplingRate: { value: renderProps.samplingRate }, // Sampling rate of the volume.

      clampMin: { value: renderProps.clampMin }, // Clamp values below this value to 0.
      clampMax: { value: renderProps.clampMax }, // Clamp values above this value to 1.

      iso_threshold: { value: renderProps.iso_threshold }, // Threshold for adjusting volume rendering.
      iso_width: { value: renderProps.iso_width }, // Threshold for adjusting volume rendering.

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
    const { container, canvas, scene, renderer, gui, gui_buttons } =
      setupThreeJS(this);

    const model = this.getAttribute("model");
    const model_metadata = this.getAttribute("model-metadata");

    // Make a box that just holds some triangles that our shader will render onto.
    const box = make_box();
    scene.add(box);

    const renderModes = {
      "Max Intensity": 0,
      "Mean Intensity": 1,
      "Min Intensity": 2,
      Isosurface: 3,
    };

    let material = null;
    load_model(model, model_metadata, scene).then(({ texture, metadata }) => {
      // Create the custom material with attached shaders.
      material = volumeMaterial(texture, presets.Default);
      box.material = material;
      gui
        .add(material.uniforms.renderMode, "value", renderModes)
        .name("Render Mode");
      gui
        .add(material.uniforms.samplingRate, "value", 0.1, 2.0, 0.1)
        .name("Sampling Rate");
      gui
        .add(material.uniforms.clampMin, "value", 0.0, 1.0, 0.01)
        .name("Clamp Min");
      gui
        .add(material.uniforms.clampMax, "value", 0.0, 1.0, 0.01)
        .name("Clamp Max");
      gui
        .add(material.uniforms.iso_threshold, "value", 0.0, 1.0, 0.01)
        .name("Isosurface Threshold");
      gui
        .add(material.uniforms.iso_width, "value", 0.0, 0.05, 0.001)
        .name("Isosurface Width");
      gui
        .add(material.uniforms.alphaScale, "value", 0.1, 2.0, 0.1)
        .name("Alpha Scale");
      gui.add(material.uniforms.invertColor, "value").name("Invert Color");
    });

    const presets = {
      Default: {
        renderMode: 0,
        samplingRate: 1.0,
        clampMin: 0.0,
        clampMax: 1.0,
        iso_threshold: 0.1,
        iso_width: 0.01,
        alphaScale: 1.0,
        invertColor: false,
      },
      "Air Pockets": {
        alphaScale: 2,
        clampMax: 1,
        clampMin: 0,
        invertColor: false,
        iso_threshold: 0.06,
        iso_width: 0.002,
        renderMode: 3,
        samplingRate: 1,
      },
    };

    // Add a button to print the current settings to the console
    gui_buttons
      .add(
        {
          printSettings: () =>
            console.log(
              Object.fromEntries(
                Object.keys(presets.Default).map((key) => [
                  key,
                  material?.uniforms[key]?.value,
                ])
              )
            ),
        },
        "printSettings"
      )
      .name("Print Current Settings");

    // Add a dropdown to select a preset
    let renderProps = {
      presets: "Default",
    };
    gui
      .add(renderProps, "preset", presets)
      .setValue("Default")
      .onChange((preset) => {
        Object.keys(preset).forEach((key) => {
          if (material.uniforms[key]) {
            material.uniforms[key].value = preset[key];
          } else {
            console.warn(`No uniform found for ${key}`);
          }
        });
        gui.controllers.forEach((control) => control.updateDisplay());
      })
      .name("Presets");

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
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    this.onWindowResize();

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
