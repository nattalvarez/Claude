#!/usr/bin/env bash
# Render por tramos (reanudable): vídeo sin audio en 4 tramos + audio WAV aparte, y mezcla final con ffmpeg.
# Uso: bash scripts/render_segments.sh [salida.mp4]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-out/atmira-corporativo-v12.mp4}"
TOTAL=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("src/data/timeline.json","utf8")).total)')
N=16
STEP=$(( (TOTAL + N - 1) / N ))
mkdir -p out/seg
: > out/seg/list.txt
for i in $(seq 0 $((N-1))); do
  A=$((i*STEP)); B=$(( (i+1)*STEP - 1 )); [ $B -ge $TOTAL ] && B=$((TOTAL-1))
  F=out/seg/v$i.mp4
  if [ ! -s "$F" ]; then
    npx remotion render src/index.ts AtmiraCorporativo "out/seg/part_v$i.mp4" --codec=h264 --crf=17 --pixel-format=yuv420p --muted --concurrency=4 --frames=$A-$B --overwrite
    mv "out/seg/part_v$i.mp4" "$F"
  fi
  echo "file 'v$i.mp4'" >> out/seg/list.txt
done
[ -s out/seg/audio.wav ] || npx remotion render src/index.ts AtmiraCorporativo out/seg/audio.wav --codec=wav --overwrite
ffmpeg -y -v error -f concat -safe 0 -i out/seg/list.txt -c copy out/seg/video.mp4
ffmpeg -y -v error -i out/seg/video.mp4 -i out/seg/audio.wav -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"
echo "OK $OUT"
