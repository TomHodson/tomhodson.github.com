import * as THREE from "three";

import * as dat from 'dat.gui';

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

import { CustomOutlinePass } from "./CustomOutlinePass.js";
import FindSurfaces from "./FindSurfaces.js";


// Todo:
// Swap in the version of this code that has a debug GUI behind a flag
// Consider support for transparent objects by rendering them as a wireframe in the color and excluding them from the edge pass.
// Fix the cetnering and scaling
// Switch to an angled isometric camera to match the style from the main page.

const fitCameraToCenteredObject = function (camera, object, offset, orbitControls ) {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject( object );

  var middle = new THREE.Vector3();
  var size = new THREE.Vector3();
  boundingBox.getSize(size);

  // figure out how to fit the box in the view:
  // 1. figure out horizontal FOV (on non-1.0 aspects)
  // 2. figure out distance from the object in X and Y planes
  // 3. select the max distance (to fit both sides in)
  //
  // The reason is as follows:
  //
  // Imagine a bounding box (BB) is centered at (0,0,0).
  // Camera has vertical FOV (camera.fov) and horizontal FOV
  // (camera.fov scaled by aspect, see fovh below)
  //
  // Therefore if you want to put the entire object into the field of view,
  // you have to compute the distance as: z/2 (half of Z size of the BB
  // protruding towards us) plus for both X and Y size of BB you have to
  // figure out the distance created by the appropriate FOV.
  //
  // The FOV is always a triangle:
  //
  //  (size/2)
  // +--------+
  // |       /
  // |      /
  // |     /
  // | F° /
  // |   /
  // |  /
  // | /
  // |/
  //
  // F° is half of respective FOV, so to compute the distance (the length
  // of the straight line) one has to: `size/2 / Math.tan(F)`.
  //
  // FTR, from https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  // the camera.fov is the vertical FOV.

  const fov = camera.fov * ( Math.PI / 180 );
  const fovh = 2*Math.atan(Math.tan(fov/2) * camera.aspect);
  let dx = size.z / 2 + Math.abs( size.x / 2 / Math.tan( fovh / 2 ) );
  let dy = size.z / 2 + Math.abs( size.y / 2 / Math.tan( fov / 2 ) );
  let cameraZ = Math.max(dx, dy);

  // offset the camera, if desired (to avoid filling the whole canvas)
  if( offset !== undefined && offset !== 0 ) cameraZ *= offset;

  camera.position.set( 0, 0, cameraZ );

  // set the far plane of the camera so that it easily encompasses the whole object
  const minZ = boundingBox.min.z;
  const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

  camera.far = cameraToFarEdge * 3;
  camera.updateProjectionMatrix();

  if ( orbitControls !== undefined ) {
      // set camera to rotate around the center
      orbitControls.target = new THREE.Vector3(0, 0, 0);

      // prevent camera from zooming out far enough to create far plane cutoff
      orbitControls.maxDistance = cameraToFarEdge * 2;
  }
};

const setupDebug = () => {
  // Set up GUI controls
  const GUI = dat.GUI;
  const gui = new GUI({ width: 300, autoPlace: true});
  // container.append(gui.domElement);

  const uniforms = customOutline.fsQuad.material.uniforms;
  const params = {
    mode: { Mode: 0 },
    depthBias: uniforms.multiplierParameters.value.x,
    depthMult: uniforms.multiplierParameters.value.y,
    normalBias: uniforms.multiplierParameters.value.z,
    normalMult: uniforms.multiplierParameters.value.w,
  };

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
    gui.add(params, "normalBias", 0.0, 20).onChange(function (value) {
      uniforms.multiplierParameters.value.z = value;
    });
    gui.add(params, "normalMult", 0.0, 10).onChange(function (value) {
      uniforms.multiplierParameters.value.w = value;
    });
}

class OutlineModelViewer extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "closed" });
    this.render();

    const model_path = this.getAttribute("model") ||  "/assets/projects/bike_lights/models/bigger.glb";
    const container = this.shadow.querySelector("div#container");
    console.log(container);
    const canvas = this.shadow.querySelector("canvas");

    let canvas_rect = canvas.getBoundingClientRect();
    console.log(canvas_rect);

    const body = document.getElementsByTagName("body")[0];
    const style = window.getComputedStyle(body);
    const background_color = style.getPropertyValue("background-color");

    const isDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const outline_color = isDark ? 0xffffff : 0x000000;
    const model_color = background_color;

    // // Init scene
    // const camera = new THREE.PerspectiveCamera(
    //   70,
    //   canvas_rect.width / canvas_rect.height,
    //   0.1,
    //   100
    // );
    const camera = new THREE.OrthographicCamera( canvas_rect.width / - 2, canvas_rect.width / 2, canvas_rect.height / 2, canvas_rect.height / - 2, 1, 1000 );
    camera.zoom = parseFloat(this.getAttribute("zoom") || "1")
    console.log(camera.zoom)
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

    let bbox = new THREE.Box3().setFromObject(scene);
    let middle = new THREE.Vector3();
    bbox.getCenter(middle);

    // // Center it
    scene.applyMatrix4(new THREE.Matrix4().makeTranslation( -middle.x, -middle.y, -middle.z ) );
    // fitCameraToCenteredObject(camera, scene, 1, controls );
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
    if(this.getAttribute("debug")) setupDebug();

    document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) { 
    if (event.key == " ") {
        console.log(camera.toJSON());
    }
  }

  }

  render() {
    this.shadow.innerHTML = `
      <div id="container">
      <canvas class = "object-viewer"></canvas>
      <details>
      <summary>Debug</summary>
      <input id="outline" type="range" min="0.5" max="4" step="0.1" value="2" />
      </details>
      </div>

      <style>
        details {
          display: none;
        }

        #container {
          width: 90%;
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
    `;
  }
}

customElements.define("outline-model-viewer", OutlineModelViewer);