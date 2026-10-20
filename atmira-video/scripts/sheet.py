#!/usr/bin/env python3
"""Hoja de contacto: python3 scripts/sheet.py <dir> <out.png> [cols] [prefix]"""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
prefix = sys.argv[4] if len(sys.argv) > 4 else ""
fs = sorted(glob.glob(os.path.join(d, prefix + "*.png")))
ims = [Image.open(f).convert("RGB") for f in fs]
w, h = ims[0].size
tw = 960 if cols <= 2 else (640 if cols == 3 else 480)
th = int(tw * h / w)
rows = (len(ims) + cols - 1) // cols
sh = Image.new("RGB", (cols * tw, rows * th), (30, 30, 30))
dr = ImageDraw.Draw(sh)
for i, (f, im) in enumerate(zip(fs, ims)):
    im = im.resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * th
    sh.paste(im, (x, y))
    dr.rectangle([x, y, x + 150, y + 16], fill=(0, 0, 0))
    dr.text((x + 3, y + 2), os.path.basename(f)[:-4], fill=(255, 255, 0))
sh.save(out)
print(out, sh.size)
