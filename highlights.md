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
Welcome to my little home on the web! It's something between a blog, a project site, a (public) personal wiki and a digital garden. On the left you can find the blog, projects, my CV and my PhD thesis which was about the weird stuff electrons do.

<section class = "highlights">

<section class="title-date-container">
    <h1 class = "highlights"><a href = "/blog/" class="heading">Posts</a></h1>
    <span class="dt-label">Date Posted</span>
</section>

<hr class="heading">

{% assign draft_posts = site.posts | where: "draft", "true" %}
{% assign published_posts = site.posts | where: "draft", "false" %}

{% if jekyll.environment == 'development' %}
{% for post in draft_posts %}
{% include post_summary.html %}
{% endfor %}
{% endif %}

{% for post in published_posts limit:5 %}
{% include post_summary.html %}
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
{% assign projects = site.projects | sort_natural: "date" | reverse %}
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