import * as THREE from 'three';

import GUI from 'lil-gui'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import Stats from "three/examples/libs/stats.module.js";
// node_modules/three/examples/jsm/libs/stats.module.js

// previously this feature is .legacyMode = false, see https://www.donmccurdy.com/2020/06/17/color-management-in-threejs/
// turning this on has the benefit of doing certain automatic conversions (for hexadecimal and CSS colors from sRGB to linear-sRGB)
THREE.ColorManagement.enabled = true

class SphereViewer extends HTMLElement {
  constructor() {
    super();

    let component_rect = this.getBoundingClientRect();
    console.log("component_rect", component_rect);

    this.shadow = this.attachShadow({ mode: "open" });
    this.render(component_rect.height);

    const container = this.shadow.querySelector("div#container");
    const canvas = this.shadow.querySelector("canvas");

    let canvas_rect = canvas.getBoundingClientRect();

    // determine the outline and bg colors 
    const body = document.getElementsByTagName("body")[0];
    const style = window.getComputedStyle(body);
    const outline_color = style.getPropertyValue("--theme-model-line-color");
    const model_color = style.getPropertyValue("--theme-model-bg-color");

    // // Init scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( model_color);

    const camera = new THREE.PerspectiveCamera( 70, canvas_rect.width / canvas_rect.height, 0.01, 1000 );
    camera.position.set( 0, 200, 200 );
    camera.lookAt(0,0,0);
    scene.add( camera );

    scene.add( new THREE.AmbientLight( 0xf0f0f0, 3 ) );
    const light = new THREE.SpotLight( 0xffffff, 4.5 );
    light.position.set( 0, 1500, 200 );
    light.angle = Math.PI * 0.2;
    light.decay = 0;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add( light );

    // Texture loading
    const loader = new THREE.TextureLoader();

    function load_texture(url) {
        const texture = loader.load(url);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        return texture;
    }

    // Sphere
    const geometry = new THREE.SphereGeometry( 100, 1000, 1000 ); 
    const earth_materials = {
        earth1k: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: load_texture("/assets/blog/sphere_geodesics/earthmap1k.jpg"),
        bumpMap: load_texture("/assets/blog/sphere_geodesics/earthbump1k.jpg"),
        displacementMap: load_texture("/assets/blog/sphere_geodesics/earthbump1k.jpg"),
        emissiveMap: load_texture("/assets/blog/sphere_geodesics/earthlights1k.jpg"),
        specularMap: load_texture("/assets/blog/sphere_geodesics/earthspec1k.jpg"),
        emissive: 0xffffff,
      }),
      earth10k: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: load_texture("/assets/blog/sphere_geodesics/earthmap10k.jpg"),
        bumpMap: load_texture("/assets/blog/sphere_geodesics/earthbump10k.jpg"),
        displacementMap: load_texture("/assets/blog/sphere_geodesics/earthbump10k.jpg"),
        emissiveMap: load_texture("/assets/blog/sphere_geodesics/earthlights10k.jpg"),
        specularMap: load_texture("/assets/blog/sphere_geodesics/earthspec10k.jpg"),
        emissive: 0xffffff,
      }),
      checkerboard: new THREE.MeshBasicMaterial({
        onBeforeCompile: shader => {
            shader.fragmentShader = `${shader.fragmentShader}`
          .replace(
              `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
              float chCount = 15.;
              float checker = (1. / chCount);
              float actualCheckers = 1. - checker;
              float halfChecker = checker * 0.5;
                vec2 bUv = (vUv * actualCheckers) - halfChecker;
                vec2 cUv = fract((bUv) * (chCount * 0.5)) - 0.5;
              float checkerVal = clamp(step(cUv.x * cUv.y, 0.), 0.5, 1.);
                vec3 col = vec3(checkerVal);
                vec4 diffuseColor = vec4( col, opacity );
            `
          );},
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
      })
    };
    
    earth_materials["checkerboard"].defines = {"USE_UV":""};

    const sphere = new THREE.Mesh(geometry, earth_materials["earth1k"]); 
    scene.add( sphere );


    // const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
    // planeGeometry.rotateX( - Math.PI / 2 );
    // const planeMaterial = new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.2 } );

    // const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    // plane.position.y = - 200;
    // plane.receiveShadow = true;
    // scene.add( plane );

    // const helper = new THREE.GridHelper( 2000, 100 );
    // helper.position.y = - 199;
    // helper.material.opacity = 0.25;
    // helper.material.transparent = true;
    // scene.add( helper );

    const renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true},
        (_renderer) => {
        // best practice: ensure output colorspace is in sRGB, see Color Management documentation:
        // https://threejs.org/docs/#manual/en/introduction/Color-management
        _renderer.outputColorSpace = THREE.SRGBColorSpace
      })
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(canvas_rect.width, canvas_rect.height, false);
    renderer.shadowMap.enabled = true;

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.damping = 0.2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.target.set(0, 0, 0);

    // If not using render loop, render on changes
    // controls.addEventListener( 'change', render);
    // window.addEventListener('resize', render);

    renderer.render(scene, camera);

    // Render single frame
    function render() {
        renderer.render(scene, camera);
    }

    // Render loop
    function loop() {
        requestAnimationFrame(loop);
        controls.update();
        renderer.render(scene, camera);
      }
    loop();

    window.addEventListener("resize", onWindowResize());
    function onWindowResize() {
        let canvas_rect = canvas.getBoundingClientRect();
        console.log(canvas_rect);
        camera.aspect = canvas_rect.width / canvas_rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas_rect.width, canvas_rect.height, false);
    }

    const gui = new GUI({
        title: "Settings",
        container: container,
        injectStyles: false,
        closeFolders: true,
      });
    const params = {
         Material: "earth1k",
         rotate: true,
         emissiveIntensity: 0,
         emissiveColor: 0xffcd75,
         specularColor: 0xfbf9c1,
         displacementScale: 1,
         bumpScale: 1,
    }
    gui.add(params, "Material", earth_materials)
        .onChange(material => {sphere.material = material});

    gui.add(params, 'rotate')   
    .onChange(value => {controls.autoRotate = value});

    gui.add(params, 'emissiveIntensity', 0, 10)   
        .onChange(value => {sphere.material.emissiveIntensity = value});
    
    gui.add(params, 'displacementScale', 0, 10)   
        .onChange(value => {sphere.material.displacementScale = value});
    
    gui.add(params, 'bumpScale', 0, 10)   
        .onChange(value => {sphere.material.bumpScale = value});

    gui.addColor(params, 'emissiveColor')
        .onChange(color => {sphere.material.emissive = new THREE.Color(color)});

    gui.addColor(params, 'specularColor')
        .onChange(color => {sphere.material.specular = new THREE.Color(color)});


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

customElements.define("sphere-viewer", SphereViewer);