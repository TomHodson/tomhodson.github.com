// Add this style block once to your document (or in a CSS file)
const style = document.createElement("style");
style.textContent = `
  .fullscreen-overlay {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .fullscreen-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
`;
document.head.appendChild(style);

// Create and style fullscreen overlay container
const fullscreenContainer = document.createElement("div");
fullscreenContainer.className = "fullscreen-overlay";
fullscreenContainer.style.position = "fixed";
fullscreenContainer.style.top = 0;
fullscreenContainer.style.left = 0;
fullscreenContainer.style.width = "100vw";
fullscreenContainer.style.height = "100vh";
fullscreenContainer.style.background = "var(--theme-bg-color)";
fullscreenContainer.style.display = "flex";
fullscreenContainer.style.alignItems = "center";
fullscreenContainer.style.justifyContent = "center";
fullscreenContainer.style.zIndex = 9999;
fullscreenContainer.style.cursor = "zoom-out";

const fullscreenImage = document.createElement("img");
fullscreenImage.style.maxWidth = "90vw";
fullscreenImage.style.maxHeight = "90vh";
fullscreenImage.style.boxShadow = "0 0 20px rgba(0,0,0,0.8)";
fullscreenContainer.appendChild(fullscreenImage);

document.body.appendChild(fullscreenContainer);

// Fullscreen API helpers
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

// Attach listeners
document.querySelectorAll("img").forEach((img) => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => {
    console.log("Image clicked:", img.src);
    fullscreenImage.src = img.src;
    fullscreenContainer.classList.add("active");
    enterFullscreen(fullscreenContainer);
  });
});

fullscreenContainer.addEventListener("click", () => {
  console.log("Exiting fullscreen");
  fullscreenContainer.classList.remove("active");
  exitFullscreen();
});
