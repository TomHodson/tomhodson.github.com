---
title: Toni's Map
layout: project
excerpt: A going away present for my friend Toni.
permalink: /projects/tonis-map/
assets: /assets/blog/maps/icons
img:
  src: /assets/projects/tonis_map/thumbnail.png
  class: invertable
  alt: A black and white lineart map of London.
date: 2023-09-06

social_image: /assets/projects/tonis_map/thumbnail.png
head: |
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""/>
  <!-- Make sure you put this AFTER Leaflet's CSS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
  crossorigin=""></script>
  <script src="https://unpkg.com/leaflet-simple-map-screenshoter"></script>
  <script src="https://unpkg.com/file-saver/dist/FileSaver.js"></script>
  <script src="/assets/js/domtoimage.min.js"></script>
---

A last minute leaving gift idea for a friend inspired me to finish my first actual laser cut map. I used leaflet.js to overlay the names of some places we had visited together in London onto those nice Stamen Design map tiles from before.

It was mostly made to be laser etched but you can see a crude web version here:

<div id="map"></div>

Now onto the lasing!

<figure>
<img src="/assets/blog/maps/fresh_off_the_press.jpeg">
<figcaption>
This is what it looks like straight off the laser cutter. The contrast is super washed out because the smoke from the cutting process darkens all the surrounding wood.
</figcaption>
</figure>

I had a bunch of issues with getting that to work mostly based around the fact that these tiles are raster images that are intended for streaming to a zoomable and panable viewer on a screen. The design tradeoff of the maps don't quite make as much sense when you start transfering them to a static image. I did some hacks to use the tiles intended for a higher zoom level but you can only take that so far before the text starts getting unreadable.

<figure>
<img src="/assets/blog/maps/after_sanding.jpeg">
<figcaption>
To deal with the darkending from the smoke I sand the whole thing back with 80 grit sandpaper on an orbital sander. I did break a few small features off here and there but it's ok! 
</figcaption>
</figure>

I think there is a better approach that involves getting raw OpenStreetMap data and rendering it directly using something like [QGIS and some kind of map style files](https://gis.stackexchange.com/questions/186808/how-to-create-high-quality-map-with-qgis-and-stamen-tiles) but that seems like a whole new deep rabbit hole I'm not ready to fall into just yet.

<figure>
<img src="/assets/blog/maps/the_final_reveal.jpeg">
<figcaption>
The final reveal!
</figcaption>
</figure>

 <style>
    .leaflet-pane {
    filter: grayscale(1) contrast(1.0);
    }

    #map { 
    height: 300px;
    width: 100%;
    }

    .customIcon {
        width: 20px;
        height: 20px;
    }

    div.icon {
        color: black;
        /* background-color: rgba(255, 255, 255, 0.8); */
        text-shadow: 0px 10px 10px white,
                     10px 0px 10px white,
                     0px -10px 10px white,
                     -10px 0px 10px white;
        /* width: 150px;
        height: 150px; */
        font-size: 1em; 
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 50%;
        border-radius: 20%;
        /* border-color: black; */
        
        
    }

 </style>

