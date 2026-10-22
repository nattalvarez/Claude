# Atmira — vídeo corporativo (48 s) · Remotion

Vídeo corporativo B2B de Atmira (banca y seguros) con voz en off de ElevenLabs, música/SFX sintetizados y cierre con el logo de Atmira.
1920×1080 · 30 fps · H.264 + AAC · paleta de marca `#3365A2` `#233456` `#2ABBCE` `#DDE7F4`.

## Guion (voz: ElevenLabs «Santiago – Deep Executive», `eleven_v4`)
| t (s) | Escena | Locución |
|---|---|---|
| 0.0–3.5 | Gancho | «Los servicios financieros no esperan.» |
| 3.5–10 | Atmira | «En Atmira modernizamos y aceleramos la banca y los seguros, para que la tecnología impulse tu negocio.» |
| 10–15.5 | Cifras | «20 años. 820 especialistas. Más de 40 clientes activos.» (+ 70 M€ de cifra de negocio en pantalla) |
| 15.5–21 | Mapa | «Con sede en Europa y Latinoamérica, y más de 7 hubs, estamos donde tu negocio nos necesita.» (Europa y Latam resaltadas) |
| 21–29.5 | SIREC | «Nuestra plataforma SIREC orquesta el ciclo completo de tu negocio, y SIREC Agent Fabric integra la inteligencia artificial con seguridad y cumplimiento.» |
| 29.5–32 | Triple | «Potencia. Integra. Orquesta.» |
| 32–39.5 | Consultoría | «Con servicios de consultoría que te acompañan del proceso a la plataforma: gestión del cambio, pruebas automatizadas y soporte dedicado.» |
| 39.5–48 | Cierre | «Atmira. Modernizamos y aceleramos los servicios financieros.» + logo |

Todos los cortes caen en pulso (120 BPM) y cada palabra clave aparece en el instante exacto en que se pronuncia
(tiempos por palabra obtenidos con ElevenLabs Scribe → `src/data/timing.json`).

## Estructura
```
src/AtmiraFilm.tsx        timeline: 8 escenas + 7 transiciones + audio
src/theme.ts              paleta, tipografías, easings y springs
src/timing.ts / data/     tiempos globales (fuente única para vídeo y audio)
src/components/           capas (mesh/grade/grano/viñeta), CueText, Skyline, GlassLattice, WorldMap, Wipes…
src/scenes/S1…S8          una escena por archivo
scripts/gen-map.mjs       mapa de puntos (world-atlas + d3-geo) con Europa/Latam etiquetadas
scripts/gen-audio.py      música + SFX + mezcla final (numpy, sidechain por voz, -16 LUFS)
scripts/stills.mjs        render rápido de fotogramas sueltos para revisión
public/audio/             vo_take1.mp3 (voz), music.wav/mp3, sfx.wav, mix.wav (mezcla final)
public/logos/             logos Atmira (blanco) y SIREC (azul/blanco)
```

## Comandos
```bash
npm install
npm start                      # Remotion Studio
npm run build                  # → out/atmira-film.mp4 (1080p)
node scripts/stills.mjs out/chk 3.0 12.5 40   # fotogramas sueltos (segundos globales)
node scripts/gen-map.mjs       # regenera el mapa de puntos
python3 scripts/gen-audio.py   # regenera música, SFX y mezcla
```
