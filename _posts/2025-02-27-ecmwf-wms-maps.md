---
title: ECMWF WMS Maps
layout: post
excerpt: A fun little web map data source.

thumbnail: /assets/blog/ecmwf_wms/thumbnail.jpg
social_image: /assets/blog/ecmwf_wms/thumbnail.jpg
image_class: invertable
alt: A map centered on London with a colourful overlay showing weather data.

head: |
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""/>
   <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
   integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
   crossorigin=""></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-timedimension@1.1.1/dist/leaflet.timedimension.control.min.css" />
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iso8601-js-period@0.2.1/iso8601.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/leaflet-timedimension@1.1.1/dist/leaflet.timedimension.min.js"></script>
---

I currently work at [ECMF](https://www.ecmwf.int/) and lately I found out that we make [a WMS service available for some of our data](https://confluence.ecmwf.int/pages/viewpage.action?pageId=473850311). So here's a little web map using this data.

<style>
    .leaflet-container {
        height: 400px;
        width: 600px;
        max-width: 100%;
        max-height: 100%;
    }
    .wms-layer {
        opacity: 0.5! important;
    }
</style>

<div id="map"></div>

<script>
    const layers = [
    {'name': 'z500_field', 'title': '500 hPa geopotential'} ,
{'name': 'z500_public', 'title': '500 hPa geopotential (Public)'} ,
{'name': 't850_public', 'title': '850 hPa temperature (Public)'} ,
{'name': '850ws', 'title': '850 hPa wind speed'} ,
{'name': 'ws850_public', 'title': '850 hPa wind speed (Public)'} ,
{'name': 'composition_aod550', 'title': 'Aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_pol_alder_forecast_surface', 'title': 'Alder pollen (provided by CAMS)'} ,
{'name': 'composition_europe_pol_alder_forecast_surface_eea', 'title': 'Alder pollen (provided by CAMS)'} ,
{'name': 'composition_europe_nh3_forecast_surface', 'title': 'Ammonia (provided by CAMS)'} ,
{'name': 'background', 'title': 'Background'} ,
{'name': 'composition_bbaod550', 'title': 'Biomass burning aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_pol_birch_forecast_surface', 'title': 'Birch pollen (provided by CAMS)'} ,
{'name': 'composition_europe_pol_birch_forecast_surface_eea', 'title': 'Birch pollen (provided by CAMS)'} ,
{'name': 'boundaries', 'title': 'Boundaries'} ,
{'name': 'composition_co2_300hpa', 'title': 'Carbon dioxide at 300 hPa [ ppmv ] (provided by CAMS)'} ,
{'name': 'composition_co2_50hpa', 'title': 'Carbon dioxide at 50 hPa [ ppmv ] (provided by CAMS)'} ,
{'name': 'composition_co2_500hpa', 'title': 'Carbon dioxide at 500 hPa [ ppmv ] (provided by CAMS)'} ,
{'name': 'composition_co2_850hpa', 'title': 'Carbon dioxide at 850 hPa [ ppmv ] (provided by CAMS)'} ,
{'name': 'composition_co2_surface', 'title': 'Carbon dioxide at surface [ ppmv ] (provided by CAMS)'} ,
{'name': 'composition_co2_totalcolumn', 'title': 'Carbon dioxide column-mean molar fraction [ ppmv ] (provided by CAMS)'} ,
{'name': 'composition_europe_co_forecast_surface', 'title': 'Carbon monoxide (provided by CAMS)'} ,
{'name': 'composition_co_300hpa', 'title': 'Carbon monoxide at 300 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co_50hpa', 'title': 'Carbon monoxide at 50 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co_500hpa', 'title': 'Carbon monoxide at 500 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co700', 'title': 'Carbon monoxide at 700 hPa (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co_850hpa', 'title': 'Carbon monoxide at 850 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co_upperlevel', 'title': 'Carbon monoxide at pressure levels (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co_surface', 'title': 'Carbon monoxide at surface [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_uvindex_clearsky_daily_max', 'title': 'Clear sky UV index (provided by CAMS)'} ,
{'name': 'composition_uvindex_clearsky', 'title': 'Clear-sky UV index (provided by CAMS)'} ,
{'name': 'composition_europe_dust_forecast_surface', 'title': 'Dust (provided by CAMS)'} ,
{'name': 'composition_duaod550', 'title': 'Dust aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'z500_mean_public', 'title': 'Ensemble mean for 500 hPa geopotential (Public)'} ,
{'name': 't850_mean_public', 'title': 'Ensemble mean for 850 hPa temperature (Public)'} ,
{'name': 'ws850_mean_public', 'title': 'Ensemble mean for 850 hPa wind speed (Public)'} ,
{'name': 'msl_mean_public', 'title': 'Ensemble mean for mean sea level pressure (Public)'} ,
{'name': 'z500_spread_public', 'title': 'Ensemble spread for 500 hPa geopotential (Public)'} ,
{'name': 't850_spread_public', 'title': 'Ensemble spread for 850 hPa temperature (Public)'} ,
{'name': 'ws850_spread_public', 'title': 'Ensemble spread for 850 hPa wind speed (Public)'} ,
{'name': 'msl_spread', 'title': 'Ensemble spread for mean sea level pressure'} ,
{'name': 'msl_spread_public', 'title': 'Ensemble spread for mean sea level pressure (Public)'} ,
{'name': 'composition_fire', 'title': 'Fire radiative power [W m-2] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'foreground', 'title': 'Foreground'} ,
{'name': 'composition_europe_hcho_forecast_surface', 'title': 'Formaldehyde (provided by CAMS)'} ,
{'name': 'composition_hcho_300hpa', 'title': 'Formaldehyde at 300 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_hcho_50hpa', 'title': 'Formaldehyde at 50 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_hcho_500hpa', 'title': 'Formaldehyde at 500 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_hcho_850hpa', 'title': 'Formaldehyde at 850 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_hcho_surface', 'title': 'Formaldehyde at surface [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_ochcho_forecast_surface', 'title': 'Glyoxal (provided by CAMS)'} ,
{'name': 'composition_europe_pol_grass_forecast_surface', 'title': 'Grass pollen (provided by CAMS)'} ,
{'name': 'composition_europe_pol_grass_forecast_surface_eea', 'title': 'Grass pollen (provided by CAMS)'} ,
{'name': 'grid', 'title': 'Grid'} ,
{'name': 'composition_europe_ec_res_forecast_surface', 'title': 'Ground-level residential elementary carbon (provided by CAMS)'} ,
{'name': 'genesis_hr', 'title': 'Hurricane strike probability'} ,
{'name': 'msl', 'title': 'Mean sea level pressure'} ,
{'name': 'msl_public', 'title': 'Mean sea level pressure (Public)'} ,
{'name': 'composition_ch4_300hpa', 'title': 'Methane at 300 hPa [ ppbv ] (provided by CAMS)'} ,
{'name': 'composition_ch4_50hpa', 'title': 'Methane at 50 hPa [ ppbv ] (provided by CAMS)'} ,
{'name': 'composition_ch4_500hpa', 'title': 'Methane at 500 hPa [ ppbv ] (provided by CAMS)'} ,
{'name': 'composition_ch4_850hpa', 'title': 'Methane at 850 hPa [ ppbv ] (provided by CAMS)'} ,
{'name': 'composition_ch4_surface', 'title': 'Methane at surface [ ppbv ] (provided by CAMS)'} ,
{'name': 'composition_ch4_totalcolumn', 'title': 'Methane column-mean molar fraction [ ppbv ] (provided by CAMS)'} ,
{'name': 'composition_europe_pol_mugwort_forecast_surface', 'title': 'Mugwort pollen (provided by CAMS)'} ,
{'name': 'composition_europe_pol_mugwort_forecast_surface_eea', 'title': 'Mugwort pollen (provided by CAMS)'} ,
{'name': 'named_cyclones', 'title': 'Named cyclones (Name and positions only)'} ,
{'name': 'named_cyclones_tracks', 'title': 'Named cyclones tracks'} ,
{'name': 'composition_europe_no2_forecast_surface', 'title': 'Nitrogen dioxide (provided by CAMS)'} ,
{'name': 'composition_no2_300hpa', 'title': 'Nitrogen dioxide at 300 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_no2_50hpa', 'title': 'Nitrogen dioxide at 50 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_no2_500hpa', 'title': 'Nitrogen dioxide at 500 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_no2_850hpa', 'title': 'Nitrogen dioxide at 850 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_no2_surface', 'title': 'Nitrogen dioxide at surface [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_no2_analysis_surface', 'title': 'Nitrogen dioxide at surface [ug/m3] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_no_forecast_surface', 'title': 'Nitrogen monoxide (provided by CAMS)'} ,
{'name': 'composition_europe_nmvoc_forecast_surface', 'title': 'Non methane vocs (provided by CAMS)'} ,
{'name': 'composition_europe_pol_olive_forecast_surface', 'title': 'Olive pollen (provided by CAMS)'} ,
{'name': 'composition_europe_pol_olive_forecast_surface_eea', 'title': 'Olive pollen (provided by CAMS)'} ,
{'name': 'composition_europe_o3_forecast_surface', 'title': 'Ozone (provided by CAMS)'} ,
{'name': 'composition_o3_300hpa', 'title': 'Ozone at 300 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_o3_50hpa', 'title': 'Ozone at 50 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_o3_500hpa', 'title': 'Ozone at 500 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_o3_850hpa', 'title': 'Ozone at 850 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_o3sfc', 'title': 'Ozone at surface (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_o3_surface', 'title': 'Ozone at surface [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_o3_analysis_surface', 'title': 'Ozone at surface [Î¼g/m3] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_pm10', 'title': 'PM10 - coarse particulate matter [ug / m3] (provided by CAMS)'} ,
{'name': 'composition_pm2p5', 'title': 'PM2.5 - fine particulate matter [ug / m3] (provided by CAMS)'} ,
{'name': 'composition_europe_pm10_analysis_surface', 'title': 'Particulate matter < 10 Î¼m [Î¼g/m3] (provided by CAMS)'} ,
{'name': 'composition_europe_pm2p5_analysis_surface', 'title': 'Particulate matter < 2.5 Î¼m [Î¼g/m3] (provided by CAMS)'} ,
{'name': 'composition_europe_pans_forecast_surface', 'title': 'Peroxyacyl nitrates (provided by CAMS)'} ,
{'name': 'composition_europe_pm10_forecast_surface', 'title': 'Pm10 (provided by CAMS)'} ,
{'name': 'composition_europe_pm_ss_forecast_surface', 'title': 'Pm10 sea salt dry (provided by CAMS)'} ,
{'name': 'composition_europe_pm_wf_forecast_surface', 'title': 'Pm10 wildfires (provided by CAMS)'} ,
{'name': 'composition_europe_pm2p5_forecast_surface', 'title': 'Pm2.5 (provided by CAMS)'} ,
{'name': 'composition_europe_ec_ff_forecast_surface', 'title': 'Pm2.5 anthropogenic fossil fuel carbon at surface [ug/m3] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_ec_wb_forecast_surface', 'title': 'Pm2.5 anthropogenic wood burning carbon at surface [ug/m3] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_pm_om_forecast_surface', 'title': 'Pm2.5 total organic matter (provided by CAMS)'} ,
{'name': 'composition_europe_pol_ragw_forecast_surface', 'title': 'Ragweed pollen (provided by CAMS)'} ,
{'name': 'composition_europe_pol_ragw_forecast_surface_eea', 'title': 'Ragweed pollen (provided by CAMS)'} ,
{'name': 'composition_europe_ec_resid_forecast_surface', 'title': 'Residential elementary carbon (provided by CAMS)'} ,
{'name': 'rivers', 'title': 'Rivers and lakes'} ,
{'name': 'composition_ssaod550', 'title': 'Sea salt aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_sia_forecast_surface', 'title': 'Secondary inorganic aerosol (provided by CAMS)'} ,
{'name': 'composition_suaod550', 'title': 'Sulphate aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_so2_forecast_surface', 'title': 'Sulphur dioxide (provided by CAMS)'} ,
{'name': 'composition_so2_300hpa', 'title': 'Sulphur dioxide at 300 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_so2_50hpa', 'title': 'Sulphur dioxide at 50 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_so2_500hpa', 'title': 'Sulphur dioxide at 500 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_so2_850hpa', 'title': 'Sulphur dioxide at 850 hPa [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_so2_surface', 'title': 'Sulphur dioxide at surface [ppbv] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_co_totalcolumn', 'title': 'Total column of carbon monoxide [10^18 molecules / cm2] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_hcho_totalcolumn', 'title': 'Total column of formaldehyde [10^15 molecules / cm2] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_no2_totalcolumn', 'title': 'Total column of nitrogen dioxide [10^15 molecules / cm2] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_o3_totalcolumn', 'title': 'Total column of ozone [DU] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_so2_totalcolumn', 'title': 'Total column of sulphur dioxide [10^15 molecules / cm2] (provided by CAMS, the Copernicus Atmosphere Monitoring Service)'} ,
{'name': 'composition_europe_ec_total_forecast_surface', 'title': 'Total elementary carbon (provided by CAMS)'} ,
{'name': 'composition_uvindex_daily_max', 'title': 'Total sky UV index (provided by CAMS)'} ,
{'name': 'genesis_td', 'title': 'Tropical cyclone strike probability'} ,
{'name': 'genesis_ts', 'title': 'Tropical storm strike probability'} ,
{'name': 'composition_uvindex', 'title': 'UV index (provided by CAMS)'} ,
    ]

	const map = L.map('map',
        {
        timeDimension: true,
        timeDimensionOptions: {
            timeInterval: "2025-01-01/2025-02-27",
            period: "PT3H"
        },
        timeDimensionControl: true,
    }).setView([51.505, -0.09], 3,);

    const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data: © OpenStreetMap contributors, ECMWF Weather Data',
    }).addTo(map);

    const leaflet_layers = layers.reduce((acc, layer) => {
        const wms_layer = L.tileLayer.wms('https://eccharts.ecmwf.int/wms/?', {
            // token: '___insert_ecmwf_api_key_here___',
            token: "public",
            format: 'image/png',
            crs: L.CRS.EPSG3857,
            layers: layer.name.slice(0, 30),
            // style: layer.name,
            transparent: true,
            className: 'wms-layer',
            time: "2025-02-26T00:00:00.000Z",
        });
        const time_wms_layer = L.timeDimension.layer.wms(wms_layer);
        acc[layer.title] = time_wms_layer;
        return acc;
    }, {});

    leaflet_layers["Aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)"].addTo(map);
    leaflet_layers["Mean sea level pressure (Public)"].addTo(map);
    let layerControl = L.control.layers({"open topomap" : openTopoMap}, leaflet_layers).addTo(map);

</script>

This is just a quick demo to see how it works but to make something more featured you'd need to handle things like passing the correct times and other variables to each layer and how to surface that in the UI.

Here's a bit of code to iterate through the layers returned by the WMS `GetCapabilities` endpoint so you can see what's available. Here I'm using `token=public` but you can substitute that for an ECMWF API key to possiblity get more layers. You can also in principle open this in things like QGIS but I struggled to get it to work well with the time dimension.

```python
import xmltodict
r = requests.get("https://eccharts.ecmwf.int/wms/?token=public&request=GetCapabilities&version=1.3.0")
t = xmltodict.parse(r.text)
layers = t['WMS_Capabilities']['Capability']['Layer']["Layer"]

print("Layer keys: ", layers[0].keys())

def handle_dimension(ds):
    if not isinstance(ds, list): ds = [ds]
    return [d["@name"] for d in ds]

for layer in layers:
    info = dict(
        name=layer["Name"],
        title = layer["Title"],
        dimensions = handle_dimension(layer["Dimension"]) if "Dimension" in layer else None,
    )
    print(f"{info},")
```

which prints something like:

```json
{'name': 'z500_field', 'title': '500 hPa geopotential', 'dimensions': ['time']},
{'name': 'ws850_public', 'title': '850 hPa wind speed (Public)', 'dimensions': ['time']},
{'name': 'composition_aod550', 'title': 'Aerosol optical depth at 550 nm (provided by CAMS, the Copernicus Atmosphere Monitoring Service)', 'dimensions': ['time']},
{'name': 'composition_europe_pol_alder_forecast_surface', 'title': 'Alder pollen (provided by CAMS)', 'dimensions': ['time', 'originating_centre', 'stream', 'type', 'level']},
{'name': 'composition_europe_nh3_forecast_surface', 'title': 'Ammonia (provided by CAMS)', 'dimensions': ['time', 'originating_centre', 'stream', 'type', 'level']},
...
```

Some of the the layers are only produced at certain times and I haven't written any code to handle that properly it you see empty layers that's likely the cause. You can see there are also other dimensions like `['time', 'originating_centre', 'stream', 'type', 'level']` that you can add.
