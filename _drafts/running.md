---
title: My First Half Marathon
layout: post
image: /assets/blog/running/time_vs_distance.svg
social_image: /assets/blog/running/time_vs_distance.png
alt: A scatter graph of run time vs run distance for all my runs on strava. It shows that I mainly run between 5 and 6 min per kilometer, regardless of distance 
---

I just ran my first half marathon. To celebrate the occasion I'm going to have a look at my historical run data.

<figure>
<img src="/assets/blog/running/time_vs_distance_plus_hist.svg"/>
<figcaption>
</figcaption>
</figure>

- download all my runs from strava
- scatter them on a (distance, time) plot
- plot the (distance, time) curves predicted by the V02 max tables in the running book
- interpolate the table to get a smooth function parametrized by V02max
- fit that to my data

- potentially will need to take only the top 20% of runs or something
- and/or weight by time to get a better estimate of current V02max

Extensions:
- download heart rate data and make a histogram per hour of the day
- could map radius to heart rate and angle to hour of day to make a nice figure