<script>
    let Stamen_TonerBackground = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}.{ext}', {
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 16,
    zoomOffset: 0,
    ext: 'png',
    });

    // Using detectRetina: false and manually adding @2x is a hack to export the retina tiles directly
    let Stamen_Toner = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}.{ext}', {
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 16,
    ext: 'png',
    className: 'stamen'
    });
    const key = 'paglUJQl74h39APJmOFJ';
    let os_maps = L.tileLayer(`https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}@2x.jpg?key=paglUJQl74h39APJmOFJ`,{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
    });
    let os_multi_scale = L.tileLayer(`https://api.maptiler.com/tiles/uk-osgb1888/{z}/{x}/{y}?key=paglUJQl74h39APJmOFJ`,{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
    });
    let os_maps_2 = L.tileLayer("https://api.maptiler.com/tiles/uk-osgb1888/{z}/{x}/{y}?key=paglUJQl74h39APJmOFJ",{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
    });
    let hills = L.tileLayer("https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=paglUJQl74h39APJmOFJ",{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
    });

    let os_london = L.tileLayer("https://api.maptiler.com/tiles/uk-oslondon1k1893/{z}/{x}/{y}.jpg?key=paglUJQl74h39APJmOFJ",{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
    });



    var baseMaps = {
    "Stamen Toner": Stamen_TonerBackground,
    "Stamen Toner Labelled" : Stamen_Toner,
    "OS Maps Multi Scale" : os_multi_scale,
    "OS Maps": os_maps,
    "OS Maps Hills": os_maps_2,
    "Hills" : hills,
    "OS Maps London" : os_london,
    };


    let pluginOptions = {
        cropImageByInnerWH: true, // crop blank opacity from image borders
        hidden: false, // hide screen icon
        preventDownload: false, // prevent download on button click
        domtoimageOptions: {}, // see options for dom-to-image
        position: 'topleft', // position of take screen icon
        screenName: 'screen', // string or function
        // iconUrl: ICON_SVG_BASE64, // screen btn icon base64 or url
        hideElementsWithSelectors: ['.leaflet-control-container'], // by default hide map controls All els must be child of _map._container
        mimeType: 'image/svg', // used if format == image,
        caption: null, // string or function, added caption to bottom of screen
        captionFontSize: 15,
        captionFont: 'Arial',
        captionColor: 'black',
        captionBgColor: 'white',
        captionOffset: 5,
    }

    let map = L.map('map', {
        // zoomSnap: 0.1,
    })
    map.addLayer(Stamen_Toner);

    let simpleMapScreenshoter = L.simpleMapScreenshoter(pluginOptions).addTo(map);
    let layerControl = L.control.layers(baseMaps).addTo(map);

    assets =  "/assets/blog/maps/icons"
    places = [
        {ltlng : [51.51995130374973, -0.09422280473133485], name: 'The Barbican!', icon: "heart.svg"},
        {ltlng : [51.55575624506862, -0.08058359767120651], name: 'T+A', icon: "house.svg"},
        {ltlng : [51.56525837288342, -0.05251125889774798], name: 'RARA', icon: "warehouse.svg"},
        {ltlng : [51.52645152178261, -0.06341480189873742], name: 'E&nbsp;Pellicci', icon: "warehouse.svg"},
        {ltlng : [51.520621113485696, -0.1298840925962555], name: 'LSHTM', icon: "warehouse.svg"},
        {ltlng : [51.55137856433745, -0.055549635581998706], name: 'Black Cat', icon: "warehouse.svg"},
        {ltlng : [51.53555650873838, -0.05082052638403943], name: 'Party!', icon: "warehouse.svg"},
        {ltlng : [51.5213208032812, -0.06440122268996837], name: 'Home', icon: "warehouse.svg"},
        {ltlng : [51.52758357786464, -0.056382425792311966], name: 'Bethwall Green', icon: "warehouse.svg"},
        {ltlng : [51.558143000795965, -0.08413768399876369], name: "🍦"},
        {ltlng : [51.53561093730289, -0.06208617791235625], name: "Market Cafe"}, // From mike
        {ltlng : [51.55164580102093, -0.07479603558247123], name: "Red&nbsp;Hand"}, // From mike
        {ltlng : [51.548807269803135, -0.07664573558247124], name: "Vortex"}, // From mike
        {ltlng : [51.524667799040785, -0.09343089325258623], name: "Monohon"}, // From mike



    ]

    // places.forEach(place =>
    //     L.marker(place.ltlng).addTo(map)
    //     .bindTooltip(place.name,  {
    //         permanent: true,
    //         direction: 'right'
    //     }));

    places.forEach(place =>
        L.marker(place.ltlng, {icon:
            L.divIcon({
                className: 'my-div-icon',
                // html: `<div class="icon"><img class = "customIcon" src = "${assets}/${place.icon}"></img>${place.name}</div>`,
                html: `<div class="icon">${place.name}</div>`,
        })}).addTo(map));


    // const ZoomViewer = L.Control.extend({
    // 	onAdd() {
    // 		const gauge = L.DomUtil.create('div');
    // 		gauge.style.width = '200px';
    // 		gauge.style.background = 'rgba(255,255,255,0.5)';
    // 		gauge.style.textAlign = 'left';
    // 		map.on('zoomstart zoom zoomend', (ev) => {
    // 			gauge.innerHTML = `Zoom level: ${map.getZoom()}`;
    // 		});
    // 		return gauge;
    // 	}
    // });

    // const zoomViewer = (new ZoomViewer()).addTo(map);


    // const center = {lat: 51.53803381685164, lng: -0.09551626866416196};
    // const zoom =
    // map.setView(center, 14.5);

    let bounds = L.latLngBounds()
    bounds.extend([51.494566124726866, -0.16118163403141098]);
    bounds.extend([51.583371925056, -0.018402892484412632]);
    map.fitBounds(bounds);

    map.on('zoomed', function() {
        var newzoom = '' + (2*(mymap.getZoom())) +'px';

        el.getElementsBy .css({'width':newzoom,'height':newzoom});
    });

</script>
