---
title: 'How I use Zotero, Better Bibtex and Overleaf together'
date: 2199-01-01
permalink: /posts/2012/08/blog-post-4/
tags:
  - cool posts
  - category1
  - category2
---

Make Overleaf project
Activate Github repo

## Citation workflow
Add papers using Zotero connectors from web
Export either you entire collection or a subcollection with "automatic export" ticked
Automatic git push with https://retorque.re/zotero-better-bibtex/exporting/auto/


#### When the citations are done
When the paper is done and the citations aren't going to change too much, use overleaf see logs feature to see the aux file.
Import the aux into a subcollection to get onle the citations used for this paper.
Then export the subcollection again using "Keep updated"
No you'll have a bib file with only the citations actually used.

Overleaf Workflow
---
Sync with Github whenever you'd updated the figures or citations.

Submitting to arXiv
---

Use the overleaf exporter to get the necessary .bbl file

Submitting to somewhere else:
---
APS Journals require you to paste or input the .bbl file into the text [paste][paste], replace you command with \include{main.bbl}

[paste]: https://www.overleaf.com/learn/latex/Questions/The_journal_says_%22don't_use_BibTeX;_paste_the_contents_of_the_.bbl_file_into_the_.tex_file%22._How_do_I_do_this_on_Overleaf%3F
