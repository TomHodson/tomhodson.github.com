---
title: Running ideas draft post
layout: post
image: /assets/blog/running/time_vs_distance.svg
social_image: /assets/blog/running/time_vs_distance.png
alt: This shouldn't get committed, it's just a grab bag of ideas for running blog posts.
---

[x] download all my runs from strava
[x] scatter them on a (distance, time) plot
[x] plot the (distance, time) curves predicted by the V02 max tables in the running book
- interpolate the table to get a smooth function parametrized by V02max
- fit that to my data

- potentially will need to take only the top 20% of runs or something
- and/or weight by time to get a better estimate of current V02max

Extensions:
[x] download heart rate data and make a histogram per hour of the day
    [ ] Check that it uses local time not UTC
[x] could map radius to heart rate and angle to hour of day to make a nice figure

garmin db: https://github.com/tcgoetz/GarminDB/tree/master