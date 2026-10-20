# 04 · QA: errores detectados y corregidos

Método: render de fotogramas sueltos (`scripts/frames.mjs`) y hojas de contacto revisadas **a la vista** durante el desarrollo; avisos de `cue()`/`alignTokens` en consola del navegador (cero avisos en la versión final); medidas objetivas sobre el MP4 final (sección «Verificación del MP4»).

## Errores de imagen y diseño corregidos
| # | Error | Corrección |
|---|---|---|
| 1 | Polígonos de relleno de la seda con borde duro al dibujarse | Degradado lineal que funde los extremos de cada banda |
| 2 | «aceleramos»: los fantasmas de la estela tenían el signo cambiado y pisaban la «y» anterior | `SpeedWord` reescrito con caja `overflow:hidden` |
| 3 | La seda cruzaba el texto (escenas 2, 5, 13 y cierre) | Máscaras CSS ancladas (inferior, lateral, superior) y velo de lectura en el cierre |
| 4 | Apertura: el logotipo pasaba sobre el texto durante su desplazamiento | El desplazamiento ocurre mientras suena «atmira», antes del texto |
| 5 | Plataforma: las descripciones de las capas desbordaban la tarjeta | Tarjetas más altas/anchas y tipografía ajustada |
| 6 | «Quién»: los carriles de negocio y tecnología se activaban con ~1 s de diferencia | Nuevas señales: «familias», «Los agentes proponen», «Las personas deciden» |
| 7 | Banking: el título se partía en 4 líneas | Recompuesto en 3 líneas a 96 px |
| 8 | Insurance: `cue("core asegurador",1)` no existía y la 3.ª fila aparecía al inicio | Señales distribuidas por la frase real |
| 9 | Porsector/insurance/banking: revelados tardíos (el contenido llegaba cuando la voz ya había pasado) | Señales más tempranas y colas (`tail`) ajustadas |
| 10 | Cierre: texto ilegible sobre los planos y la seda | Planos a las esquinas, seda atenuada en la banda de texto, velo de lectura |
| 11 | Cierre: la seda final cruzaba el mensaje y `ATMIRA.COM` | Seda reducida (amp 0,55) y desplazada al borde inferior; URL subida; comprobado en el fotograma 439 de la escena |
| 12 | Transición «dark» con punto medio turbio | `Flood` reescrita: la escena saliente llega a color pleno a mitad y entra la siguiente |
| 14 | **«Cómo aceleramos»: el contenedor «Agent Factory» quedaba vacío ~10 s** (mientras suena «Spec-Driven Development… aprobación humana antes de cada fase»; detectado con `freezedetect` en el MP4, el mismo defecto del original) | Animación del método: especificaciones v1→v3 que se apilan, trazado a «Repositorios» y «CI/CD», rombo de aprobación humana; se retira antes de «Analiza». Solo se re-renderizó ese tramo (fotogramas 4530–5429) y se empalmó |
| 13 | Error de tipos `FontFaceSet.add` / manifiesto de dimensiones en S15 | Casts explícitos; `tsc --noEmit` limpio |

## Verificación del MP4 final (`entrega/atmira-corporativo-v5.mp4`)
Medido con ffprobe/ffmpeg sobre el archivo entregado:
| Comprobación | Resultado |
|---|---|
| Formato | H.264 High, 1920×1080, 25 fps, **yuv420p rango TV (BT.709)**, AAC 48 kHz estéreo 192 kb/s, 77 MB |
| Duración / fotogramas | 468,04 s (7:48) · 11.701 fotogramas, igual que `timeline.json` |
| Sonoridad integrada | **−18,6 LUFS** (LRA 2,2 LU) · pico real **−1,2 dBFS** (sin recorte) |
| Silencios | 0 de más de 1,5 s (umbral −45 dB) |
| Fotogramas negros | 0 |
| Imagen quieta ≥ 3,3 s (`freezedetect`) | 4 casos, todos reposos al final de escena con la voz terminando: 165,4 s (3,4), 211,4 s (3,7), 223,7 s (3,5), 232,6 s (4,5). Se dejan como respiración; el de 9 s en «Cómo» se corrigió (error 14) |
| Revisión visual | 54 fotogramas del MP4 (14 %, 50 % y 90 % de cada una de las 18 escenas) vistos en 3 hojas de contacto: sin texto cortado, sin solapes, cierre y cifras correctos. Las **transiciones** se revisaron en desarrollo con fotogramas sueltos, no una a una en el MP4 final |

Nota técnica: el máster de Remotion pesa 1,7 GB (crf 17 + grano) y sale en `yuvj420p` (rango completo); la entrega se recodifica (`scripts/encode_delivery.sh`) a yuv420p rango TV para evitar diferencias de contraste entre reproductores y para caber en GitHub. El máster no se versiona.

## Incidencias del proveedor de voz
- **HTTP 429** (límite de peticiones): se espaciaron las llamadas; las fallidas no consumen crédito.
- **«Free Tier access has been disabled / unusual activity (proxy/VPN)»**: ocurrió en el primer intento de `g08_09` y de `g14_16`. Es transitorio; se reintentó con el mismo texto y funcionó (anotado en `audio/registry.json`). No se intentó eludir ninguna restricción.

## Descubrimientos y decisiones
- Original con marca de agua «clideo.com» y plantilla sin rellenar en el cierre: **no reproducidos**.
- El audio original no se ha podido transcribir (sin ASR disponible): no se afirma nada sobre él.
- Duración final 7:48 frente a 8:43 del original: el contenido es denso y toda la locución se dice completa; se eliminaron las esperas muertas (~40 % del original).

## Lo que NO se ha verificado
- **Escucha.** No puedo oír audio. Acento peninsular, naturalidad, pronunciación de «ModernIzA»/«SIREC», y el equilibrio voz/música percibido quedan sin comprobar por oído. Solo hay medidas objetivas.
- Scribe transcribe el audio generado y coincide con el texto, pero eso no demuestra la calidad de la pronunciación.
- `scripts/generate_voice.mjs` (ruta con clave API) no se ha ejecutado.
