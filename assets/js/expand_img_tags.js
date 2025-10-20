const style = document.createElement("style");
style.textContent = `
  .fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--theme-bg-color);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: zoom-out;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .fullscreen-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  .fullscreen-overlay img {
    object-fit: contain;
    max-width: 100vw;
    max-height: 100vh;
    // width: 100%; important!
    // height: 100%; important!
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  }
`;
document.head.appendChild(style);

const fullscreenContainer = document.createElement("div");
fullscreenContainer.className = "fullscreen-overlay";

const fullscreenImage = document.createElement("img");
fullscreenContainer.appendChild(fullscreenImage);

document.body.appendChild(fullscreenContainer);

document.querySelectorAll("img:not(.no-zoom)").forEach((img) => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => {
    console.log("Image clicked:", img.src);
    fullscreenImage.src = img.src;
    fullscreenImage.classList = img.classList;
    fullscreenContainer.classList.add("active");
  });
});

fullscreenContainer.addEventListener("click", () => {
  fullscreenContainer.classList.remove("active");
});