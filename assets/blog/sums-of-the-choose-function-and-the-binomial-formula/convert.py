#!/usr/bin/env -S uv run --script
#
# /// script
# requires-python = ">=3.13"
# dependencies = ["pyyaml"]
# ///
import sys
from pathlib import Path
import json
import yaml
import html
import base64

import argparse

parser = argparse.ArgumentParser()
parser.add_argument(dest="infile", type=argparse.FileType('r', encoding='UTF-8'))
parser.add_argument(dest="outfile", type=argparse.FileType('w', encoding='UTF-8'))
args = parser.parse_args()

notebook = json.load(args.infile)

with open("head.yaml") as f:
    yaml_str = f.read()
    yaml = yaml.safe_load(f)


args.outfile.write(
f"""---
{yaml_str}
---
""")

for cell in notebook["cells"]:
    cell_type = cell["cell_type"]

    if cell_type == "markdown":
        args.outfile.write("".join(cell["source"]) + "\n")

    elif cell_type == "code":
        args.outfile.write('<div class="code-cell" markdown=1>\n')
        args.outfile.write("```python\n")
        args.outfile.write("".join(cell["source"]).strip())
        args.outfile.write("\n```\n")

        args.outfile.write("```plaintext\n")
        for output in cell.get("outputs", ()):
            if output["output_type"] == "execute_result":
                value = output["data"].get("text/plain", ())
                args.outfile.write("".join(value).strip())
            
            if output["output_type"] == "stream":
                args.outfile.write("".join(output["text"]).strip())
        args.outfile.write("\n```\n")

        for output in cell.get("outputs", ()):
            if output["output_type"] == "display_data":
                if "image/svg+xml" in output["data"]:
                    data = output["data"]["image/svg+xml"]
                    args.outfile.write(f'<img src="data:image/svg+xml;base64, {base64.b64encode(''.join(data).encode()).decode()}"/>')
                elif "image/png" in output["data"]:
                    data = output["data"]["image/png"]
                    args.outfile.write(f'<img src="data:image/png;base64, {data}"/>')
        
        args.outfile.write("</div>\n")





    args.outfile.write("\n")
