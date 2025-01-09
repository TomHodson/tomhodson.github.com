// run the night mode toggle
const STORAGE_KEY = "user-color-scheme";
const COLOR_MODE_KEY = "--color-mode";

const getCSSCustomProp = (propKey) => {
  let response = getComputedStyle(document.documentElement).getPropertyValue(
    propKey
  );

  if (response.length) {
    response = response.replace(/\"/g, "").trim();
  }

  return response;
};

const applySetting = () => {
  let currentSetting =
    localStorage.getItem(STORAGE_KEY) || getCSSCustomProp(COLOR_MODE_KEY);

  if (currentSetting) {
    document.documentElement.setAttribute(
      "data-user-color-scheme",
      currentSetting
    );
  }
  console.log(
    `Mode Preference set on document.documentElement.getAttribute("data-user-color-scheme"): ${currentSetting}`
  );
};

let localStorageSetting = localStorage.getItem(STORAGE_KEY);
let defaultValue = getCSSCustomProp(COLOR_MODE_KEY);

if (localStorageSetting) {
  console.log(
    `Night mode setting found in localStorage: ${localStorageSetting}`
  );
} else {
  console.log(
    `Night mode setting not found in localStorage. Set to value from css --color-mode key: ${defaultValue}`
  );
}

applySetting();
