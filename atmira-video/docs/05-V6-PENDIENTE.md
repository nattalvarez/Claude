# 05 · v6 (doble voz + rediseño sin cajas): estado y cómo retomar

## Hecho
- **Rediseño visual** (referencia: «atmira motion v4»): sin cajas alrededor del texto, tipografía más contundente, planos de color a sangre, lista a foco, numerales fantasma, línea de progreso inferior. Escenas tocadas: 2, 3, 4, 5, 8, 9, 11, 12, 13, 14, 15 (componentes en `src/components/Kinetic.tsx`).
- **Reparto a doble voz**: `audio/script_v6.json` (56 tramos; M = Alejandro Castellanos `WWVK6dYMrl0ZHnHT7cRj`, F = Francesca Dari `S7bOxFEwwuJG764dSujP`, modelo `eleven_v4`). Voz femenina peninsular elegida con `creative_list_voices` (etiqueta `es-peninsular`).
- **Generados** 33 de 56 tramos (hasta `b10a_2`), registrados en `audio/registry_v6.json` (flujo `GWsRC5NHLK77Stl6bsgQ`, sesión y generación de cada uno; se pueden volver a descargar desde el flujo).

## Bloqueo
La cuota de ElevenLabs (10.000 créditos) se agotó. Fallaron, marcados `failed` en el registro: `b05_1`, `b05_5`, `b10b_1-2`, `b11_1-2`, `b12_1-2`, `b13_1-3`, `b14_1-4`, `b15_1-2`, `b16_1-3`, `b17_1-3` (≈4.000 créditos).

## Para retomar (cuando haya créditos)
1. Regenerar los tramos `failed` con el mismo texto y voz de `script_v6.json` (de uno en uno: la API da 429 si se encadenan).
2. Descargar los 56 (estado del flujo → `content_url`) a `audio/raw_v6/<id>.mp3` y transcribir cada uno con Scribe (conectar al nodo TTS) → `audio/transcripts_v6/<id>.json`.
3. Adaptar `scripts/build_audio.mjs` para unir los tramos de cada bloque (hueco ≈ 0,25 s entre voces) y generar `public/audio/voz/<bloque>.mp3` + `src/data/audio.json`; luego `npm run audio` (montaje y música).
4. Comprobar avisos de `cue()` con `node scripts/frames.mjs` y renderizar: `bash scripts/render_segments.sh && bash scripts/encode_delivery.sh`.
