---
title: Edgeland Reveries
layout: post
excerpt: "A Nice Bike Ride around London"
assets: /assets/blog/edgeland_reveries
draft: true
exclude_from_rss: true

image: /assets/blog/maps/tests.jpeg
alt: Small 10cm x 10cm test lasercut maps, one is a bit too light.
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
crossorigin=""></script>

<script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js'></script>
<link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />

<style>
    /* .os_maps {
    filter: grayscale(1) contrast(1.1);
    } */
</style>

<div id="map" style="height:400px; width:100%; margin-top: 1em;"></div>


<script>
    let os_maps = L.tileLayer(`https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=paglUJQl74h39APJmOFJ`,{ //style URL
    crossOrigin: true,
    className: 'os_maps'
    });
    let os_multi_scale = L.tileLayer(`https://api.maptiler.com/tiles/uk-osgb1888/{z}/{x}/{y}?key=paglUJQl74h39APJmOFJ`,{ //style URL
    crossOrigin: true,
    className: 'os_maps'
    });
    let os_maps_2 = L.tileLayer("https://api.maptiler.com/tiles/uk-osgb1888/{z}/{x}/{y}?key=paglUJQl74h39APJmOFJ",{ //style URL
    crossOrigin: true,
    className: 'os_maps'
    });
    let hills = L.tileLayer("https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=paglUJQl74h39APJmOFJ",{ //style URL
    crossOrigin: true,
    className: 'os_maps'
    });

    let os_london = L.tileLayer("https://api.maptiler.com/tiles/uk-oslondon1k1893/{z}/{x}/{y}.jpg?key=paglUJQl74h39APJmOFJ",{ //style URL
    crossOrigin: true,
    className: 'os_maps'
    });

    let osm_maps = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")

    

    const baseMaps = {
    "Open Street Maps": osm_maps,
    "OS Maps Multi Scale" : os_multi_scale,
    "OS Maps": os_maps,
    "OS Maps Hills": os_maps_2,
    "Hills" : hills,
    "OS Maps London" : os_london,
    };

    let map = L.map('map', {attributionControl: false, zoomControl: false, fullscreenControl: true,}).setView({'lat': 51.555514883267996, 'lng': -0.07930755615234376}, 12);
    
    map.addLayer(os_multi_scale);   
    let layerControl = L.control.layers(baseMaps).addTo(map);
    
    async function add_geojson() {
        let resp = await fetch("{{page.assets}}/tracks.geojson");
        let data = await resp.json();
        let g = L.geoJSON(data)
        g.addTo(map);
        map.fitBounds(g.getBounds());
    }

    add_geojson();

</script>
