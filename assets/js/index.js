

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