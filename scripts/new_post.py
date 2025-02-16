#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "questionary",
#   "GitPython",
# ]
# ///
import datetime
import sys
from os import system
from pathlib import Path

import questionary
from git import Repo

repo = Repo.init(".")
if repo.untracked_files or repo.is_dirty():
    print("Repo is dirty, commit changes first.")
    sys.exit()

now = datetime.datetime.now()

title = questionary.text("Title: ").ask()

shorter_title = ""
for word in title.split():
    if len(shorter_title) + len(word) < 100:
        shorter_title += word + " "
    else:
        break
shorter_title = shorter_title.strip()

id_from_title = shorter_title.lower().replace(" ", "-").replace(".", "").replace(",", "").replace(":", "")
id_from_title = questionary.text("id_from_title: ", default=id_from_title).ask()

answers = questionary.form(
    excerpt = questionary.text("Excerpt: "),
    date = questionary.text("Date: ", default=now.strftime("%Y-%m-%d")),
    libraries = questionary.checkbox(
        "Load Libraries:",
        choices=[
            "mathjax",
            "model_viewer",
            "klipse",
        ],
    ),
).ask()


filename = f"{answers['date']}-{id_from_title}.md"
filename = questionary.text("Filename: ", default=filename).ask()

assets_dir = f"assets/blog/{id_from_title}"
assets_dir = questionary.text("Assets Directory: ", default=assets_dir).ask()

if Path(assets_dir).exists() \
    and questionary.confirm(f"Directory {assets_dir} already exists, change assets dir?").ask():
    assets_dir = questionary.text("Assets Directory: ", default=assets_dir).ask()

git_branch = questionary.text("Branch: ", default=f"post/{id_from_title}").ask()

newline = "\n"
draft = f"""---
title: {title}
layout: post
excerpt: {answers['excerpt']}
draft: true

assets: /{assets_dir}
thumbnail: /{assets_dir}/thumbnail.svg
social_image: /{assets_dir}/thumbnail.png
alt:
image_class: invertable

{newline.join(f'{k}: true' for k in answers['libraries'])}
---

"""
print(f"Will create new branch post/{id_from_title} based off main.")
print("Post header yaml will be:")
print(draft)
if not questionary.confirm("Create post?").ask():
    sys.exit()

repo.git.checkout("main")
repo.git.checkout("-b", git_branch)

with open(f"_posts/{filename}", "w") as f:
    f.write(draft)

print(f"Made new post at _posts/{filename}")

if questionary.confirm(f"Create {assets_dir}").ask():
    Path(assets_dir).mkdir(exist_ok=True)

Path("highlights.md").touch()
Path("blog.md").touch()

url = f"http://localhost:4100/{now.strftime('%Y/%m/%d/')}{id_from_title}.html"
# system(f"open {url}")
print(f"Post served on localhost, open in browser to preview. {url}")
system(f"code _posts/{filename}")

print(f"Now on new branch post/{id_from_title}")
print("Make sure to edit, then commit and push changes.")