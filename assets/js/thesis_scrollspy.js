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
	
});

console.log("Scroll Observer running");