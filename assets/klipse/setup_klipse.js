const is_light_mode =
  document.documentElement.getAttribute("data-user-color-scheme") == "light";

if (is_light_mode) {
  console.log("Light mode detected, using theme 'jupyter' for klipse");
} else {
  console.log("Dark mode detected, using theme 'dracula' for klipse");
}

window.klipse_settings = {
  selector_pyodide: ".language-python pre", // css selector for the html elements to be klipsified
  scripts_root: "/assets/klipse",
  codemirror_root: "/assets/klipse/codemirror",
  //   no_dynamic_scripts: true,
  codemirror_options_in: {
    theme: is_light_mode ? "jupyter" : "dracula",
    lineWrapping: true,
    lineNumbers: true,
    autoCloseBrackets: true,
  },
  codemirror_options_out: {
    theme: is_light_mode ? "jupyter" : "dracula",
  },
};
