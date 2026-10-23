# SIREC — spot inspiracional (Remotion)

Spot de ≤ 1 min (50,5 s · 1920×1080 · 30 fps) sobre **recobro y ciclo de crédito**, con vídeo de stock real del mundo acuático,
voz en off de ElevenLabs y música/SFX sintetizados. Concepto: *«el agua siempre encuentra su camino»* (el ajolote de SIREC es un animal acuático).

## Guion (voz: ElevenLabs «Miguel – Warm, Confident, Inspiring», `eleven_v4`; «SIREC» se fuerza a SÍ-rec con IPA `/ˈsiɾek/`)
| Plano | Locución | Imagen |
|---|---|---|
| 1 | El agua nunca se detiene. | rayos de luz bajo el agua |
| 2 | Rodea. Avanza. Y siempre encuentra su camino. | río entre rocas |
| 3–4 | Un crédito también es un ciclo. Nace… fluye… y debe volver. | lluvia sobre el lago → río aéreo + anillo del ciclo |
| 5 | Cuando la corriente se complica, hace falta anticiparse. | ola rompiendo |
| 6–8 | Anticipar el riesgo. Acompañar cada paso. Recuperar, con inteligencia. | horizonte · delfines · ola en la arena (Anticipación → Seguimiento → Recobro) |
| 9–10 | SIREC reúne a los agentes de IA, propios y de terceros, en una sola corriente. Orquestados. Seguros. Con cumplimiento. | banco de peces + corrientes que se fusionan → medusa |
| 11 | Más de 15 clientes, en Europa y Latinoamérica, ya recuperan con SIREC. | océano (Atlántico) + mapa de puntos Europa/Latam |
| 12 | SIREC. Deja que el recobro fluya. | amanecer + logo con ondas |

Contenido tomado de los vídeos de SIREC: «Inteligencia aplicada al ciclo de riesgo de crédito — anticipación, seguimiento y recobro
orquestados con agentes propios y de terceros», SIREC Agent Fabric (seguridad, cumplimiento) y «+15 clientes en Europa y Latinoamérica».

## Cómo está hecho
- `scripts/build-timing.py`: de los tiempos por palabra (`src/data/words.json`, ElevenLabs Scribe) calcula cortes (en los silencios entre frases),
  planos, secciones musicales y cues de SFX → `src/data/timing.json`. `src/timing.ts` usa las mismas búsquedas (`vw("palabra")`).
- `src/components/ShotTrack.tsx`: pista de vídeo con fundidos encadenados y gradación suave a la paleta de marca.
- Texto: titulares en serif (Instrument Serif) con una palabra cursiva; revelado único *slide-up con máscara* (nítido, sin blur ni rebotes).
  Sin rótulos pequeños en mayúsculas ni tipografía monoespaciada.
- `scripts/gen-audio.py`: música (D mayor, piano, cuerdas, 90 BPM) + ambiente de agua + SFX acuáticos + mezcla con sidechain de la voz a −16 LUFS.

## Comandos
```bash
npm install
npm start                                  # Remotion Studio
npm run build                              # → out/sirec-spot.mp4
node scripts/stills.mjs out/chk 5.2 30.4   # fotogramas sueltos (segundos globales)
python3 scripts/build-timing.py            # words.json → timing.json
python3 scripts/gen-audio.py               # música + SFX + mezcla
```
Clips de stock y licencia: `public/footage/CREDITS.md`.
