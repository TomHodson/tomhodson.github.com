---
title: Home
layout: default
excerpt: |
  Hi, I'm Tom Hodson. Welcome to my little home on the web.
permalink: /highlights
mathjax: false
img:
    src: /assets/images/avatar.jpeg
    alt: A picture of me.
permalink: /
head: |
    <link rel="stylesheet" href="/node_modules/@idotj/mastodon-embed-timeline/dist/mastodon-timeline.min.css">
    <script src="/node_modules/@idotj/mastodon-embed-timeline/dist/mastodon-timeline.umd.js"></script>


---
Welcome to my little home on the web! Below you'll find recent blog posts, projects and mastodon toots. You'll also find links to the web version of my thesis <a href = "/thesis/4_Amorphous_Kitaev_Model/4.2_AMK_Methods.html#:~:text=Figure 1:,on the torus.">(with animations!)</a> and my <a href="/cv/">CV</a>. 

## Posts
<br>
{% for post in site.posts limit:5 %}
{% include post_summary.html %}
{% endfor %}
<a href = "/blog/" class = "highlights-more">More Posts</a>

## Projects
<br>
{% for post in site.projects limit:5 %}
{% include project_summary.html %}
{% endfor %}


<a href = "/projects/" class = "highlights-more">More Projects</a>

## Toots
<div id="mt-container" class="mt-container">
  <div class="mt-body" role="feed">
    <div class="mt-loading-spinner"></div>
  </div>
</div>

<a href = "https://tech.lgbt/@Tomhodson" class = "highlights-more">More Toots</a>

<script type="module">
const myTimeline = new MastodonTimeline.Init({
  instanceUrl: "https://tech.lgbt",
  timelineType: "profile",
  userId: "109290417826726461",
  profileName: "@TomHodson",
  maxNbPostFetch: "30",
  maxNbPostShow: "5",
  hideReblog: true,
  hideReplies: true,
  hideCounterBar: true,
  disableCarousel: true,
  btnReload: "",
  btnSeeMore: "",
});

</script>