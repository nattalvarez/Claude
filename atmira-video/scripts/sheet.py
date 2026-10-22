import sys, glob
from PIL import Image, ImageDraw
prefix = sys.argv[1]; frames = sys.argv[2].split(','); cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
tw = 640; th = 360
ims = []
for f in frames:
    im = Image.open(f'out/chk/{prefix}_{f}.png').convert('RGB').resize((tw, th))
    d = ImageDraw.Draw(im); d.rectangle((0, 0, 70, 20), fill=(0, 0, 0)); d.text((4, 4), f, fill=(255, 255, 0))
    ims.append(im)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (tw * cols, th * rows), 'gray')
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
sheet.save(f'out/chk/sheet_{prefix}.png')
