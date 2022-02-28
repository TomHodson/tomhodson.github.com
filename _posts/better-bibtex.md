---
title: 'How I use Zotero, Better Bibtex and Overleaf together'
permalink: /posts/2022/zotero_betterbitex_overleaf
date: 2022-01-01
---

## Citation workflow
Add papers to Zotero from web using 'connectors' that parse metadata from journal websites.
Export either you entire collection or a subcollection with "automatic export" ticked

## [Set up automatic git push](https://retorque.re/zotero-better-bibtex/exporting/auto/)
In a word, run:
```bash
git config zotero.betterbibtex.push true #in the repo that holds your overleaf project
```

## When the citations are finalised
When the paper is done and the citations aren't going to change too much, use overleaf see logs feature to see the aux file.
Import the aux into a subcollection to get only the citations used for this paper.
Then export the subcollection again using "Keep updated"
No you'll have a bib file with only the citations actually used.

Overleaf Workflow
---
Sync with Github whenever you'd updated the figures or citations. For some projects I now use the [Overleaf git-bridge](git-bridge) directly because it doesn't require you to manually sync with GitHub.

Submitting to arXiv
---

Use the overleaf exporter to get the necessary .bbl file

Submitting to somewhere else:
---
APS Journals require you to paste or input the .bbl file into the text [paste][paste], replace you command with \include{main.bbl}

[paste]: https://www.overleaf.com/learn/latex/Questions/The_journal_says_%22don't_use_BibTeX;_paste_the_contents_of_the_.bbl_file_into_the_.tex_file%22._How_do_I_do_this_on_Overleaf%3F
[git-bridge]: https://www.overleaf.com/learn/how-to/Using_Git_and_GitHub#The_Overleaf_Git-Bridge