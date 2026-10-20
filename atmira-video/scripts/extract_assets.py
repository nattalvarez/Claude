#!/usr/bin/env python3
"""
Extrae del vídeo original los recursos de marca reutilizables:
  - logotipo atmira (RGBA, color plano + variantes blanco/negro)
  - logotipos de clientes de la diapositiva "Proyectos reales" (color)
  - logotipos de clientes del muro "Relaciones duraderas" (monocromo, segmentados)
  - logotipo SIREC
  - pieza de arte de marca (diapositiva 2) sin marca de agua

Uso:  python3 scripts/extract_assets.py [ruta/al/original.mp4]
No modifica el vídeo original. Requiere ffmpeg, numpy, Pillow y scipy.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "source" / "atmira-original.mp4"
TMP = ROOT / ".cache" / "frames"
TMP.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "brand").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "clients").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "cases").mkdir(parents=True, exist_ok=True)


def grab(t: float, name: str) -> Image.Image:
    out = TMP / f"{name}.png"
    if not out.exists():
        subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", str(t), "-i", str(SRC), "-frames:v", "1", str(out), "-y"],
            check=True,
        )
    return Image.open(out).convert("RGB")


def alpha_from_ink(img: Image.Image, ink_rgb, bg=255.0, gamma=1.0):
    """Alpha a partir de la diferencia contra fondo blanco, usando el canal más oscuro de la tinta."""
    a = np.asarray(img).astype(np.float32)
    ch = int(np.argmin(ink_rgb))
    denom = max(bg - float(ink_rgb[ch]), 1.0)
    al = np.clip((bg - a[..., ch]) / denom, 0, 1) ** gamma
    return al


# ---------------------------------------------------------------- logo atmira
frame = grab(5.0, "logo_t5")
arr = np.asarray(frame).astype(np.int16)
mag = (arr[..., 1] < 150) & (arr[..., 0] > 150)  # magenta
mag[880:, :] = False  # fuera marca de agua
ys, xs = np.where(mag)
y0, y1, x0, x1 = ys.min() - 14, ys.max() + 14, xs.min() - 14, xs.max() + 14
logo = frame.crop((x0, y0, x1, y1))
la = np.asarray(logo).astype(np.float32)
core = la[(la[..., 1] < 70)]
ink = np.median(core, axis=0)  # color de marca medido
print("color de marca medido (RGB):", ink)
al = alpha_from_ink(logo, ink)
for name, rgb in {"atmira-magenta": ink, "atmira-white": (255, 255, 255), "atmira-black": (20, 20, 20)}.items():
    out = np.zeros((*al.shape, 4), np.uint8)
    out[..., :3] = np.array(rgb, np.uint8)
    out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(ROOT / "public" / "brand" / f"{name}.png")
print("logo atmira:", logo.size)
json.dump(
    {"inkRGB": [int(v) for v in ink], "ink": "#%02x%02x%02x" % tuple(int(v) for v in ink), "logoSize": list(logo.size)},
    open(ROOT / "public" / "brand" / "brand.json", "w"),
)

# ----------------------------------------------- arte de marca (diapositiva 2)
art = grab(55.0, "slide2").crop((1070, 182, 1920, 925))
art.save(ROOT / "public" / "brand" / "brand-art.png")

# ------------------------------------------------------ logos de casos (color)
cases = grab(440.0, "cases")
boxes = {
    "asisa": (630, 224, 810, 276),
    "bbva": (1048, 222, 1190, 272),
    "caixabank": (1466, 230, 1700, 284),
    "morabanc": (632, 532, 870, 574),
    "axa": (1050, 513, 1114, 577),
    "mapfre": (1466, 520, 1726, 570),
    "mutua-madrilena": (630, 800, 950, 862),
    "sabadell": (1048, 808, 1250, 856),
    "aegon": (1470, 808, 1612, 862),
}
for k, b in boxes.items():
    crop = cases.crop(b)
    a = np.asarray(crop).astype(np.float32)
    # alpha: distancia al blanco, normalizada (conserva color original, fondo transparente)
    dist = 255.0 - a.min(axis=2)
    al = np.clip(dist / 40.0, 0, 1)
    out = np.zeros((*al.shape, 4), np.uint8)
    # des-premultiplica sobre blanco para evitar halo claro
    with np.errstate(divide="ignore", invalid="ignore"):
        col = 255.0 - (255.0 - a) / np.maximum(al[..., None], 1e-3)
    out[..., :3] = np.clip(col, 0, 255).astype(np.uint8)
    out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(ROOT / "public" / "cases" / f"{k}.png")

# SIREC (diapositiva plataforma, t=130)
sirec = grab(130.0, "platform").crop((526, 912, 640, 1002))
sirec.save(ROOT / "public" / "brand" / "sirec.png")

# ------------------------------------------- muro de clientes (monocromo, t=482)
wall = grab(482.0, "wall")
panel = wall.crop((150, 230, 1850, 900))
g = np.asarray(panel.convert("L")).astype(np.float32)
ink_mask = g < 215
# separa por filas
row_occ = ink_mask.sum(axis=1) > 0
row_lab, nrows = ndimage.label(ndimage.binary_closing(row_occ, structure=np.ones(7)))
manifest = []
idx = 0
for r in range(1, nrows + 1):
    ry = np.where(row_lab == r)[0]
    ry0, ry1 = ry.min(), ry.max() + 1
    band = ink_mask[ry0:ry1]
    col_occ = band.sum(axis=0) > 0
    col_lab, ncols = ndimage.label(ndimage.binary_closing(col_occ, structure=np.ones(28)))
    for c in range(1, ncols + 1):
        cx = np.where(col_lab == c)[0]
        cx0, cx1 = cx.min(), cx.max() + 1
        sub = ink_mask[ry0:ry1, cx0:cx1]
        yy = np.where(sub.sum(axis=1) > 0)[0]
        by0, by1 = ry0 + yy.min(), ry0 + yy.max() + 1
        pad = 6
        crop = panel.crop((max(cx0 - pad, 0), max(by0 - pad, 0), cx1 + pad, by1 + pad))
        a = np.asarray(crop.convert("L")).astype(np.float32)
        al = np.clip((250.0 - a) / 150.0, 0, 1)
        out = np.zeros((*al.shape, 4), np.uint8)
        out[..., :3] = (40, 40, 44)
        out[..., 3] = (al * 255).astype(np.uint8)
        idx += 1
        fn = f"c{idx:02d}.png"
        Image.fromarray(out, "RGBA").save(ROOT / "public" / "clients" / fn)
        manifest.append({"file": fn, "row": r, "w": crop.size[0], "h": crop.size[1]})
json.dump(manifest, open(ROOT / "public" / "clients" / "manifest.json", "w"), indent=1)
print("logos del muro segmentados:", idx)


# ----------------------------------------------------- re-escalado nítido (3x)
def crisp(path: Path, k: int = 3):
    """Lanczos 3x + curva de contraste en alfa: bordes limpios al mostrar los logos a >1x. Devuelve (w, h) originales."""
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    big = im.resize((w * k, h * k), Image.LANCZOS)
    a = np.asarray(big).astype(np.float32)
    al = a[..., 3] / 255.0
    al = np.clip((al - 0.2) / 0.6, 0, 1)
    al = al * al * (3 - 2 * al)
    al = ndimage.gaussian_filter(al, 0.8)
    a[..., 3] = al * 255
    Image.fromarray(a.astype(np.uint8), "RGBA").save(path)
    return w, h


dims = {}
for f in sorted((ROOT / "public" / "cases").glob("*.png")):
    dims[f.stem] = crisp(f)
json.dump(dims, open(ROOT / "public" / "cases" / "manifest.json", "w"))
for e in manifest:
    e["w"], e["h"] = crisp(ROOT / "public" / "clients" / e["file"])
json.dump(manifest, open(ROOT / "public" / "clients" / "manifest.json", "w"), indent=1)
print("logos re-escalados (3x) y manifiestos escritos")
