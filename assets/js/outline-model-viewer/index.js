import * as THREE from "three";

// import * as dat from 'dat.gui';

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

import GUI from "lil-gui";
import { CustomOutlinePass } from "./CustomOutlinePass.js";
import FindSurfaces from "./FindSurfaces.js";

// Todo:
// Swap in the version of this code that has a debug GUI behind a flag
// Consider support for transparent objects by rendering them as a wireframe in the color and excluding them from the edge pass.
// Switch to an angled isometric camera to match the style from the main page.

// Function to lighten or darken a color based on brightness
function adjustColor(color, factor) {
  const hsl = color.getHSL({}); // Get the HSL values of the current color
  if (hsl.l > 0.7) {
    // If the color is light, darken it
    hsl.l = Math.max(0, hsl.l - factor);
  } else {
    // If the color is dark, lighten it
    hsl.l = Math.min(1, hsl.l + factor);
  }
  color.setHSL(hsl.h, hsl.s, hsl.l); // Set the adjusted color
}

function printGLTFScene(scene, maxDepth = 3, depth = 0, indent = 0) {
  // Helper function to format the output
  if (depth > maxDepth) {
    return;
  }
  const pad = (level) => " ".repeat(level * 2);

  // Recursively print scene contents
  scene.traverse((object) => {
    console.log(
      `${pad(indent)}- ${object.type} ${
        object.name || "(unnamed)"
      } | Position: (${object.position.x.toFixed(
        2
      )}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`
    );

    if (object.children && object.children.length > 0) {
      console.log(`${pad(indent + 1)}Children:`);
      object.children.forEach((child) =>
        printGLTFScene(child, maxDepth, depth + 1, indent + 2)
      );
    }
  });
}

const serialiseCamera = (camera, controls) => {
  const position = Object.values(camera.position);
  const extractXYZ = ({ _x, _y, _z }) => [_x, _y, _z];
  const rotation = extractXYZ(camera.rotation);
  const fixed = (l) => l.map((x) => parseFloat(x.toPrecision(4)));
  return JSON.stringify({
    position: fixed(position),
    rotation: fixed(rotation),
    zoom: camera.zoom,
    target: fixed(Object.values(controls.target)),
  });
};

class OutlineModelViewer extends HTMLElement {
  constructor() {
    super();
    this.isVisible = true; // Track visibility
    this.shadow = this.attachShadow({ mode: "open" });

    // Mouse and raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersectedObject = null; // Store currently intersected object
  }

  // Handle mouse movement and update mouse coordinates
  onMouseMove(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  connectedCallback() {
    let component_rect = this.getBoundingClientRect();

    this.render(component_rect.height);

    const model_path =
      this.getAttribute("model") ||
      "/assets/projects/bike_lights/models/bigger.glb";
    const spin = (this.getAttribute("spin") || "true") === "true";

    const container = this.shadow.querySelector("div#container");
    const canvas = this.shadow.querySelector("canvas");

    let canvas_rect = canvas.getBoundingClientRect();
    console.log(canvas_rect);

    // determine the outline and bg colors
    const body = document.getElementsByTagName("body")[0];
    const style = window.getComputedStyle(body);
    const outline_color = style.getPropertyValue("--theme-model-line-color");
    const model_color = style.getPropertyValue("--theme-model-bg-color");

    // // Init scene
    // const camera = new THREE.PerspectiveCamera(70, canvas_rect.width / canvas_rect.height, 0.1, 100);
    const camera = new THREE.OrthographicCamera(
      canvas_rect.width / -2,
      canvas_rect.width / 2,
      canvas_rect.height / 2,
      canvas_rect.height / -2,
      1,
      1000
    );
    camera.zoom = parseFloat(this.getAttribute("zoom") || "1");
    camera.position.set(10, 2.5, 4);

    // create the scene and the camera
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });

    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(canvas_rect.width, canvas_rect.height, false);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(light);
    light.position.set(1.7, 1, -1);

    scene.add(new THREE.AmbientLight(0xffffff, 5));

    // Set up post processing
    // Create a render target that holds a depthTexture so we can use it in the outline pass
    // See: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget.depthBuffer
    const depthTexture = new THREE.DepthTexture();
    const renderTarget = new THREE.WebGLRenderTarget(
      2 * canvas_rect.width,
      2 * canvas_rect.height,
      {
        depthTexture: depthTexture,
        depthBuffer: true,
      }
    );

