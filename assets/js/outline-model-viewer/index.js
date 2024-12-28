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

export class OutlineModelViewer extends HTMLElement {
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
    const mul = 2;

    let component_rect = this.getBoundingClientRect();

    this.render(component_rect.height);

    const model_path =
      this.getAttribute("model") ||
      "/assets/projects/bike_lights/models/bigger.glb";
    const spin = (this.getAttribute("spin") || "true") === "true";

    const container = this.shadow.querySelector("div#container");
    const canvas = this.shadow.querySelector("canvas");

    let canvas_rect = canvas.getBoundingClientRect();

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

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas_rect.width, canvas_rect.height, false);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      this.getAttribute("directional-light") || 2
    );
    scene.add(directionalLight);
    directionalLight.position.set(1.7, 1, -1);

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      this.getAttribute("ambient-light") || 0.5
    );
    scene.add(ambientLight);

    // Set up post processing
    // Create a render target that holds a depthTexture so we can use it in the outline pass
    // See: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget.depthBuffer
    const depthTexture = new THREE.DepthTexture();
    const renderTarget = new THREE.WebGLRenderTarget(
      mul * canvas_rect.width,
      mul * canvas_rect.height,
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
      new THREE.Vector2(mul * canvas_rect.width, mul * canvas_rect.height),
      scene,
      camera,
      outline_color
    );
    composer.addPass(customOutline);

    // Antialias pass.
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1.0 / canvas_rect.width / mul,
      1.0 / canvas_rect.height / mul
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
          // Add surface ID attribute to the geometry
          const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
          node.surfaceId = colorsTypedArray;
          node.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colorsTypedArray, 4)
          );

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
          const material_mode = this.getAttribute("materials") || "outlines";
          if (material_mode === "outlines") {
            node.material = new THREE.MeshStandardMaterial({
              emissive: model_color,
            });
          } else if (material_mode === "flat") {
            node.material = new THREE.MeshStandardMaterial({
              color: node.material.color,
            });
          } else if (material_mode === "keep") {
            // Do nothing, leave the material as set in the GLTF file
          } else {
            throw new Error("Invalid material mode");
          }
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

          shadow.querySelector(
            "#clicked-item"
          ).innerText = `${object.name} - ${object.type}`;
        }
      } else if (this.intersectedObject) {
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

      renderer.setSize(
        mul * canvas_rect.width,
        mul * canvas_rect.height,
        false
      );
      composer.setSize(mul * canvas_rect.width, mul * canvas_rect.height);
      effectFXAA.setSize(mul * canvas_rect.width, mul * canvas_rect.height);
      customOutline.setSize(mul * canvas_rect.width, mul * canvas_rect.height);
      effectFXAA.uniforms["resolution"].value.set(
        1.0 / canvas_rect.width / mul,
        1.0 / canvas_rect.height / mul
      );
    }

    onWindowResize();

    const gui = new GUI({
      title: "Settings",
      container: container,
      injectStyles: false,
      closeFolders: true,
    });

    if ((this.getAttribute("debug") || "closed") !== "open") gui.close();

    const uniforms = customOutline.fsQuad.material.uniforms;
    uniforms.debugVisualize.value = parseInt(this.getAttribute("mode")) || 0;

    const params = {
      spin: controls.autoRotate,
      ambientLight: parseFloat(ambientLight.intensity),
      directionalLight: parseFloat(directionalLight.intensity),
      mode: { Mode: uniforms.debugVisualize.value },
      depthBias: uniforms.multiplierParameters.value.x,
      depthMult: uniforms.multiplierParameters.value.y,
      lerp: uniforms.multiplierParameters.value.z,
      printCamera: () => console.log(serialiseCamera(camera, controls)),
    };

    gui.add(params, "spin").onChange((value) => {
      controls.autoRotate = value;
    });
    gui.add(params, "printCamera");

    gui
      .add(params.mode, "Mode", {
        "Outlines + Shaded (default)": 0,
        "Only outer outlines + shading": 1,
        Shaded: 2,
        "Depth buffer": 3,
        "SurfaceID buffer": 4,
        Outlines: 5,
        "Depth Difference": 6,
        "SurfaceID Difference": 7,
      })
      .onChange(function (value) {
        uniforms.debugVisualize.value = value;
      });

    gui.add(params, "ambientLight", 0.0, 10.0).onChange(function (value) {
      ambientLight.intensity = value;
    });
    gui.add(params, "directionalLight", 0.0, 10.0).onChange(function (value) {
      directionalLight.intensity = value;
    });

    gui.add(params, "depthBias", 0.0, 5).onChange(function (value) {
      uniforms.multiplierParameters.value.x = value;
    });
    gui.add(params, "depthMult", 0.0, 40.0).onChange(function (value) {
      uniforms.multiplierParameters.value.y = value;
    });
    gui.add(params, "lerp", 0.0, 1.0).onChange(function (value) {
      uniforms.multiplierParameters.value.z = value;
    });

    // Toggle fullscreen mode
    const shadow = this.shadow;
    const canvas_height = canvas.style.height;
    const lil_gui = shadow.querySelector(".lil-gui.root");
    const lil_gui_margin_top = lil_gui.style.marginTop;

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
          // Firefox
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          // Chrome, Safari and Opera
          container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          // IE/Edge
          container.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    // const fullScreenButton = this.shadow.querySelector("#fullscreen-btn");
    // fullScreenButton.addEventListener("click", () => toggleFullScreen());
    // window.addEventListener("resize", onWindowResize, false);

    // Handle fullscreen change events triggerd through various means
    function onFullScreenChange() {
      if (document.fullscreenElement) {
        canvas.style.height = "100%";
        lil_gui.style.marginTop = "0";
      } else {
        canvas.style.height = canvas_height;
        lil_gui.style.marginTop = lil_gui_margin_top;
      }
      onWindowResize();
    }
    document.addEventListener("fullscreenchange", onFullScreenChange);
  }

  render(height) {
    this.shadow.innerHTML = `
      <div id="container">
      <span id = "clicked-item"></span>
      <!-- <button id="fullscreen-btn">⛶</button> --!>
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

        #clicked-item {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            font-size: 0.7em;
            background: none;
            border: none;
            color: var(--theme-text-color);
            opacity: 50%;
        }

        #fullscreen-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--theme-text-color);
        }

        #fullscreen-btn:hover {
          color: var(--theme-subtle-outline);
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

export default OutlineModelViewer;
