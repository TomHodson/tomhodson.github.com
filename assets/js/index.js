function toggle_summary_by_class(element, topic) {
    details = document.querySelectorAll(`details.${topic}`);

    if(element.textContent === "Expand all") {
        element.textContent = "Collapse all";
        details.forEach(e => e.open = true);
    } else {
        element.textContent = "Expand all"
        details.forEach(e => e.open = false);
    }
       
}

// This signals to css that we have support for web components
// Allows us to set elements to act as fallbacks when js/web components are disabled.
if (window.customElements) {
    document.querySelector('body').classList.add('has-wc');
}