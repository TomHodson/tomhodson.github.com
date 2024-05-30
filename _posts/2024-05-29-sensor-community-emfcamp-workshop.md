---
title: "Sensor.Community Workshop at EMFcamp"
layout: post
excerpt: Instructions for a workshop I'm running/ran at Electromagnetic Field 2024

image: /assets/blog/emf2024/emf2024-logo-dark.svg
thumbnail: 
assets: /assets/blog/emf2024
alt: 

redirect_from: /emf2024
---
Welcome to the guide for the workshop [Build your own sensor.community air quality monitoring station!](https://www.emfcamp.org/schedule/2024/212-build-your-own-sensor-community-air-quality-monitoring). 

## Obligatory Spiel

Air pollution is a major public health issue but you’d be surprised how few official monitoring stations there are in Europe. That’s an issue because pollution levels can vary a lot even between adjacent streets so to get the best picture possible we need more sensors! This is where citizen lead projects like Sensor.Community are doing amazing things.

In this workshop you’ll put together an air quality monitor made from an ESP8266 and a few sensors, load up the firmware and connect it to the sensor.community network so that other people, scientists and policy makers can see where the problems are and hopefully change something. It will also contribute to this cool [interactive map](https://maps.sensor.community). We’ll discuss options for weather proofing, where to place the sensor and how to hook it into your own smart home setup if you have one. 


## The Kits

The a base kit (£15) contains:

* An ESP8266 Dev board pre-flashed with the [firmware](https://github.com/opendata-stuttgart/sensors-software/tree/master/airrohr-firmware)
* A BME280 Pressure/Temperature/Humidity sensor
* A 2m micro USB cable
* A long F-F header cable (dupont) with 4 wires
* A USB power supply **is not** included, let's try to prevent some e-waste by reusing an old one! 
* There will be a pack of zipties lying around somewhere that you can grab from.

<figure style="width:250px;">
<img src="{{page.assets}}/base_kit.png"/>
<figcaption>
The base kit
</figcaption>
</figure>

The base+addon kit (£40) also contains:
* An SDS011 particulate matter sensor (PM2.5-10)
* A length of black plastic tube to separate the intake of the sensor a bit from the exhaust.
* A short header cable with 4 pairs.

<figure style="width:33%;">
<img src="{{page.assets}}/addon_kit.png"/>
<figcaption>
The addons
</figcaption>
</figure>

## In the workshop
1. Come buy a kit from me
2. [Assemble it](#assembly)
3. [Configure it](#configuration)


### Assembly 
Note: each ESP8266 has a unique chipID. When I flashed the firmware I noted down the chipID on a piece of tape on the back of each board, you need this id for a couple steps in a minute so don't lose it! If you do, you can use the firmware flasher to get it again, you can find links to the firmware flasher on the [official guide](https://sensor.community/en/sensors/airrohr/).

Attach the black plastic tube to the port on the SDS011.
Connect the headers like the image below, use the longer headers for the BME280 and the shorter ones for the SDS011. 
<figure style="width:33%;">
<img src="{{page.assets}}/hookup_guide.jpeg"/>
<figcaption>
Wiring Diagram
</figcaption>
</figure>

We want the input of the SDS011 tube to be close to the BME280, hence the different cables. Don't worry about this too much now, you'll have to think about this when you install it into a permanent position.

<figure>
<img src="{{page.assets}}/assembled.svg"/>
<figcaption>
Should look roughly like this once assembled, though you'll have a black plastic tube too. Note that I've written your ChipID on that piece of plastic protecting the pins, don't lose it!
</figcaption>
</figure>



### Configuration

When it starts up, the firmware searches for any configured wifi networks, when it doesn't find one **it starts up a hotspot called "airRohr-{ChipID}" with password "airrohrcfg".**

Connect to this network, it will likely open the config page in a captive portal but if not go to [192.168.4.1](http://192.168.4.1/).

3. For now let's connect to the [emfcamp wifi](https://www.emfcamp.org/about/internet), SSID: emf2024, username: emf, password: emf should work but if not try SSID: emf2024-open

Optional: If you plan to setup the sensor up temporarily somewhere at EMF, perhaps in your village you can

### Registering with Sensor.Community

## After the workshop

Find a permanent location for the sensor. You'll need some weather proofing and a 5V power source. It's recommended to place the sensor 1-3m above ground level in a well ventilated outdoor area. Basically you're trying to measure the same air we're all breathing. 

Options for weather proofing:
* Use a U bend piece of drain pipe as recommended by the project.
* Browse some of the [many](https://www.yeggi.com/q/airrohr/) 3D printed case designs [online](https://www.yeggi.com/q/sensor+community/).


See an issue on this page? [Open a PR!](https://github.com/TomHodson/tomhodson.github.com/edit/main/_posts/2024-05-29-sensor-community-emfcamp-workshop.md)