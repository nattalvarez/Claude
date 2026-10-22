# Vídeo de stock usado (v12)

Trece clips de **Mixkit** (Envato), todos marcados en su ficha como *Stock Video Free License*
(`https://mixkit.co/license/#videoFree`). Según Mixkit, esa licencia permite usarlos en proyectos comerciales y
personales sin atribución. No se pueden redistribuir ni revender como clips sueltos.

| Archivo en `public/stock/` | Escena | Clip (ficha de origen) |
|---|---|---|
| `apertura_a.mp4` | 1 · Apertura (plano nocturno) | [Hong Kong cityscape at night](https://mixkit.co/free-stock-video/hong-kong-cityscape-at-night-20215/) |
| `apertura_b.mp4` | 1 · Apertura (torre de cristal) | [Walk the outline of a building from bottom to top](https://mixkit.co/free-stock-video/walk-the-outline-of-a-building-from-bottom-to-top-33952/) |
| `modernizar.mp4` | 2 · Modernizar | [Buildings under construction, aerial view](https://mixkit.co/free-stock-video/buildings-under-construction-aerial-view-4010/) |
| `aceleracion.mp4` | 6 · Aceleración | [Long hallway in data center](https://mixkit.co/free-stock-video/long-hallway-in-data-center-23219/) |
| `donde.mp4` | 7 · Dónde aceleramos | [Reflections of digital numbers on glasses](https://mixkit.co/free-stock-video/reflections-of-digital-numbers-on-glasses-47792/) |
| `especializacion.mp4` | 10 · Especialización | [Close up of server racks lights](https://mixkit.co/free-stock-video/close-up-of-server-racks-lights-23215/) |
| `sector.mp4` | 11 · Un Digital Brain por sector | [Side by side aerial view of a city at night](https://mixkit.co/free-stock-video/side-by-side-aerial-view-of-a-city-at-night-49846/) |
| `tile_banking.mp4` | 12 · Banking | [Person entering bank details on a smartphone](https://mixkit.co/free-stock-video/person-entering-bank-details-on-a-smartphone-38481/) |
| `tile_insurance.mp4` | 13 · Insurance | [Couple seeking assistance from an advisor](https://mixkit.co/free-stock-video/couple-seeking-assistance-from-an-advisor-14977/) |
| `tile_smart.mp4` | 14 · Smart | [Open office space](https://mixkit.co/free-stock-video/open-office-space-914/) |
| `clientes.mp4` | 16 · Clientes | [Time lapse of Kuala Lumpur skyline](https://mixkit.co/free-stock-video/time-lapse-of-kuala-lumpur-skyline-30180/) |
| `cifras.mp4` | 17 · En cifras | [Singapore cityscape and harbor at night](https://mixkit.co/free-stock-video/singapore-cityscape-and-harbor-at-night-30998/) |
| `cierre.mp4` | 18 · Cierre | Flying through a thick layer of clouds · [ficha 12281](https://mixkit.co/free-stock-video/flying-through-a-thick-layer-of-clouds-12281/) |

Los clips se recodifican a 1920×1080 · 25 fps sin audio y se tratan en `src/components/Stock.tsx` (color apagado, velo azul noche, viñeta, empuje lento).

## Verificado y no verificado
- Verificado: cada ficha declara `license: https://mixkit.co/license/#videoFree` y `isAccessibleForFree`.
- No verificado: el texto íntegro de la licencia (Mixkit lo carga en una ventana que no he podido leer) ni que las URL de ficha anteriores
  (construidas a partir del título) coincidan exactamente con el slug de cada clip; el número final identifica el clip (`mixkit.co/free-stock-video/<slug>-<id>/`).
  Conviene que quien lleve lo legal en atmira lo revise antes de publicar.
- Algunos planos muestran personas (Insurance, Smart, Clientes) y rótulos diminutos de edificios en las vistas urbanas; con el tratamiento oscuro no son legibles.
- Locución (ElevenLabs) y logos de clientes siguen sujetos a lo indicado en la conversación (plan de pago de ElevenLabs y autorización de uso de los logos).
