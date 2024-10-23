---
title: THREE.js
excerpt: |
    

head: |
    <script async src="/node_modules/es-module-shims/dist/es-module-shims.js"></script>

    <script type="importmap">
    {
        "imports": {
        "three": "https://unpkg.com/three@0.156.1/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.156.1/examples/jsm/"
        }
    }
    </script>
layout: post
hide_image: true # Only use this image for static previews
image: /assets/blog/toothbrush_shelf/spin.gif
alt: A render of a 3D printed shelf sitting above a shaver outlet, it spins slowly. 
---
Other vase generators: https://www.vasedjinn.com/
http://daisyvases.com/
https://threejs.org/examples/webgl_geometry_shapes
want to port code from https://github.com/TomHodson/VaseExtruder

<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

    let mixer;

    // Get background color of the body element
    const body = document.getElementsByTagName("body")[0];
    const style = window.getComputedStyle(body);
    const background_color = style.getPropertyValue("background-color");

    // create the scene and the camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background_color);
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 100;

    const canvas = document.getElementById("threejs");
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, powerPreference: "low-power"});
    renderer.setPixelRatio( window.devicePixelRatio );

    // setup the controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0.5, 0 );
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.load( '/assets/projects/bike_lights/model/untitled.glb', function ( gltf ) {
        const model = gltf.scene;
        console.log(model);

        // traverse the scene and make modifications if necessary
        model.traverse((o) => {
            if (o.isMesh) {
                const flat_material = new THREE.MeshBasicMaterial( {
                    color: 0xffffff,
                    polygonOffset: true,
                    polygonOffsetFactor: 1, // positive value pushes polygon further away
                    polygonOffsetUnits: 1
                } );

                o.material = flat_material;
                scene.add(o);

                // const flat_model = new THREE.LineSegments( o.geometry, flat_material);
                // scene.add(flat_model);

                const thresholdAngle = 10;
                const wireframe_geometry = new THREE.EdgesGeometry(o.geometry, thresholdAngle);
                
                const line = new THREE.LineSegments(wireframe_geometry);
                line.material.color.setHex(0x000000);
                line.scale.set(10,10,10)
                scene.add(line);

                // const line_material = new THREE.LineBasicMaterial( { color: 0x000000 } );
                // const wireframe_model = new THREE.LineSegments( wireframe_geometry, line_material);
                // wireframe_model.scale.set(10,10,10);
                // scene.add(wireframe_model);

            }
        });


        
        // model.position.set( 1, 1, 0 );
        // model.scale.set( 1, 1, 1 );
        // scene.add( model );

        animate();

        // Add listener for window resize.
        window.addEventListener('resize', onWindowResize, false);

    }, undefined, function ( e ) {

        console.error( e );

    } );

    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    function animate() {
        requestAnimationFrame( animate );

        controls.update();
        renderer.render( scene, camera );
    }

    animate();
</script>

<figure>
<canvas id = "threejs" style="width:100%"></canvas>
<figcaption>
Hey look, threeJS!
</figcaption>
</figure>

