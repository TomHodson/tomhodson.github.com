Generates my personal website.

## Installing Ruby
You probably want to run ruby from a version manager like `chruby`, see [here](https://jekyllrb.com/docs/installation/macos/).

## Changes checklist
A list of things to check once in a while to make sure I haven't broken them inadvertently.
- Mobile and web layouts looks ok.
- Dark mode and light mode both look ok.
- OG tags render nicely, use https://www.opengraph.xyz/
- Check the rss feed https://validator.w3.org/feed/check.cgi?url=https%3A%2F%2Fthomashodson.com%2Ffeed.xml

## Todo
  - change the OG image used for the landing page so it's not just my face.
  - add humans.txt https://humanstxt.org/
  - fix the OG tags so that https://cards-dev.twitter.com/validator works
  - consider switching to using pandoc as a markdown renderer
  - setup webmentions https://aarongustafson.github.io/jekyll-webmention_io/
  - add a theme toggle button: https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/
  - make sure the above works with the thesis section, will probably require stripping the html tag.

## Validators
  - [blacklight](https://themarkup.org/blacklight)

## Notes
[Installation](https://jekyllrb.com/docs/installation/macos/)
`bundle install`
Then
Use `./run.sh` to do local development of this site

## Past and future inspirations 
[Blog Microfeatures](https://danilafe.com/blog/blog_microfeatures/)
[Nice code blocks](https://staniks.github.io/articles/serious-engine-networking-analysis#overview)