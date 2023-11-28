import * as THREE from "three";

// import * as dat from 'dat.gui';

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

import GUI from 'lil-gui'
import { CustomOutlinePass } from "./CustomOutlinePass.js";
import FindSurfaces from "./FindSurfaces.js";


// Todo:
// Swap in the version of this code that has a debug GUI behind a flag
// Consider support for transparent objects by rendering them as a wireframe in the color and excluding them from the edge pass.
// Fix the cetnering and scaling
// Switch to an angled isometric camera to match the style from the main page.

const serialiseCamera = (camera, controls) => {
  const position = Object.values(camera.position);
  const extractXYZ = ({_x, _y, _z}) => [_x, _y, _z];
  const rotation = extractXYZ(camera.rotation);
  const fixed = (l) => l.map( x => parseFloat(x.toPrecision(4)))
  return JSON.stringify({
      position: fixed(position), 
      rotation: fixed(rotation),
      zoom: camera.zoom,
      target: fixed(Object.values(controls.target)),
    });
};

const setupDebug = (container, customOutline, camera, controls) => {
  const gui = new GUI({
    container: container,
    width: "100%",
  });

  const uniforms = customOutline.fsQuad.material.uniforms;
  const params = {
    mode: { Mode: 0 },
    depthBias: uniforms.multiplierParameters.value.x,
    depthMult: uniforms.multiplierParameters.value.y,
    normalBias: uniforms.multiplierParameters.value.z,
    normalMult: uniforms.multiplierParameters.value.w,
    printCamera: () => console.log(serialiseCamera(camera, controls)),
  };

  gui.add(params, 'printCamera' );

  gui
    .add(params.mode, "Mode", {
      "Outlines": 0,
      "Original scene": 2,
      "Depth buffer": 3,
      "SurfaceID debug buffer": 4,
      "Outlines only": 5,
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
    // gui.add(params, "normalBias", 0.0, 20).onChange(function (value) {
    //   uniforms.multiplierParameters.value.z = value;
    // });
    // gui.add(params, "normalMult", 0.0, 10).onChange(function (value) {
    //   uniforms.multiplierParameters.value.w = value;
    // });
}

class OutlineModelViewer extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "closed" });
    this.render();

    const model_path = this.getAttribute("model") ||  "/assets/projects/bike_lights/models/bigger.glb";
    const spin = (this.getAttribute("spin") || 'true') === 'true'

    const container = this.shadow.querySelector("div#container");
    console.log(container);
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
    const camera = new THREE.OrthographicCamera( canvas_rect.width / - 2, canvas_rect.width / 2, canvas_rect.height / 2, canvas_rect.height / - 2, 1, 1000 );
    camera.zoom = parseFloat(this.getAttribute("zoom") || "1")
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
          
          const material_params =  this.getAttribute("true-color") ? {color: node.material.color} : {emissive: model_color};
          // override materials
          node.material = new THREE.MeshStandardMaterial(material_params);
        }
      });

      customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
    });

    // Set up orbital camera controls.
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = spin;
    controls.update();

    if(this.getAttribute("camera")) {
      const cameraState = JSON.parse(this.getAttribute("camera"));
      camera.zoom = cameraState.zoom;
      camera.position.set(...cameraState.position);
      camera.rotation.set(...cameraState.rotation);
      controls.target.set(...cameraState.target);
    }

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

    if(this.hasAttribute("debug")) {
      setupDebug(
         this.shadow.querySelector("div#container"),
         customOutline,
         camera,
         controls);
    }

  }

  render() {
    this.shadow.innerHTML = `
      <div id="container">
      <canvas class = "object-viewer"></canvas>
      </div>

      <style>
        details {
          display: none;
        }

        #container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        canvas {
          width: 100%;
          height: 100%;
          border-radius: 0.25rem;
        }
      </style>
      <link rel="stylesheet" href="/node_modules/lil-gui/dist/lil-gui.min.css">
    `;
  }
}

customElements.define("outline-model-viewer", OutlineModelViewer);