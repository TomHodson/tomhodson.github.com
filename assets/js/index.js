function toggle_summary_by_class(element, topic) {
  details = document.querySelectorAll(`details.${topic}`);

  if (element.textContent === "Expand all") {
    element.textContent = "Collapse all";
    details.forEach((e) => (e.open = true));
  } else {
    element.textContent = "Expand all";
    details.forEach((e) => (e.open = false));
  }
}

// Signal that we have JS enabled
document.documentElement.classList.remove("no-js");

// This signals to css that we have support for web components
// Allows us to set elements to act as fallbacks when js/web components are disabled.
if (window.customElements) {
  document.querySelector("body").classList.add("has-wc");
}

// run the night mode toggle
const STORAGE_KEY = "user-color-scheme";
const COLOR_MODE_KEY = "--color-mode";

const modeToggleButton = document.querySelector(".js-mode-toggle");
const modeStatusElement = document.querySelector(".js-mode-status");

const getCSSCustomProp = (propKey) => {
  let response = getComputedStyle(document.documentElement).getPropertyValue(
    propKey
  );

  if (response.length) {
    response = response.replace(/\"/g, "").trim();
  }

  return response;
};

const applySetting = (passedSetting) => {
  let currentSetting = passedSetting || localStorage.getItem(STORAGE_KEY);

  if (currentSetting) {
    document.documentElement.setAttribute(
      "data-user-color-scheme",
      currentSetting
    );
  }
};

const toggleSetting = () => {
  let currentSetting = localStorage.getItem(STORAGE_KEY);

  switch (currentSetting) {
    case null:
      currentSetting =
        getCSSCustomProp(COLOR_MODE_KEY) === "dark" ? "light" : "dark";
      break;
    case "light":
      currentSetting = "dark";
      break;
    case "dark":
      currentSetting = "light";
      break;
  }

  localStorage.setItem(STORAGE_KEY, currentSetting);

  return currentSetting;
};

modeToggleButton.addEventListener("click", (evt) => {
  evt.preventDefault();

  applySetting(toggleSetting());
});

applySetting();
