#!/usr/bin/env bash
# Sustituye tramos del máster (out/seg/video.mp4) por re-renders parciales y recodifica la entrega.
# Uso: bash scripts/splice_fixes.sh  (edita FIXES: "inicio-fin archivo")
set -euo pipefail
cd "$(dirname "$0")/.."
FIXES=("3700-4599 out/seg/fixA.mp4" "7900-8619 out/seg/fixB.mp4")
TOTAL=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("src/data/timeline.json","utf8")).total)')
V="-vf scale=in_range=full:out_range=tv:flags=lanczos,format=yuv420p -c:v libx264 -preset medium -crf 25 -maxrate 3M -bufsize 6M -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -an"
: > out/seg/splice.txt
pos=0; n=0
piece(){ ffmpeg -y -v error "${@:2}" $V "out/seg/p$1.mp4"; echo "file 'p$1.mp4'" >> out/seg/splice.txt; }
for f in "${FIXES[@]}"; do
  set -- $f; a=${1%-*}; b=${1#*-}
  [ $a -gt $pos ] && { piece $n -ss $(python3 -c "print($pos/25)") -i out/seg/video.mp4 -frames:v $((a-pos)); n=$((n+1)); }
  piece $n -i "$2"; n=$((n+1)); pos=$((b+1))
done
piece $n -ss $(python3 -c "print($pos/25)") -i out/seg/video.mp4
ffmpeg -y -v error -f concat -safe 0 -i out/seg/splice.txt -c copy out/seg/vfinal.mp4
ffmpeg -y -v error -i out/seg/vfinal.mp4 -i out/seg/audio.wav -map 0:v -map 1:a -c:v copy -af volume=-1dB -c:a aac -b:a 192k -movflags +faststart entrega/atmira-corporativo-v7.mp4
echo SPLICED
