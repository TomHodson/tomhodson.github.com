import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { Timer } from "three/addons/Addons.js";

import { setupThreeJS, serialiseCamera } from "./helpers.js";
import { CustomOutlinePass } from "./CustomOutlinePass.js";
import FindSurfaces from "./FindSurfaces.js";

import { load_gltf } from "./LoadGLTF.js";

export class OutlineModelViewer extends HTMLElement {
  constructor() {
    super();
    this.isVisible = true;
    this.shadow = this.attachShadow({ mode: "open" });
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

  hideUI() {
    console.log("Hiding UI");
    this.component.hideUI();
  }

  updatePixelRatio(r) {
    this.pixelRatio = r;
    this.component.renderer.setPixelRatio(r);
    this.customOutline.updateEdgeThickness(
      this.pixelRatio * this.edgeThickness
    );
  }

  updateEdgeThickness(t) {
    this.edgeThickness = t;
    this.customOutline.updateEdgeThickness(
      this.pixelRatio * this.edgeThickness
    );
  }

  connectedCallback() {
    let element = this;
    let component = setupThreeJS(this);
    this.component = component;
    const { canvas, camera, scene, renderer, gui } = component;

    const model_path = this.getAttribute("model");
    const spin = (this.getAttribute("spin") || "true") === "true";

    // determine the outline and bg colors
    const body = document.getElementsByTagName("body")[0];
    const style = window.getComputedStyle(body);
    const outline_color = style.getPropertyValue("--theme-model-line-color");
    const model_color = style.getPropertyValue("--theme-model-bg-color");

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

    this.pixelRatio = window.devicePixelRatio;

    console.log(`window.innerWidth ${window.innerWidth}`);
    console.log(
      `canvas.width ${canvas.width} canvas.clientWidth ${canvas.clientWidth}`
    );
    console.log(
      `canvas.height ${canvas.height} canvas.clientHeight ${canvas.clientHeight}`
    );
    let width =
      Math.min(canvas.clientWidth, window.innerWidth) * this.pixelRatio;

    let height =
      Math.min(canvas.clientHeight, window.innerHeight) * this.pixelRatio;
    console.log(`width, height are ${[width, height]}`);

    // Set up post processing
    // Create a render target that holds a depthTexture so we can use it in the outline pass
    // See: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget.depthBuffer
    const depthTexture = new THREE.DepthTexture();
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      depthTexture: depthTexture,
      depthBuffer: true,
    });

    // Initial render pass.
    const composer = new EffectComposer(renderer, renderTarget);
    component.composer = composer;
    const pass = new RenderPass(scene, camera);
    composer.addPass(pass);

    // Outline pass.
    const customOutline = new CustomOutlinePass(
      new THREE.Vector2(width, height),
      scene,
      camera,
      outline_color,
      this.edgeThickness * this.pixelRatio
    );
    composer.addPass(customOutline);
    this.customOutline = customOutline;

    // Antialias pass.
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(1.0 / width, 1.0 / height);
    composer.addPass(effectFXAA);

    // Set over sampling ratio
    this.updateEdgeThickness(1 / window.devicePixelRatio);
    this.updatePixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);

    component.render = composer.render;

    // Load model
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
    const surfaceFinder = new FindSurfaces();
    loader.load(model_path, (gltf) =>
      load_gltf(this, scene, surfaceFinder, model_color, customOutline, gltf)
    );

    // Set up orbital camera controls.
    let controls = new OrbitControls(camera, renderer.domElement);
    component.controls = controls;
    controls.autoRotate = spin;
    controls.update();

    // Event listener for mouse movement
    canvas.addEventListener("mousemove", (event) =>
      this.onMouseMove(event, canvas)
    );

    let intersects = [];
    const doRayCast = () => {
      // Perform raycasting for a click
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

          this.shadow.querySelector(
            "#clicked-item"
          ).innerText = `${object.name}`;
        }
      } else if (this.intersectedObject) {
        this.intersectedObject = null;
      }
      if (intersects.length === 0) {
        this.shadow.querySelector("#clicked-item").innerText = "";
      }
    };
    window.addEventListener("click", doRayCast);

    // Render loop
    this.render_loop = true;
    const timer = new Timer();
    const update = () => {
      if (this.isVisible && this.render_loop) {
        timer.update();
        const delta = timer.getDelta();
        requestAnimationFrame(update);
        controls.update(delta);
        composer.render();
      }
    };
    update();

    // Pausing/resuming the render loop when element visibility changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          //   console.log("Model Viewer Element is visible. Resuming rendering...");
          this.isVisible = true;
          update(); // Resume the loop
        } else {
          //   console.log(
          //     "Model Viewer Element is not visible. Pausing rendering..."
          //   );
          this.isVisible = false; // Pauses rendering
        }
      });
    });

    // Observe this element for visibility changes
    observer.observe(this);

    function onWindowResize() {
      // Update the internal dimensions of the canvas
      console.log("onWindowResize triggered.");
      console.log(`window.innerWidth ${window.innerWidth}`);
      console.log(
        `Current: canvas.width ${canvas.width} canvas.clientWidth ${canvas.clientWidth} element.pixelRatio ${element.pixelRatio}`
      );
      console.log(
        `Current: canvas.height ${canvas.height} canvas.clientHeight ${canvas.clientHeight}`
      );
      let width =
        Math.min(canvas.clientWidth, window.innerWidth) * element.pixelRatio;

      let height =
        Math.min(canvas.clientHeight, window.innerHeight) * element.pixelRatio;
      console.log(`width and height are ${[width, height]}`);

      canvas.width = width;
      canvas.height = height;

      // Recompute the camera matrix
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Resive the various render targets
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      effectFXAA.setSize(width, height);
      customOutline.setSize(width, height);

      //
      effectFXAA.uniforms["resolution"].value.set(1.0 / width, 1.0 / height);
    }

    this.onWindowResize = onWindowResize;
    const resizeObserver = new ResizeObserver(onWindowResize);
    resizeObserver.observe(canvas);

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
      edgeThickness: this.edgeThickness,
      pixelRatio: this.pixelRatio,
    };

    gui.add(params, "spin").onChange((value) => {
      controls.autoRotate = value;
    });

    gui
      .add(params.mode, "Mode", {
        "Outlines + Shaded (default)": 0,
        "Just Outlines": 5,
        "Only outer outlines + shading": 1,
        "Only shading": 2,
        "(Debug) SurfaceID buffer": 4,
        "(Debug) Depth buffer": 3,
        "(Debug) Depth Difference (external edges / outline)": 6,
        "(Debug) SurfaceID Difference (internal edges)": 7,
      })
      .onChange(function (value) {
        uniforms.debugVisualize.value = value;
      });

    gui
      .add(params, "edgeThickness", 1 / window.devicePixelRatio, 10)
      .onChange(function (value) {
        element.updateEdgeThickness(value);
      });

    gui.add(params, "pixelRatio", 1, 8, 1).onChange(function (value) {
      element.updatePixelRatio(value);
      element.onWindowResize();
    });
  }
}
export default OutlineModelViewer;
