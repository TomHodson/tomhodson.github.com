import subprocess as sb
from pathlib import Path

svgs = Path("assets/projects/").rglob("*.svg")

for svg_path in svgs:
    minified_name = svg_path.with_suffix(".min.svg")
    print(svg_path, minified_name)
    sb.run(
        ["svgo", str(svg_path), "-o", str(minified_name)]
    )
