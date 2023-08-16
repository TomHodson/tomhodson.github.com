---
title: Maps
layout: post
excerpt: |
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>
    <figure class="blogroll">
    <div id="map" style="height:300px; width:100%"></div>
    </figure>
    <script>
        let Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
        });

        let map = L.map('map').setView([51.505, -0.09], 13);
        map.addLayer(Stamen_TonerBackground);
        
        </script>
hide_image: true
---

## Made a map by screenshotting leaflet.js

```html
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>
     <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
 integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
 crossorigin=""></script>

 <style>
    #map { 
        height: 4000px; 
        width: 1000px;
    }
 </style>
    
    </head>
    
    <body>
        Hello
        <div id="map"></div>

        <script>
            let Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
            });

            let Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
            });

            let map = L.map('map').setView([51.505, -0.09], 13);
            map.addLayer(Stamen_TonerBackground);
            
             </script>
        
    </body>
</html>
```

## Rendered that in blender to see what it might look like


<figure>
<img src="/assets/blog/maps/render.png">
<figcaption>
A blender render of what it might look like based on a 3D scan of my flat. This took all my very rudimentary new blender skills.
</figcaption>
</figure>

<figure>
<model-viewer src="/assets/blog/maps/bigmap.glb" ar ar-modes="scene-viewer webxr quick-look" camera-controls shadow-intensity="1" exposure="1.08" camera-orbit="30.45deg 63.68deg 27.8m" field-of-view="22.88deg" auto-rotate>
</model-viewer>
<figcaption>
Done with the lidar scanner on an Ipad.
</figcaption>
</figure>

Ideas:
https://github.com/mapbox/leaflet-image
https://github.com/Flexberry/Leaflet.Export
https://github.com/grinat/leaflet-simple-map-screenshoter