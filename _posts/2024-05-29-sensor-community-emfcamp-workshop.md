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
Welcome to the guide for the workshop [Build your own Sensor.Community air quality monitoring station!](https://www.emfcamp.org/schedule/2024/212-build-your-own-sensor-community-air-quality-monitoring)

See an issue on this page? [Open a PR!](https://github.com/TomHodson/tomhodson.github.com/edit/main/_posts/2024-05-29-sensor-community-emfcamp-workshop.md)

## Obligatory Spiel

Air pollution is a major public health issue but you’d be surprised how few official monitoring stations there are in Europe. That’s an issue because pollution levels can vary a lot, even from one street to the next! 

To get the best picture possible we need more sensors which is where citizen lead projects like Sensor.Community are having a lot of success!

<section class = "note">
Sensor.Community started life as "Luftdaten" in Stuttgart, Germany. It rebranded but you will occasionally see references to "luftdaten" and "airrhor" in the docs and firmware. These are also useful alternate keywords to try when searching for information on the project.
</section>

In this workshop you’ll put together an air quality monitor made from an ESP8266 and a few sensors, load up the Sensor.Community firmware and connect it to their network so that other people, scientists and policy makers can see where the problems are and hopefully change something. It will also contribute to this cool [interactive map](https://maps.sensor.community). We’ll discuss options for weather proofing, where to place the sensor and how to hook it into your own smart home setup if you have one. 


## The Kits

The base kit (£15) contains:

* An ESP8266 Dev board pre-flashed with the [firmware](https://github.com/opendata-stuttgart/sensors-software/tree/master/airrohr-firmware)
* A BME280 Pressure/Temperature/Humidity sensor
* A 2m micro USB cable
* A long F-F header cable (dupont) with 4 wires
* A USB power supply **is not** included, let's try to prevent some e-waste by reusing an old one! 
* There will be a pack of zip ties lying around somewhere that you can grab from

<figure style="width:max(300px, 33%);">
<img src="{{page.assets}}/base_kit.png"/>
<figcaption>
The base kit
</figcaption>
</figure>

The base+addon kit (£40) also contains:
* An SDS011 particulate matter sensor (PM2.5-10)
* A length of black plastic tube to separate the intake of the sensor a bit from the exhaust
* A short header cable with 4 pairs

<figure style="width:max(300px, 33%);">
<img src="{{page.assets}}/addon_kit.png"/>
<figcaption>
The addon kit: an SDS011, a length of black tube and, not shown, a short length of f-f header cable with 4 conductors.
</figcaption>
</figure>

## In the workshop
1. Come buy a kit from me, either exact change or contactless.
2. [Assemble it](#assembly)
3. [Configure it](#configuration)


### Assembly 

Attach the black plastic tube to the port on the SDS011.

If your BME280 is unsoldered, solder the 4 pin header on now. If you can't find a soldering iron, you can always skip this step for now and do it later, the kit will still work with just the SDS011 or even no sensors attached.

<section class="note" markdown=1>
Each ESP8266 has a unique chipID, similar to a MAC address. When I flashed the firmware I noted down the chipID on a piece of tape on the back of each board, you need this id for a couple steps in a minute so don't lose it! If you do, you can use the firmware flasher to find it again. There are links to the firmware flasher binaries on the [official guide](https://sensor.community/en/sensors/airrohr/).
</section>

Connect the headers up using the wiring diagram below, use the longer headers for the BME280 and the shorter ones for the SDS011. 
<figure style="width:max(300px, 33%);">
<img src="{{page.assets}}/hookup_guide.jpeg"/>
<figcaption>
Wiring Diagram
</figcaption>
</figure>

We want the input of the SDS011 tube to be close to the BME280, hence the different cables. Don't worry about this too much now, but try to do this when you install it into a permanent position.

<figure>
<img src="{{page.assets}}/assembled.svg"/>
<figcaption>
It should look roughly like this once assembled, though you'll have a black plastic tube too. Note that I've written your ChipID on that piece of plastic protecting the pins, don't lose it!
</figcaption>
</figure>

Done! If you were doing this at home, you would have also needed to install the firmware but I did that step for you to save time in the workshop. 

Now plug the sensor in. When it starts up, the firmware searches for any configured wifi networks it knows about, which initially is none. When it doesn't find one **it starts up a hotspot called "airRohr-{ChipID}" with password "airrohrcfg".**

Once you see the "airRohr-{Your ChipID} network you're done and can move onto the configuration. There is a chance that 30 wifi hotspots all starting up in the same location might cause some issues so be patient if you don't immediately see the new network.

### Configuration

Connect to this network on a device, it will likely open the config page in a captive portal for you but if it doesn't (depends on the device) go to [192.168.4.1](http://192.168.4.1/).

While you're at EMF, let's connect the sensor to the [emfcamp wifi](https://www.emfcamp.org/about/internet)
```
SSID: emf2024
Username: emf
Password: emf
```
If that doesn't work the open network with SSID emf2024-open.

In the More settings tab you can change the interval at which measurements are taken. For radio spectrum politeness at EMF it would also be good to shorten the "Duration router mode", this reduces how long the sensor broadcasts a hotpot for if it can't find a network.

In "sensors" you can configure which sensors are connected, which for this workshop will be one of SDS011 and BME280 or both.

### Registering with Sensor.Community

Whether you intend to run the sensor out of your tent or village at the EMF (which I encourage!) or wait until you get home to install it in a more permanent location, the next step is registration. You'll need to provide some details about the location of the sensor so wait until you've installed it in somewhere, at least semi-permanently.

Go to [devices.sensor.community](https://devices.sensor.community/) and start by making an account. Once you receive the email you confirm your account and can go ahead with registering the sensor.

Once you've registerd the sensor, its the data will start appearing on [the map!](https://maps.sensor.community).

<!-- ### Optional: EMF collective project 

I think it would be really cool to set up a micro monitoring network just for EMF. Hopefully by the time you read this I will have set up a raspberry pi on the emf network to act as a local hub. If you'd like to participate here's what you can do:

1. Set up your new air quality station somewhere you can leave it on the whole time you're at EMF, you'll have to be creative here. When you're ready [email me](mailto:thomas.c.hodson@gmail.com):
    * A picture of the setup (out of interest and so I can see what effect different setups have)
    * Your ChipID, I'll keep this secret.
    * An accurate gps (lat,lon) pair for the sensor. You can right click in the [offical map](https://map.emfcamp.org/) to get this. 

    <section class="note" markdown=1>
    I will make all the sensor readings, pictures and GPS coordinates from this experiment public. I will not make the chipIDs or association between chipIDs and coordinates public. You are, in no way, obligated to take part in this bit!
    </section>

2. Configure the sensor to push data to the raspberry pi in addition to the other networks. In the APIs tab, tick "Send data to custom API" and put this in:

```
Server: TBD
Path: /sensors/push
Port: 5000
User: leave blank
Password: leave blank
```

You're now pushing data to a tiny hyper local air quality monitoring network. I will put an endpoint (TBD) where you can pull the sensor readings and their associated gps coordinates so hopefully we can make a nice real time map of air pollution on the EMF site!

<figure style="width:max(300px, 33%);">
<img src="{{page.assets}}/map.png"/>
<figcaption>
I'd like to overlay our real time air quality data onto the map!
</figcaption>
</figure> -->

## After the workshop

Find a proper location for the sensor. This could be your home but you can also get creative and ask local schools or the like if they would like a sensor installed. 

Practically, you'll need some weather proofing and a 5V power source. It's recommended to place the sensor 1-3m above ground level in a well ventilated outdoor area. Basically you're trying to measure the same air we're all breathing. 

Options for weather proofing:
* Use a U bend piece of drain pipe as recommended by the project
* Browse some of the [many](https://www.yeggi.com/q/airrohr/) 3D printed case designs [online](https://www.yeggi.com/q/sensor+community/)

Congratulations! You're now a part of a global network contributing to fighting air pollution!



