/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
 function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


window.addEventListener('DOMContentLoaded', () => {

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const id = entry.target.getAttribute('id');
            const el = document.querySelector(`nav.page-table-of-contents li a[href="#${id}"]`);
			if (entry.intersectionRatio > 0) {
				el.parentElement.classList.add('active');
			} else {
				el.parentElement.classList.remove('active');
			}
		});
	});

	// Track all sections that have an `id` applied
	document.querySelectorAll('section[id]').forEach((section) => {
		observer.observe(section);
	});

	const svgs = document.querySelectorAll('figure > img[src$="svg"]');

	// svgs.forEach(svg_img_tag => {
	// 	d3.xml(svg_img_tag.getAttribute('src'))
	// 		.then(data => {
	// 			const svg = data.documentElement;
	// 			svg.setAttribute('width', '100%');
	// 			svg.setAttribute('height', 'auto');
				
	// 			d3.select(d3.select(svg_img_tag).node().replaceWith(svg));

	// 			//crop the viewbox of the svgs
	// 			const bbox = svg.getBBox();
	// 			// const bbox = svg.getBoundingClientRect();
	// 			// console.log(bbox, svg);
	// 			const viewBox = [bbox.x, bbox.y, bbox.width + 10, bbox.height + 20].join(" ");
	// 			svg.setAttribute("viewBox", viewBox);
	// 		});
	// });


	// svgs.forEach((el) => {
	// 	const imgID = el.getAttribute('id');
	// 	const imgClass = el.getAttribute('class');
	// 	const imgURL = el.getAttribute('src');
	// 	let object = htmlToElement(`<object data="${imgURL}" type="image/svg+xml" ></object>`)
		

	// 	if (typeof imgID !== 'undefined') {
	// 		object.setAttribute('id', imgID);
	// 	}

	// 	if(typeof imgClass !== 'undefined') {
	// 		object.setAttribute('class', imgClass + ' replaced-svg');
	// 	}

	// 	if(typeof el.getAttribute('style') !== 'undefined') {
	// 		object.setAttribute('style', el.getAttribute('style'));
	// 	}

	// 	el.parentNode.appendChild(object, el);

	// });


	const schematic = document.querySelector("img#fig-fk_schematic") || document.querySelector("img#fig-lrfk_schematic") || document.querySelector("img#fig-ising_model_domain_wall");
	
	if(schematic !== null) {
		d3.xml(schematic.getAttribute('src'))
			.then(data => {
				console.log("got data");
				const svg = data.documentElement;
				svg.setAttribute('width', '100%');
				svg.setAttribute('height', 'auto');
				d3.select(d3.select(schematic).node().replaceWith(data.documentElement));
				
				//redo the bounding box to make it a bit bigger
				const bbox = svg.getBBox();
				const vbox = svg.viewBox.baseVal;;
				// console.log(bbox, svg);
				const viewBox = [bbox.x-10, vbox.y, bbox.width+10, vbox.height].join(" ");
				svg.setAttribute("viewBox", viewBox);
				
				const fermions = d3.select(svg).selectAll(".fermion");
				fermions.on("click", function() {
					d3.select(this)
						.transition()
						.duration(100)
						.style("fill-opacity" , d => {return d3.select(this).style("fill-opacity") === '1' ? 0 : 1});
				}, true)

				const spins = d3.select(svg).selectAll(".spin");
				spins.attr("pointer-events", "all");
				spins.on("click", function() {
					const start = d3.select(this).select("path").style("marker-start");
					const end = d3.select(this).select("path").style("marker-end");
					const direction = (start === "none");
					const url =  direction ? end : start;

					d3.select(this).select("path")
						.transition()
						.duration(100)
						.style("marker-start", () => {return direction ? url : "none"})
						.style("marker-end", () => {return direction ? "none" : url})
				}, true)
			});
	}
	
});

console.log("Scroll Observer running");

