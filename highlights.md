---
title: Home
layout: default
excerpt: |
  Hi, I'm Tom Hodson. Welcome to my little home on the web.
permalink: /
mathjax: false
img:
    src: /assets/images/avatar.jpeg
    alt: A picture of me.
head: |
    <link rel="stylesheet" href="/node_modules/@idotj/mastodon-embed-timeline/dist/mastodon-timeline.min.css">
    <script src="/node_modules/@idotj/mastodon-embed-timeline/dist/mastodon-timeline.umd.js"></script>


---
Welcome to my little home on the web! Below you'll find recent blog posts, projects and mastodon toots. You'll also find links to the web version of my thesis <a href = "/thesis/4_Amorphous_Kitaev_Model/4.2_AMK_Methods.html#:~:text=Figure 1:,on the torus.">(with animations!)</a> and my <a href="/cv/">CV</a>. 

<section class = "highlights">

<section class="title-date-container">
    <h1 class = "highlights"><a href = "/blog/" class="heading">Posts</a></h1>
    <span class="dt-label">Date Posted</span>
</section>

<hr class="heading">
{% for post in site.posts limit:5 %}
{% if post.draft == false or jekyll.environment == "development" %}
{% include post_summary.html %}
{% endif %}
{% endfor %}
<br>
<a href = "/blog/" class = "highlights-more">More</a>
</section>

<section class = "highlights">

<section class="title-date-container">
    <h1 class = "highlights"><a href = "/projects/" class = "heading">Projects</a></h1>
    <span class="dt-label">Last Modified</span>
</section>
<hr class="heading">
{% assign projects = site.projects | sort_natural: "last_modified_at"%}
{% for post in projects limit:5 %}
{% if post.draft == false or jekyll.environment == "development" %}
{% include project_summary.html %}
{% endif %}
{% endfor %}
<a href = "/projects/" class = "highlights-more">More</a>
</section>

<section class = "highlights">
<h1 class = "highlights"><a href = "https://tech.lgbt/@Tomhodson" class = "heading">Toots</a></h1>
<hr class="heading">
<div id="mt-container" class="mt-container">
  <div class="mt-body" role="feed">
    <div class="mt-loading-spinner"></div>
  </div>
</div>
</section>

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