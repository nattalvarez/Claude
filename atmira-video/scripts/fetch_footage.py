"""Downloads the Mixkit stock clips used in the film and normalises them to 1920x1080 @30fps (no audio).

    python3 scripts/fetch_footage.py

Writes public/footage/<id>.mp4 and src/footage.json (frame counts). Mixkit Stock Video Free License:
free for commercial use, no attribution required — see CREDITS.md for the clip list.
"""
import json, os, subprocess, tempfile, concurrent.futures as cf

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "footage")
IDS = [49878, 30468, 4170, 4010, 4240, 8813, 13218, 26776, 23282, 14143, 4168, 22966, 46635, 41656, 47016, 19630, 38481, 48394, 31029, 4809, 49846, 34980]
os.makedirs(OUT, exist_ok=True)


def fetch(i):
    raw = os.path.join(tempfile.gettempdir(), f"mixkit_{i}.mp4")
    for q in ("1080", "720"):
        r = subprocess.run(["curl", "-s", "-m", "180", "-A", "Mozilla/5.0", "-o", raw, "-w", "%{http_code}", f"https://assets.mixkit.co/videos/{i}/{i}-{q}.mp4"], capture_output=True, text=True)
        if r.stdout == "200" and os.path.getsize(raw) > 50000:
            break
    else:
        return str(i), None
    dst = os.path.join(OUT, f"{i}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-t", "16", "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30", "-c:v", "libx264", "-crf", "19", "-preset", "fast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], check=True)
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst], capture_output=True, text=True).stdout)
    os.remove(raw)
    return str(i), {"frames": int(d * 30) - 1}


with cf.ThreadPoolExecutor(4) as ex:
    res = dict(ex.map(fetch, IDS))
json.dump(res, open(os.path.join(ROOT, "src", "footage.json"), "w"), indent=1)
print({k: v for k, v in res.items() if v is None} or "ok")
