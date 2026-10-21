#!/usr/bin/env bash
# Codificación de entrega (≈ 77 MB) a partir del máster de render_segments.sh (out/seg/video.mp4 + out/seg/audio.wav).
# El máster sale en yuvj420p (rango completo, por los fotogramas JPEG de Remotion): se convierte a yuv420p rango TV (BT.709).
# El audio baja 1 dB para dejar el pico real en ≈ −1,2 dBFS tras el AAC.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -i out/seg/video.mp4 -i out/seg/audio.wav -map 0:v -map 1:a \
  -vf "scale=in_range=full:out_range=tv:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset medium -crf 25 -maxrate 3M -bufsize 6M \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -af volume=-1dB -c:a aac -b:a 192k -movflags +faststart entrega/atmira-corporativo-v6.mp4
