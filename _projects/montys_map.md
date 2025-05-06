---
title: Monty's Map
layout: project
excerpt: Maybe the best birthday gift I've ever given or will ever give. A custom, one off, OS style foldable map for a friend.
permalink: /projects/montys_map
assets: /assets/projects/montys_map
date: 2023-11-23
draft: false

img:
  alt:
  class: invertable
  src: /assets/projects/montys_map/thumbnail.jpg

social_image: /assets/projects/montys_map/gifting.jpg

head: |
  <link rel="stylesheet" href="/assets/js/leaflet/leaflet.css" />
  <script src="/assets/js/leaflet/leaflet.js"></script>
---

A friend of mine makes maps and offered to get a one-off printed and folded OS style, I hatched a plan.

Not being a map or geo person I decided to cheat a bit and do it by layering tiles intended for web maps. I scraped tiles from OSM maps being careful to cache the tiles and to only download a reasonable amount at a reasonable rate. I also pulled the strava running heatmap which I'm obsessed with. All those hidden little paths!

I stuck a legend with a personal message on the rightmost fold and had my birthday map!

<figure>
<img src="/assets/images/2024/montys_map.jpg">
</figure>

<figure id="map" style="width:100%; height:500px;"></figure>

Here's a small web viewer for the same data that lets you toggle different layers. I've only got the tiles for zoom level 15 so I've disabled the ability to zoom out too much to save your poor computer trying to load to many tiles into memory at once. You can zoom into level 17 to see a bit what it looks like when you lean really close and squint on the printed version.

<script>
    let map = L.map("map", {
    attributionControl: false,
    zoomControl: false,
    }).setView([53.36895547, -1.5417251], 13);

    const options = {
    minNativeZoom: 15,
    maxNativeZoom: 15,
    minZoom: 14,
    maxZoom: 17,
    };

    const base_maps = {};

    const base = "/assets/projects/montys_map/tiles";
    const layers = {
    // "Stamen Toner Background": L.tileLayer(
    //     `${base}/stamen_toner_background/{z}/{x}/{y}.png`,
    //     options
    // ),
    "Open Topo Maps": L.tileLayer(
        `${base}/open_topo_map/{z}/{x}/{y}.png`,
        options
    ).addTo(map),
    Strava: L.tileLayer(`${base}/strava/{z}/{x}/{y}.png`, options).addTo(
        map
    ),
    // "Stamen Toner Lines": L.tileLayer(
    //     `${base}/stamen_toner_lines/{z}/{x}/{y}.png`,
    //     options
    // ),
    "Stamen Labels": L.tileLayer(
        `${base}/stamen_toner_labels/{z}/{x}/{y}.png`,
        options
    ).addTo(map),
    Cycling: L.tileLayer(
        `${base}/waymarked_cycling/{z}/{x}/{y}.png`,
        options
    ).addTo(map),
    Hiking: L.tileLayer(
        `${base}/waymarked_hiking/{z}/{x}/{y}.png`,
        options
    ).addTo(map),
    };

    map.addLayer(layers["Strava"]);
    let layerControl = L.control.layers(base_maps, layers).addTo(map);
</script>

I find it fascinating to spot places where people walk or run that aren't marked on the normal map. Interesting places included a lake where people definitely aren't allowed to swim or kayak that nevertheless has a lot of activity on it! Strange patches where lines fan out and then come together at defined points (can you guess why?), and areas where the lines just completely scatter which I guess are grassy fields where people can walk any way they like. Which is more rare than you'd imagine!
