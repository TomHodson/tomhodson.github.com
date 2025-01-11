---
title: Sentinel Cloudless
layout: post
excerpt: Looking at the earth through the eyes of satellites.

image: 
thumbnail: /assets/blog/maps/qgis/thumbnail.jpg
assets: /assets/blog/
alt: 

head: |
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>
     <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
     <script src="/assets/js/leaflet.wmts.browser.min.js"></script> 
    <link rel='stylesheet' href='https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css' />
    <script src='https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js'></script>
    

draft: true
---

{{ jekyll.environment }}

<style>
    .leaflet-container {
        height: 400px;
        width: 600px;
        max-width: 100%;
        max-height: 100%;
    }
</style>


<div id="map"></div>

<script>
	const map = L.map('map').setView([51.505, -0.09], 13);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);


    const map_layers = {
        "Strava Heatmap" : L.tileLayer("http://localhost:8090/strava_blue/{z}/{x}/{y}.png", 
            {
                maxZoom: 15,
            }),
        "Sentinel Cloudless" : L.tileLayer("http://localhost:8091/{z}/{x}/{y}.png", 
            {
                maxZoom: 15,
            })

    }

    let layerControl = L.control.layers(map_layers).addTo(map);

</script>


<div id="map2"></div>
<script>
    const map2 = new maplibregl.Map({
        container: 'map2',
        zoom: 9,
        center: [137.9150899566626, 36.25956997955441],
        style:
            'https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
    });
</script>