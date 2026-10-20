# atmira · vídeo corporativo (rediseño)

Rediseño integral del vídeo corporativo de atmira: **1920×1080 · 25 fps · 7:48**, locución en español de España generada con ElevenLabs, música original sintetizada y cierre cinematográfico. Todo es código (Remotion 4 + React): textos, tiempos y recursos son editables.

> Entregable final: `out/atmira-corporativo-v5.mp4` (H.264, yuv420p, AAC). El original no se ha tocado.

## Contenido del proyecto
```
src/
  AtmiraCorporativo.tsx   Montaje: registro de escenas, transiciones, música y locución
  scenes/S01…S18          Una escena por archivo (apertura … cierre)
  components/             SilkField (motivo «seda» 3D), Stage, Logo, Type, Sync, Chrome, Brain
  transitions/            Transiciones propias (cinta, puertas, zoom, iris, empuje, flood…)
  data/content.ts         TODOS los textos en pantalla
  data/scenes.json        Parámetros de montaje (lead, tail, min, transición de salida)
  data/audio.json         (generado) bloques de voz: archivo, duración, ganancia, palabras con tiempos
  data/timeline.json      (generado) inicio/duración de cada escena en fotogramas
  theme.ts  lib/          Colores, tipografía, easings, utilidades de animación y de sincronía
public/
  audio/voz/*.mp3         Locución por bloque (18) · audio/music.mp3 música original
  brand/ cases/ clients/  Logotipos recuperados del vídeo original (ver «Limitaciones»)
audio/
  script.json             Guion (fuente única de la locución) y parámetros de voz
  raw/*.mp3               Clips tal como los devolvió ElevenLabs
  transcripts/*.json      Transcripción con tiempos por palabra (Scribe)
  registry.json           Identificadores de flujo/generación (sin credenciales)
scripts/                  extract_assets.py · generate_voice.mjs · build_audio.mjs · build_timeline.mjs
                          synth_music.py · render_segments.sh · frames.mjs · sheet.py
docs/                     01 Auditoría · 02 Dirección de arte · 03 Guion y voz · 04 QA y errores
```

## Requisitos
Node ≥ 20, Python 3 con `numpy`, `scipy`, `Pillow`, `ffmpeg` en el PATH y un Chromium (en Remotion, `remotion.config.ts` apunta a `headless_shell` de Playwright; ajusta la ruta si es otra).

```bash
npm install
npm start            # Remotion Studio (vista previa interactiva)
npm run typecheck
```

## Renderizar
```bash
npm run render                      # un solo render (≈ 60-100 min a 4 hilos)
bash scripts/render_segments.sh     # recomendado: 4 tramos reanudables + audio + mezcla con ffmpeg
npm run preview                     # versión 50 % para revisar ritmo
node scripts/frames.mjs AtmiraCorporativo out/chk cierre:439,banking:120 0.5   # fotogramas sueltos (escena:frame)
```

## Editar
| Qué | Dónde | Después |
|---|---|---|
| Textos en pantalla | `src/data/content.ts` | nada (Studio recarga) |
| Texto hablado | `audio/script.json` → borra el `raw/` y la transcripción del clip afectado | `ELEVENLABS_API_KEY=… npm run voice <clip>` y `npm run audio` (ver abajo) |
| Duración / respiración de una escena | `src/data/scenes.json` (`lead`, `tail`, `min`, `out.frames`) | `npm run audio` (recalcula el montaje **y la música**) |
| Qué aparece cuando se dice una palabra | `cue("frase")` en la escena (busca la palabra en la transcripción) | nada |
| Colores, tipografía, easings | `src/theme.ts` | — |
| Logotipos | `public/brand`, `public/cases`, `public/clients` (PNG con alfa) | — |
| Cierre | `src/scenes/S18Cierre.tsx` (constantes `PLANES`, `blob`, tiempos de ola) | `npm run audio` si cambia el instante de «tuya»/«atmira» |

### Flujo de la locución
1. `audio/script.json` define clips y bloques. 2. Cada clip → ElevenLabs (`audio/raw/*.mp3`). 3. Scribe devuelve los tiempos por palabra (`audio/transcripts/*.json`). 4. `npm run audio` corta, normaliza a −18 LUFS, genera `audio.json` + `timeline.json` y sintetiza `public/audio/music.mp3` alineada con esos tiempos.

La voz de este proyecto se generó con el **conector de ElevenLabs de la sesión de Claude** (sin clave). Para regenerar fuera de esa sesión existe `scripts/generate_voice.mjs`, que lee la clave **solo** de la variable de entorno `ELEVENLABS_API_KEY`. Ese script **no se ha ejecutado** (no había acceso de red a la API en el entorno): comprueba los endpoints en la documentación de ElevenLabs antes de usarlo. Nunca guardes la clave en el repositorio (`.env` está en `.gitignore`).

## Limitaciones (ver `docs/04-QA-ERRORES.md`)
- **Audio no escuchado.** No puedo oír: el acento peninsular, la pronunciación (ModernIzA, SIREC…) y el equilibrio voz/música se han verificado con medidas (duraciones, LUFS, silencios, clipping), no de oído. Scribe devuelve el texto enviado con fidelidad, pero no es una prueba independiente de la pronunciación. Escucha el vídeo antes de publicarlo.
- **Audio del original sin transcribir** (no había ASR disponible): el guion nuevo parte del texto en pantalla.
- **Logotipos recuperados del MP4** (no hay paquete oficial de marca): el logotipo y los 9 de casos se han reescalado 3× con curva de alfa; los 78 del muro son de baja resolución. Sustitúyelos por los vectoriales oficiales cuando los tengas (mismo nombre de archivo).
- **No se reproducen** la marca de agua «clideo.com» ni los marcadores del cierre original («[Nombre y cargo] · [email] · [teléfono]»). Se mantiene `atmira.com`.
- Música **sintetizada** (original, sin muestras ni licencias).
- Mensaje final: texto original del vídeo; no se inventa ningún eslogan.
