import sys
from pathlib import Path
import subprocess
from datetime import date

sitepath = Path("~/git/tomhodson.github.com/").expanduser()
defaults_file = sitepath / "pandoc/pandoc_notebook_to_markdown.yaml"
postspath = sitepath / "_posts"

filepath = Path(sys.argv[1]).resolve()
title = sys.argv[2]
# title = input(f"Give this blogpost a title (default to filename):")
if not title: title = filepath.stem.replace("_", " ")
print(f'Title: "{title}"')

filename = title.lower().replace(" ", "_")
print(f'Filename: "{title}"')

# subprocess.run(["jupyter",  "nbconvert", "--to=markdown", filepath, "--output", f"{filename}.md"])

print(f'Running pandoc to generate {title}.md')
subprocess.run(["pandoc",  "-d", defaults_file, f"--extract-media=./{filename}", filepath, "--output", f"{filename}.md"])

with open(f"{filename}.md", "r") as f:
    content = f.read()

print(f'Replacing image links')
content = content.replace(f"./{filename}/", f"/assets/blog/{filename}/")

# remove lines that begin with with ":::"
print(f'Removing lines that begin with :::')
lines = content.split("\n")
lines = [line for line in lines if not line.startswith(":::")]
content = "\n".join(lines)

metadata = f"""---
title:  {title}
layout: post
image: 
---
"""

print(f'Adding metadata')
print(f'Writing out to {filename}.md')
with open(f"{filename}.md", "w") as f:
    f.write(metadata + content)

print(f'Copying over')
todays_date = date.today().isoformat()
subprocess.run(["mv", f"{filename}.md", postspath / f"{todays_date}-{filename}.md"])
subprocess.run(["mv", f"./{filename}", sitepath / f"assets/blog/{filename}"])




