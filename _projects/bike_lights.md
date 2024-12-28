---
title:  Bike Lights
layout: project
excerpt: Making a custom 3W dynamo light for a bike.
permalink: /projects/bike_lights
assets: /assets/projects/bike_lights

img:
    alt: A CAD model of a 3D printable mount for a common LED light onto a bike handlebar.
    class: invertable

social_image: /assets/projects/bike_lights/thumbnail.png
model: /assets/projects/bike_lights/model

---
<outline-model-viewer model = "/assets/projects/bike_lights/models/bigger.glb" camera='{"position":[-7.434,5.128,-6.379],"rotation":[-2.464,-0.7373,-2.646],"zoom":303.06369033128976,"target":[0,0,0]}'>
    <img class="outline-model-poster no-wc" src = "/assets/projects/bike_lights/thumbnail.svg">
    <p class="has-wc">Loading model...</p>
</outline-model-viewer>

I've been playing around with making dynamo bike lights for my bike for a while now. 

The first iteration, the imperfect but actually on my bike and works version... is a rectifier and dc-dc converter soldered to some perfboard covered in a ziplock bag with some holes pocked in it. The DC-DC converter is actually a lipo battery charger with potentiometers for setting the maximum current and voltage. I just hooked it up to a power resistor and fiddled until I got it in current limited mode pushing about 2-3W through one of these 3W white LEDs you can get for peanuts on ebay.

Running those LEDs bare has upsides and downsides, they act like a point source and are pretty bright, so anyone within a 180 degree arc ahead of you is going to be able to see you very well. However you're sending a lot of the light up towards the sky where it probably bounces off a starlink satellite directly into the telescope of some poor astronomer. 

This light distribution also isn't that good for seeing the road. Normally in London there's enough street lighting that this isn't a concern (for anyone except the aforementioned astronomers). But it has become more relevant to me recently because I've started commuting along an unlit canal in the winter and this canal has lots of complex bits of pacing stones and other stuff I need to be able to see in order to avoid taking an unplanned ice bath. 

Cue the CAD model at the top of the page, it's a thing to hold an LED and a cheap lens (again off ebay) and attach them to some bike handlebars. Here it is printed out.
<img src = "/assets/projects/bike_lights/bike_light.jpg" alt="An image of an LED and a lense mounted to a tube in a 3D printed case. The case is split in half so you can see what's inside.">
I hope it's obvious that there are actually two mirrored pieces and I'm just excluding one so that you can see inside.

The lenses come in different nominal spread angles from 90 to 5 degrees. So far 90 seems to work well, being wide enough that I'm still visible to others but concentrating the light enough that I can now see the canal towpath ahead of me pretty well in the pitch black.

## Future 

This project is one of those ones I've had far too many ideas for and haven't done enough implementation.
 - I'd like to add a battery pack for some energy storage
 - I'd like to add a microcontroller to add some smarts like pulsing the light or displaying batter level.
 - I'd like to do the above while still driving the LEDs efficiently from a varying input voltage. I wish I could buy an i2c controllable DC-DC converter off the shelf for that. Ah just found this [buck converting LED driver][buck] that might work.

[buck]: https://protofusion.org/wordpress/2013/03/picobuck-rgb-led-driver/