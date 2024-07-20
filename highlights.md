---
title: Blog
layout: default
excerpt: |
  I'm Tom Hodson. Welcome to my little home on the web! There's a blog, a cv and some projects to look at.
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
## Posts
<br>
{% for post in site.posts limit:5 %}
{% include post_summary.html %}
{% endfor %}
<a href = "/blog/" style="margin:auto;">More Posts</a>

## Projects
<br>
{% for post in site.projects limit:5 %}
{% include project_summary.html %}
{% endfor %}

<a href = "/projects/" style="margin:auto;">More Projects</a>

## Toots
<div id="mt-container" class="mt-container">
  <div class="mt-body" role="feed">
    <div class="mt-loading-spinner"></div>
  </div>
</div>

<script type="module">
const myTimeline = new MastodonTimeline.Init({
  instanceUrl: "https://tech.lgbt",
  timelineType: "profile",
  userId: "109290417826726461",
  profileName: "@TomHodson",
  maxNbPostFetch: "50",
  maxNbPostShow: "30",
  hideReblog: true,
  hideReplies: true,
  hideCounterBar: true,
  disableCarousel: true,
  btnReload: "",
});

</script>