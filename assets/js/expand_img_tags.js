function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else {
    console.warn("Fullscreen API not supported on this browser");
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

// Create and style fullscreen overlay container
const fullscreenContainer = document.createElement("div");
fullscreenContainer.style.position = "fixed";
fullscreenContainer.style.top = 0;
fullscreenContainer.style.left = 0;
fullscreenContainer.style.width = "100vw";
fullscreenContainer.style.height = "100vh";
fullscreenContainer.style.background = "rgba(0, 0, 0, 0.95)";
fullscreenContainer.style.display = "flex";
fullscreenContainer.style.alignItems = "center";
fullscreenContainer.style.justifyContent = "center";
fullscreenContainer.style.zIndex = 9999;
fullscreenContainer.style.cursor = "zoom-out";
fullscreenContainer.style.visibility = "hidden";

const fullscreenImage = document.createElement("img");
fullscreenImage.style.maxWidth = "90vw";
fullscreenImage.style.maxHeight = "90vh";
fullscreenImage.style.boxShadow = "0 0 20px rgba(0,0,0,0.8)";
fullscreenContainer.appendChild(fullscreenImage);

document.body.appendChild(fullscreenContainer);

document.querySelectorAll("img").forEach((img) => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => {
    console.log("Image clicked:", img.src);
    fullscreenImage.src = img.src;
    fullscreenContainer.style.visibility = "visible";

    // Only attempt fullscreen if supported
    enterFullscreen(fullscreenContainer);
  });
});

fullscreenContainer.addEventListener("click", () => {
  console.log("Exiting fullscreen");
  fullscreenContainer.style.visibility = "hidden";
  exitFullscreen();
});
