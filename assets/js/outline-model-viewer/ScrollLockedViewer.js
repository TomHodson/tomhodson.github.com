import * as THREE from "three";

// import * as dat from 'dat.gui';

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

// let ticking = false;
// let attached = false;
// function render() {
//   const there =
//     viewer.getBoundingClientRect().bottom <
//     sticky.getBoundingClientRect().bottom;

//   const delta = (window.scrollY - last_scroll_pos) / 30;

//   if (there && !attached) {
//     console.log("attaching");
//     sticky.appendChild(viewer);
//     viewer.hide_ui();
//     viewer.style.height = "100px";
//     viewer.style.width = "100px";
//     viewer.style["min-height"] = "unset";
//     viewer.component.canvas.style.height = "100%";
//     viewer.style.border = "unset";
//     viewer.onWindowResize();
//     viewer.component.render_loop = false;
//     attached = true;
//   }

// if ((window.scrollY < transition_scroll_pos) && attached) {
//     console.log("detaching");
//     viewer.replaceWith(date);
//     byline.style.display = "unset";
//     attached = false;
// }

export class ScrollLockedViewer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    let component = setupThreeJS(this);
    this.component = component;
    const { canvas, camera, scene, renderer } = component;

    component.hide_ui();
    this.style.display = "block";
    // this.style.height = "100px";
    this.style["aspect-ratio"] = "1 / 1";
    this.style["min-height"] = "unset";
    component.canvas.style.height = "100%";
    component.container.style.height = "100%";
    // this.style.border = "unset";

    const render_size_multiplier = 4;
    renderer.setPixelRatio(render_size_multiplier);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

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

    // Set up post processing
    // Create a render target that holds a depthTexture so we can use it in the outline pass
    // See: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget.depthBuffer
    console.log(`clientHeight ${canvas.clientHeight} height ${canvas.height}`);
    console.log(`clientWidth ${canvas.clientWidth} width ${canvas.width}`);
    const depthTexture = new THREE.DepthTexture();
    const renderTarget = new THREE.WebGLRenderTarget(
      canvas.width,
      canvas.height,
      {
        depthTexture: depthTexture,
        depthBuffer: true,
      }
    );

    // Initial render pass.
    const composer = new EffectComposer(renderer, renderTarget);
    component.composer = composer;
    const pass = new RenderPass(scene, camera);
    composer.addPass(pass);

    // Outline pass.
    const customOutline = new CustomOutlinePass(
      new THREE.Vector2(canvas.width, canvas.height),
      scene,
      camera,
      outline_color,
      render_size_multiplier
    );
    composer.addPass(customOutline);

    // Antialias pass.
    // const effectFXAA = new ShaderPass(FXAAShader);
    // effectFXAA.uniforms["resolution"].value.set(
    //   1.0 / canvas.width,
    //   1.0 / canvas.height
    // );
    // composer.addPass(effectFXAA);

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

    let last_scroll_pos = 0;
    const onscroll = () => {
      const delta = (window.scrollY - last_scroll_pos) / 30;

      if (Math.abs(delta) > 0.1) {
        controls.update(delta);
        composer.render();
        last_scroll_pos = window.scrollY;
      }
    };

    let ticking = false;
    document.addEventListener("scroll", (event) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onscroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    this.render = composer.render;
  }
}

export default ScrollLockedViewer;