    // Initial render pass.
    const composer = new EffectComposer(renderer, renderTarget);
    const pass = new RenderPass(scene, camera);
    composer.addPass(pass);

    // Outline pass.
    const customOutline = new CustomOutlinePass(
      new THREE.Vector2(2 * canvas_rect.width, 2 * canvas_rect.height),
      scene,
      camera,
      outline_color
    );
    composer.addPass(customOutline);

    // Antialias pass.
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      0.5 / canvas_rect.width,
      0.5 / canvas_rect.height
    );
    composer.addPass(effectFXAA);

    const surfaceFinder = new FindSurfaces();
    // Load model
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(model_path, (gltf) => {
      scene.add(gltf.scene);
      surfaceFinder.surfaceId = 0;

      // Compute bounding box
      let box = new THREE.Box3().setFromObject(gltf.scene);

      // Scale the model to fit into a unit cube
      const size = new THREE.Vector3();
      box.getSize(size); // Get the size of the bounding box
      const maxDim = Math.max(size.x, size.y, size.z); // Find the largest dimension
      const scaleFactor = 1 / maxDim; // Calculate the scaling factor
      gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor); // Apply the scale uniformly

      // Reposition the model so that its center is at the origin
      let box2 = new THREE.Box3().setFromObject(gltf.scene);
      const center = new THREE.Vector3();
      box2.getCenter(center); // Get the center of the bounding box
      gltf.scene.position.sub(center); // Subtract the center from the position

      // Modify the materials to support surface coloring
      scene.traverse((node) => {
        if (node.type == "Mesh") {
          const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
          node.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colorsTypedArray, 4)
          );

          let material_params = this.getAttribute("true-color")
            ? { color: node.material.color }
            : { emissive: model_color };

          if (node.name.includes("track") || node.name.includes("zone")) {
            //set to a copper colour
            // #c87533
            material_params = {
              color: new THREE.Color(0x558855),
            };
            node.position.y += 0.00001;
          }
          if (node.name.includes("pad")) {
            material_params = {
              color: new THREE.Color(0xaaaaaa),
            };
            node.position.y += 0.00002;
          }
          // override materials
          node.material = new THREE.MeshStandardMaterial(material_params);
        }
      });

      customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);

      // Print out the scene structure to the console
      //   printGLTFScene(gltf.scene, 1);
    });

    // Set up orbital camera controls.
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = spin;
    controls.update();

    if (this.getAttribute("camera")) {
      const cameraState = JSON.parse(this.getAttribute("camera"));
      camera.zoom = cameraState.zoom;
      camera.position.set(...cameraState.position);
      camera.rotation.set(...cameraState.rotation);
      controls.target.set(...cameraState.target);
    }

    // Event listener for mouse movement
    canvas.addEventListener("mousemove", (event) =>
      this.onMouseMove(event, canvas)
    );

    let intersects = [];
    const doRayCast = () => {
      // Perform raycasting for hovering
      this.raycaster.setFromCamera(this.mouse, camera);

      intersects.length = 0;
      this.raycaster.intersectObjects(scene.children, true, intersects);

      if (intersects.length > 0) {
        const object = intersects[0].object;

        // If the intersected object has changed
        if (this.intersectedObject !== object) {
          if (this.intersectedObject) {
            // Reset the color of the previously hovered object
            this.intersectedObject.material.emissive.setHex(
              this.intersectedObject.currentHex
            );
          }
          // Store the current hex color and set highlight color
          this.intersectedObject = object;
          this.intersectedObject.currentHex =
            this.intersectedObject.material.emissive.getHex();

          // Adjust the emissive color based on current brightness
          const currentColor = new THREE.Color(
            this.intersectedObject.material.emissive.getHex()
          );
          adjustColor(currentColor, 0.2); // Lighten or darken based on brightness
          this.intersectedObject.material.emissive.set(currentColor);

          // Print the name of the intersected object
          params.selectedObject = object.name || "(unnamed object)";
        }
      } else if (this.intersectedObject) {
        // Reset the color if the mouse is no longer hovering over any object
        this.intersectedObject.material.emissive.setHex(
          this.intersectedObject.currentHex
        );
        this.intersectedObject = null;
        params.selectedObject = "";
      }
    };
    window.addEventListener("click", doRayCast);

    // Render loop
    const update = () => {
      if (this.isVisible) {
        requestAnimationFrame(update);
        controls.update();
        composer.render();
        // doRayCast();
      }
    };
    update();

    // Pausing/resuming the render loop when element visibility changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Model Viewer Element is visible. Resuming rendering...");
          this.isVisible = true;
          update(); // Resume the loop
        } else {
          console.log(
            "Model Viewer Element is not visible. Pausing rendering..."
          );
          this.isVisible = false; // Pauses rendering
        }
      });
    });

    // Observe this element for visibility changes
    observer.observe(this);

    function onWindowResize() {
      canvas_rect = canvas.getBoundingClientRect();
      camera.aspect = canvas_rect.width / canvas_rect.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvas_rect.width, canvas_rect.height, false);
      composer.setSize(2 * canvas_rect.width, 2 * canvas_rect.height);
      effectFXAA.setSize(2 * canvas_rect.width, 2 * canvas_rect.height);
      customOutline.setSize(2 * canvas_rect.width, 2 * canvas_rect.height);
      effectFXAA.uniforms["resolution"].value.set(
        0.5 / canvas_rect.width,
        0.5 / canvas_rect.height
      );
    }
    window.addEventListener("resize", onWindowResize, false);

    const gui = new GUI({
      title: "Settings",
      container: container,
      injectStyles: false,
      closeFolders: true,
    });
    gui.close();

    const uniforms = customOutline.fsQuad.material.uniforms;
    const params = {
      selectedObject: "None",
      spin: controls.autoRotate,
      mode: { Mode: 0 },
      depthBias: uniforms.multiplierParameters.value.x,
      depthMult: uniforms.multiplierParameters.value.y,
      FXAA_resolution: 0.5,
      printCamera: () => console.log(serialiseCamera(camera, controls)),
    };

    gui.add(params, "selectedObject").listen();
    gui.add(params, "spin").onChange((value) => {
      controls.autoRotate = value;
    });
    gui.add(params, "printCamera");

    gui
      .add(params.mode, "Mode", {
        "Outlines + Shaded (default)": 0,
        Shaded: 2,
        "Depth buffer": 3,
        "SurfaceID buffer": 4,
        Outlines: 5,
      })
      .onChange(function (value) {
        uniforms.debugVisualize.value = value;
      });

    gui.add(params, "depthBias", 0.0, 5).onChange(function (value) {
      uniforms.multiplierParameters.value.x = value;
    });
    gui.add(params, "depthMult", 0.0, 20).onChange(function (value) {
      uniforms.multiplierParameters.value.y = value;
    });

    gui.add(params, "FXAA_resolution", 0.0, 2).onChange((value) => {
      effectFXAA.uniforms["resolution"].value.set(
        value / canvas_rect.width,
        value / canvas_rect.height
      );
    });
  }

  render(height) {
    this.shadow.innerHTML = `
      <div id="container">
      <canvas class = "object-viewer"></canvas>
      </div>
      <link rel="stylesheet" href="/node_modules/lil-gui/dist/lil-gui.min.css">
      <style>

        #container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          border-radius: inherit;
        }

        .lil-gui .title {height: 2em;}
        .lil-gui.root {
          margin-top: calc(${height}px - 2em);
          width: 100%;
          z-index: 1;
          --background-color: none;
          --text-color: var(--theme-text-color);
          --title-background-color: none;
          --title-text-color: var(--theme-text-color);
          --widget-color: var(--theme-subtle-outline);
          --hover-color: lightgrey;
          --focus-color: lightgrey;
          --number-color: #2cc9ff;
          --string-color: #a2db3c;
      }

      .lil-gui button {
        border: var(--theme-subtle-outline) 1px solid;
      }

      .lil-gui .controller.string input {
        background-color: var(--theme-subtle-outline);
        color: var(--theme-text-color);
      }

        canvas {
          position: absolute;
          width: 100%;
          height: ${height}px;
          border-radius: inherit;
        }
      </style>
    `;
  }
}

customElements.define("outline-model-viewer", OutlineModelViewer);
