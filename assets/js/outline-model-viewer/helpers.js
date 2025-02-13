import * as THREE from "three";
import GUI from "lil-gui";

export function serialiseCamera(component) {
  const { camera, controls } = component;
  const position = Object.values(camera.position);
  const extractXYZ = ({ _x, _y, _z }) => [_x, _y, _z];
  const rotation = extractXYZ(camera.rotation);
  const fixed = (l) => l.map((x) => parseFloat(x.toPrecision(4)));
  return JSON.stringify({
    type: "perspective",
    fov: camera.fov,
    near: camera.near,
    far: camera.far,
    position: fixed(position),
    rotation: fixed(rotation),
    zoom: camera.zoom,
    target: fixed(Object.values(controls.target)),
  });
}

// Todo alllow isometric camera
export function deserialiseCamera(component) {
  const { canvas, initial_camera_state } = component;
  const aspect = canvas.clientWidth / canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(30, aspect, 0.01, 40);

  if (!initial_camera_state) return;
  if (initial_camera_state.type !== "perspective") return;
  if (initial_camera_state.fov) camera.fov = initial_camera_state.fov;
  if (initial_camera_state.near) camera.near = initial_camera_state.near;
  if (initial_camera_state.far) camera.far = initial_camera_state.far;
  if (initial_camera_state.zoom) camera.zoom = initial_camera_state.zoom;
  if (initial_camera_state.position)
    camera.position.set(...initial_camera_state.position);
  if (initial_camera_state.rotation)
    camera.rotation.set(...initial_camera_state.rotation);

  camera.updateProjectionMatrix();

  return camera;
}

export function deserialiseControls(component) {
  const { controls, initial_camera_state } = component;
  if (initial_camera_state.target && controls.target)
    controls.target.set(...initial_camera_state.target);
}

const saveBlob = (function () {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  return function saveData(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    console.log(url);
    a.href = url;
    a.download = fileName;
    a.click();
  };
})();

function takeScreenshot(component) {
  const { canvas, render } = component;
  render();
  canvas.toBlob((blob) => {
    saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
  });
}

function componentHTML(component_rect) {
  const { height } = component_rect;
  console.log("Height:", height);
  return `
      <div id="container">
      <span id = "clicked-item"></span>
      <button id="fullscreen-btn">⛶</button>
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
          top: 0.2em;
          right: 0.3em;
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
          --height: 3em;
          margin-top: calc(${height}px - var(--height));
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
    .lil-gui.root.closed {
        height: var(--height);
    }

      #container.fullscreen > .lil-gui {
            background-color: rgba(1,1,1, 0.5);
        }
      #container.fullscreen > .lil-gui.closed {
            background-color: unset;
        }

      .lil-gui div.title {
        margin: 0.5em;
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

        #container.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: var(--theme-bg-color);
        }
        
        #container.fullscreen canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        #container.fullscreen .lil-gui.root {
            padding: 0.7em;
            margin-top: 0;
        }

        #container.fullscreen .lil-gui.root > div.title {
            margin: 0
        }

        .common-lil-gui-buttons .children {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            button {
                padding: 0.2em;
            }
        }
      </style>
    `;
}

// Usage const { container, canvas, scene, gui } = setupThreeJS(this);
function setupThreeJS(component) {
  const component_rect = component.getBoundingClientRect();

  //  Create the component HTML
  component.shadow.innerHTML = componentHTML(component_rect);
  component.container = component.shadow.querySelector("div#container");
  component.canvas = component.shadow.querySelector("canvas");
  const canvas_rect = component.canvas.getBoundingClientRect();

  if (component.getAttribute("camera")) {
    component.initial_camera_state = JSON.parse(
      component.getAttribute("camera")
    );
    component.removeAttribute("camera");
  }

  component.camera = deserialiseCamera(component);

  component.scene = new THREE.Scene();

  component.renderer = new THREE.WebGLRenderer({
    canvas: component.canvas,
    alpha: true,
  });

  component.renderer.setPixelRatio(window.devicePixelRatio);
  component.renderer.setSize(canvas_rect.width, canvas_rect.height, false);

  component.gui = new GUI({
    title: "Settings",
    container: component.container,
    injectStyles: true,
    closeFolders: true,
  });

  if ((component.getAttribute("debug") || "closed") !== "open")
    component.gui.close();

  const params = {
    printCamera: () => console.log(serialiseCamera(component)),
    screenshot: () => takeScreenshot(component),
    resetCamera: () => {
      deserialiseCamera(component);
      component.render();
    },
  };

  let buttons = component.gui.addFolder("Actions");
  buttons.open();
  buttons.$title.style.display = "none";
  buttons.domElement.classList.add("common-lil-gui-buttons");
  buttons.add(params, "printCamera").name("Print Viewport State");
  buttons.add(params, "screenshot").name("Take Screenshot");
  buttons.add(params, "resetCamera").name("Reset Viewport");
  component.gui_buttons = buttons;

  component.full_screen = false;
  //   clone of original rect
  component.original_rect = {
    width: component_rect.width,
    height: component_rect.height,
  };

  component.toggleFullScreen = () => {
    if (!component.container.requestFullscreen) {
      console.log("Fullscreen not supported");
      return;
    }
    component.full_screen = !component.full_screen;

    if (component.full_screen) {
      component.container.classList.add("fullscreen");
      component.container.requestFullscreen();
    } else {
      component.container.classList.remove("fullscreen");
      component.canvas.style.height = component.original_rect.height + "px";
      component.canvas.style.width = component.original_rect.width + "px";
      document.exitFullscreen();
    }
    component.onWindowResize();
  };

  const fullScreenButton = component.shadow.querySelector("#fullscreen-btn");
  fullScreenButton.addEventListener("click", component.toggleFullScreen);

  return component;
}

export { componentHTML, setupThreeJS };
