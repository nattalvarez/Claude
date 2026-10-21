# 05 · Estado de la doble voz

Resuelto en v7/v8 (`entrega/atmira-corporativo-v8.mp4`; en v8 la voz femenina es Carmen con `[confident]`, ver `audio/script_v8.json` y `scripts/build_audio_v8.mjs`): los 56 tramos están generados y descargados (`audio/raw_v6/`), transcritos con Scribe (`audio/transcripts_v6/all_words.json` + `offsets.json`, sobre la concatenación con 1,5 s de silencio entre tramos) y montados por bloque con `node scripts/build_audio_v8.mjs`.

Reconstruir el vídeo desde cero:
1. `node scripts/build_audio_v8.mjs` → `public/audio/voz/*.mp3` y `src/data/audio.json`
2. `node scripts/build_timeline.mjs && python3 scripts/synth_music.py`
3. `bash scripts/render_segments.sh out/atmira-corporativo-v8-master.mp4` (16 tramos reanudables; si falta `out/seg/audio.wav` se renderiza con Remotion, o más rápido `python3 scripts/mix_audio.py` antes)
4. `bash scripts/encode_delivery.sh` → `entrega/atmira-corporativo-v8.mp4` (≈ 10 min; en entornos que se reinician, lanzarlo con `nohup` y esperar)

Pendiente de oído (no verificable aquí): acento de «Sírec», entonación y pausas entre las dos voces.
