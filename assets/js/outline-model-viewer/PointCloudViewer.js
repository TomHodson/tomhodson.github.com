import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { Timer } from "three/addons/Addons.js";

import {
  componentHTML,
  setupThreeJS,
  deserialiseCamera,
  deserialiseControls,
} from "./helpers.js";

export class PointCloudViewer extends HTMLElement {
  constructor() {
    super();
    this.isVisible = true;
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { container, canvas, scene, renderer, gui } = setupThreeJS(this);

    const loader = new PCDLoader();
    scene.add(new THREE.AxesHelper(1));

    const model = this.getAttribute("model");
    const render = () => renderer.render(scene, this.camera);
    this.render = render;

    loader.load(model, function (points) {
      points.material.size = 0.05;
      gui
        .add(points.material, "size", 0.01, 0.2)
        .name("Point Size")
        .onChange(render);

      points.geometry.center();
      points.geometry.rotateZ(-Math.PI / 2);
      points.name = "depth_map";
      scene.add(points);
      points.material.color = new THREE.Color(0x999999);
      render();
      console.log("Model Loaded.");
    });

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

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    const timer = new Timer();

    const update = () => {
      if (this.isVisible) {
        timer.update();
        const delta = timer.getDelta();
        requestAnimationFrame(update);
        this.controls.update(delta);
        this.render();
      }
    };
    update();
  }
}
