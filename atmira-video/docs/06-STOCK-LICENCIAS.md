# Vídeo de stock usado (v11)

Seis clips de **Mixkit** (Envato), todos marcados en su ficha como *Stock Video Free License*
(`https://mixkit.co/license/#videoFree`). Según Mixkit, esa licencia permite usarlos en proyectos comerciales y
personales sin atribución. No se pueden redistribuir ni revender como clips sueltos.

| Archivo en `public/stock/` | Escena | Clip (ficha de origen) | Uso |
|---|---|---|---|
| `apertura.mp4` | 1 · Apertura | [Luminous networking shapes](https://mixkit.co/free-stock-video/luminous-networking-shapes-26778/) | Fondo a pantalla completa, monocromo oscuro, bajo la seda de marca |
| `aceleracion.mp4` | 6 · Aceleración | [Light beams breaking into points of light](https://mixkit.co/free-stock-video/light-beams-breaking-into-points-of-light-31536/) | Fondo a pantalla completa |
| `especializacion.mp4` | 10 · Especialización | [High tech circuit board with processor](https://mixkit.co/free-stock-video/high-tech-circuit-board-with-processor-47051/) | Dentro del portal oscuro, bajo los hilos |
| `sector.mp4` | 11 · Un Digital Brain por sector | [Side by side aerial view of a city at night](https://mixkit.co/free-stock-video/side-by-side-aerial-view-of-a-city-at-night-49846/) | Fondo de la introducción (primeros 11 s) |
| `cifras.mp4` | 17 · En cifras | [World map, pan shot](https://mixkit.co/free-stock-video/world-map-pan-shot-21618/) | Fondo a pantalla completa |
| `cierre.mp4` | 18 · Cierre | [Video of the Earth slowly spinning on its axis](https://mixkit.co/free-stock-video/video-of-the-earth-slowly-spinning-on-its-axis-29351/) | Fondo del clímax y del frente luminoso |

Los clips se recodifican a 1920×1080 · 25 fps sin audio, se pasan a escala de grises y se oscurecen (`src/components/Stock.tsx`).

## Verificado y no verificado
- Verificado: cada ficha declara `license: https://mixkit.co/license/#videoFree` y `isAccessibleForFree`.
- No verificado: el texto íntegro de la licencia (Mixkit lo carga en una ventana que no he podido leer). Conviene que quien
  lleve lo legal en atmira lo revise antes de publicar.
- El clip de la ciudad (escena 11) muestra rótulos diminutos de edificios en la imagen original; con el tratamiento
  oscuro y monocromo no son legibles. Los clips de ciudad con marcas claras se descartaron.
- Locución (ElevenLabs) y logos de clientes siguen sujetos a lo indicado en la conversación (plan de pago de ElevenLabs y
  autorización de uso de los logos).
