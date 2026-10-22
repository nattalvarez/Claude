# Atmira — vídeo corporativo (48 s) · Remotion

Vídeo corporativo B2B de Atmira (banca y seguros) con **vídeo de stock real** (Mixkit), voz en off de ElevenLabs, música/SFX sintetizados y cierre con el logo de Atmira.
1920×1080 · 30 fps · H.264 + AAC · paleta de marca `#3365A2` `#233456` `#2ABBCE` `#DDE7F4`.

## Guion (voz: ElevenLabs «Santiago – Deep Executive», `eleven_v4`; «SIREC» se fuerza a SÍ-rec con IPA `/ˈsiɾek/`)
| t (s) | Escena | Locución |
|---|---|---|
| 0.0–3.5 | Gancho | «Los servicios financieros no esperan.» |
| 3.5–9.5 | Atmira | «En Atmira modernizamos y aceleramos la banca y los seguros, para que la tecnología impulse tu negocio.» |
| 9.5–15 | Cifras | «20 años. 820 especialistas. Más de 40 clientes activos.» (+ 70 M€ de cifra de negocio en pantalla) |
| 15–20.5 | Mapa | «Con sede en Europa y Latinoamérica, y más de 7 hubs, estamos donde tu negocio nos necesita.» (Europa y Latam resaltadas) |
| 20.5–28.75 | SIREC | «Nuestra plataforma SIREC orquesta el ciclo completo de tu negocio, y SIREC Agent Fabric integra la inteligencia artificial con seguridad y cumplimiento.» |
| 28.75–31.5 | Triple | «Potencia. Integra. Orquesta.» |
| 31.5–39 | Consultoría | «Con servicios de consultoría que te acompañan del proceso a la plataforma: gestión del cambio, pruebas automatizadas y soporte dedicado.» |
| 39–48 | Cierre | «Atmira. Modernizamos y aceleramos los servicios financieros.» + logo |

Cada palabra clave aparece en el instante exacto en que se pronuncia: los tiempos por palabra (ElevenLabs Scribe →
`src/data/words.json`) alimentan tanto las escenas (`vw("palabra")` en `src/timing.ts`) como la música/SFX
(`scripts/build-timing.py` → `src/data/timing.json`). Los cortes caen en los silencios entre frases y en el pulso de 120 BPM.

## Animación de texto
Todas las palabras usan un único movimiento limpio: *slide-up con máscara* (sin blur, sin escala, sin rebote), de modo que el texto
siempre se ve nítido. Entradas de tarjetas/chips: fundido + subida suave con ease-out. Sin rótulos pequeños en mayúsculas con tracking (aspecto "IA"): solo titulares, cifras y etiquetas en minúscula normal.

## Estructura
```
src/AtmiraFilm.tsx        timeline: 8 escenas + 7 transiciones + audio
src/theme.ts              paleta, tipografías, easings y springs
src/timing.ts / data/     tiempos globales (fuente única para vídeo y audio)
src/components/           capas (mesh/grade/grano/viñeta), Footage (stock + gradación de marca), CueText, WorldMap, Wipes…
src/scenes/S1…S8          una escena por archivo
scripts/build-timing.py   words.json → timing.json (escenas, cortes, secciones musicales, SFX)
scripts/gen-map.mjs       mapa de puntos (world-atlas + d3-geo) con Europa/Latam etiquetadas
scripts/gen-audio.py      música + SFX + mezcla final (numpy, sidechain por voz, -16 LUFS)
scripts/stills.mjs        render rápido de fotogramas sueltos para revisión
public/audio/             vo_v2_a.mp3 (voz), music.mp3, mix.wav (mezcla final)
public/footage/           clips de stock recortados + CREDITS.md
public/logos/             logos Atmira (blanco) y SIREC (azul/blanco)
```

## Comandos
```bash
npm install
npm start                      # Remotion Studio
npm run build                  # → out/atmira-film.mp4 (1080p)
node scripts/stills.mjs out/chk 3.0 12.5 40   # fotogramas sueltos (segundos globales)
node scripts/build-timing.py   words.json → timing.json (escenas, cortes, secciones musicales, SFX)
scripts/gen-map.mjs       # regenera el mapa de puntos
python3 scripts/gen-audio.py   # regenera música, SFX y mezcla
```
