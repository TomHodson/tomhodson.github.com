import * as THREE from "three";


import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

import { CustomOutlinePass } from "./CustomOutlinePass.js";
import FindSurfaces from "./FindSurfaces.js";


class OutlineModelViewer extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "closed" });
    this.render();

    const model_path = this.getAttribute("model") ||  "/assets/projects/bike_lights/models/bigger.glb";
    const canvas = this.shadow.querySelector("canvas");

    let canvas_rect = canvas.getBoundingClientRect();
    console.log(canvas.clientWidth, canvas.clientHeight, canvas_rect, window.devicePixelRatio);

    const body = document.getElementsByTagName("body")[0];
    const style = window.getComputedStyle(body);

    const outline_color = 0x000000;
    const model_color = 0xffffff;

    // Init scene
    const camera = new THREE.PerspectiveCamera(
      70,
      canvas_rect.width / canvas_rect.height,
      0.1,
      100
    );
    camera.position.set(10, 2.5, 4);

    // create the scene and the camera
    const scene = new THREE.Scene();

    // override the model material to be a flat color
    // scene.overrideMaterial = new THREE.MeshBasicMaterial({color: model_color});

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });

    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(canvas_rect.width, canvas_rect.height, false);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light);
    light.position.set(1.7, 1, -1);

    // Set up post processing
    // Create a render target that holds a depthTexture so we can use it in the outline pass
    // See: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget.depthBuffer
    const depthTexture = new THREE.DepthTexture();
    const renderTarget = new THREE.WebGLRenderTarget(
      2*canvas_rect.width,
      2*canvas_rect.height,
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
      new THREE.Vector2(2*canvas_rect.width, 2*canvas_rect.height),
      scene,
      camera,
      outline_color,
    );
    composer.addPass(customOutline);

    // Antialias pass.
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      .5 / canvas_rect.width,
      .5 / canvas_rect.height
    );
    composer.addPass(effectFXAA);

    const surfaceFinder = new FindSurfaces();
    // Load model
    const loader = new GLTFLoader();
    loader.load(model_path, (gltf) => {
      scene.add(gltf.scene);
      surfaceFinder.surfaceId = 0;

      scene.traverse((node) => {
        if (node.type == "Mesh") {
          const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
          node.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colorsTypedArray, 4)
          );

          //override materials
          node.material = new THREE.MeshStandardMaterial({
            emissive: model_color, 
            // opacity: node.material.transparent ? 0 : 1
          });
        }
      });

      customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
    });

    // Set up orbital camera controls.
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.update();

    // Render loop
    function update() {
      requestAnimationFrame(update);
      controls.update();
      composer.render();
    }
    update();

    function onWindowResize() {
      canvas_rect = canvas.getBoundingClientRect();
      camera.aspect = canvas_rect.width / canvas_rect.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvas_rect.width, canvas_rect.height, false);
      composer.setSize(2*canvas_rect.width, 2*canvas_rect.height);
      effectFXAA.setSize(2*canvas_rect.width, 2*canvas_rect.height);
      customOutline.setSize(2*canvas_rect.width, 2*canvas_rect.height);
      effectFXAA.uniforms["resolution"].value.set(
        .5 / canvas_rect.width,
        .5 / canvas_rect.height
      );
    }

    window.addEventListener("resize", onWindowResize, false);

  }

  render() {
    this.shadow.innerHTML = `
      <canvas class="canvas" id="bob"></canvas>


      <style>
        .canvas {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 0.25rem;
        }
      </style>
    `;
  }
}

customElements.define("outline-model-viewer", OutlineModelViewer);