const icon_container = document.querySelector(".icon-container");
const inline_viewer = document.querySelector("outline-model-viewer");
const canvas = inline_viewer.component.canvas;
const header = document.querySelector("section.header");

if (inline_viewer) {
  let last_scroll_pos = 0;
  let mode = "inline";
  let { controls, composer } = inline_viewer.component;
  let margin = 50; // in pixels
  let original = {};

  header.classList.add("sticky");

  const onscroll = () => {
    const delta =
      icon_container.getBoundingClientRect().bottom -
      inline_viewer.getBoundingClientRect().bottom;

    if (mode === "inline" && delta > margin) {
      console.log("moving to icon container");
      icon_container.appendChild(canvas);
      mode = "icon";

      original.autoRotate = controls.autoRotate;
      controls.autoRotate = true;
      inline_viewer.updateEdgeThickness(0.5);
    }

    if (mode === "icon" && delta > 2 * margin) {
      if (!canvas.classList.contains("revealed")) {
        console.log("Adding revealed class");
        canvas.classList.add("revealed");
      }
    }

    if (mode === "icon" && delta < 0) {
      console.log("moving to main content");
      inline_viewer.component.container.insertBefore(
        canvas,
        inline_viewer.component.gui.domElement
      );
      controls.autoRotate = original.autoRotate;
      mode = "inline";
      //   inline_viewer.onWindowResize();
      inline_viewer.updateEdgeThickness(1);
      canvas.classList.remove("revealed");
    }

    if (mode === "icon" && delta < 2 * margin) {
      canvas.classList.remove("revealed");
    }

    if (mode == "icon") {
      const delta = (window.scrollY - last_scroll_pos) / 30;
      if (Math.abs(delta) > 0.1) {
        controls.update(delta);
        composer.render();
        last_scroll_pos = window.scrollY;
      }
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
}
