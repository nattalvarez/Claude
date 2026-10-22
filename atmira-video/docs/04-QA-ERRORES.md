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


---

# v6 · Rediseño «sin cajas» (una sola voz)

Petición: parecerse más al vídeo de referencia (menos «presentación»), manteniendo el ritmo y el diseño propios, y quitar las cajas alrededor de los textos. La locución sigue siendo **una sola voz** (Alejandro Castellanos, la misma de v5; el intento de doble voz quedó pendiente por falta de créditos, ver `05-V6-PENDIENTE.md`).

## Cambios
- **Sin cajas**: se eliminaron tarjetas, contenedores tintados, paneles redondeados y sombras en Agéntica, Dos beneficios (ahora dos medias pantallas a sangre), Plataforma, Cómo, Quién, Un Digital Brain por sector (tres bandas verticales), Experiencia (índice en banda lateral) y Especialización (portal a sangre). El texto va abierto, con filetes y numerales.
- **Más cinético**: titulares con peso 600–700; «Qué gana el negocio» como plano magenta a pantalla completa con las cuatro ideas en palabras gigantes; «Innovación continua» a 148 px.
- **Capas de sector**: Banking, Insurance y Smart muestran una capa cada vez (antes un muro de texto de 12 epígrafes); mientras suena la presentación del cerebro el texto se lee con resaltado palabra a palabra.
- **Línea de progreso** del vídeo abajo (como la referencia); se retira en el clímax del cierre.
- Componentes nuevos: `src/components/Kinetic.tsx`.

## Errores detectados en la revisión del MP4 v6 y corregidos
| Error | Corrección |
|---|---|
| Insurance: el texto de presentación se veía casi negro sobre fondo ciruela (el resaltado mezclaba colores `rgba()` como hex) | Colores hex (`#6A4B5E` → `#FFF`) |
| Dónde aceleramos: la fila activa aún llevaba una «caja» rosa | Solo barra lateral |
Se re-renderizaron solo esos dos tramos (fotogramas 3700–4599 y 7900–8619) y se empalmaron (`scripts/splice_fixes.sh`).

## Verificación del MP4 v6 (`entrega/atmira-corporativo-v6.mp4`)
| Comprobación | Resultado |
|---|---|
| Formato | H.264, 1920×1080, 25 fps, yuv420p rango TV, AAC 48 kHz, ≈ 75 MB |
| Duración / fotogramas | 468,04 s · 11.701 fotogramas |
| Sonoridad | −18,6 LUFS (LRA 2,2) · pico real −1,2 dBFS · sin silencios > 1,5 s · sin fotogramas negros |
| Imagen quieta ≥ 3,3 s | 6 casos de 3,4–4,4 s (82,6 · 163,6 · 166,9 · 183,6 · 211,3 · 221,6 s), todos reposos con la voz hablando |
| Revisión visual | 54 fotogramas (14 %, 50 %, 90 % de cada una de las 18 escenas) en 3 hojas de contacto |
| No verificado | Audio no escuchado (igual que en v5); transiciones no revisadas una a una |

## v7 · Doble voz y correcciones de escenas
| Error / petición | Corrección |
|---|---|
| Fantasmas numéricos en «Modernizar permite evolucionar» (el 2 quedaba tapado) | Eliminados |
| «Beneficios al negocio» sin el diseño de planos 3D | Restaurado el de v5 |
| Plataforma: palabra «Moderniza» en texto, cuadrado del logo SIREC, esquema muy en bloque | Logotipo ModernIzA, logo SIREC sin cuadrado en caja propia, esquema con acordeón que sigue a la voz y conductos animados |
| Dónde aceleramos: lo resaltado no coincidía con la voz | Filas ligadas a las palabras de la voz (`cue`); columna de títulos ensanchada |
| Cómo / Quién aceleramos: dispersos, agentes de negocio y tecnología no convivían | De nuevo en cajas; ambas familias en pantalla a la vez |
| Un Digital Brain por sector: columnas 01/02/03 cortadas por la izquierda | Columnas desde x = 120 px (margen común) |
| Insurance: voz desincronizada | Pantalla en el mismo orden que la voz (core → suscripción → siniestros → distribución → vida/generales/salud → capas normativas → core asegurador); texto del resaltado que salía azul (`#fff` de 3 dígitos mal interpretado) y segmento que desbordaba por la derecha |
| Clientes: cortado y sin voz | Muro de logos arranca con «Estas son…», 6 secuencias de 34 fotogramas, escena 322 fotogramas; tras la voz (≈ 7 s) quedan ≈ 6 s de logos con solo música |
| Locución | Dos voces (Alejandro / Francesca), 56 tramos, `scripts/build_audio_v6.mjs` (alineado guion↔Scribe, −18 LUFS por tramo, huecos 0,2–0,45 s) |
| «SIREC» con el acento en la 2ª sílaba | El texto enviado al TTS es «Sírec» (SÍ-rec); en pantalla sigue «SIREC». **No oído**: Scribe lo transcribe «CREC», conviene confirmarlo de oído |

Notas de proceso: el contenedor se reinició varias veces y mató renders largos; el render pasa a 16 tramos reanudables (`render_segments.sh`, escribe `part_*` y renombra al acabar) y el audio se mezcla con `scripts/mix_audio.py` (música ×0,9 + bloques de voz en su fotograma; diferencia RMS con el audio de Remotion 2·10⁻⁵) en lugar de renderizar 11.864 fotogramas solo para el audio. La transcripción Scribe de los 56 tramos concatenados costó ≈ 2.670 créditos.

## Verificación del MP4 v7 (`entrega/atmira-corporativo-v7.mp4`)
| Comprobación | Resultado |
|---|---|
| Formato | H.264, 1920×1080, 25 fps, yuv420p rango TV, AAC 48 kHz, ≈ 77 MB |
| Duración / fotogramas | 474,56 s · 11.864 fotogramas |
| Sonoridad | −18,7 LUFS (LRA 2,5) · pico real −1,9 dBFS · sin silencios > 2,5 s |
| Imagen quieta ≥ 4 s | ≈ 8 casos de 4–5,7 s (p. ej. 85,0 · 160,0 · 170,6 · 191,3 · 220,6 s), reposos con la voz hablando |
| Revisión visual | 54 fotogramas (22 %, 55 %, 85 % de cada escena) en 3 hojas de contacto: sin cortes de margen ni texto ilegible |
| No verificado | Audio no escuchado (pronunciación de «Sírec», entonación y pausas entre voces); transiciones no revisadas una a una |

## v8 · Voz femenina, música, Clientes y cierre
| Petición | Cambio |
|---|---|
| Voz femenina poco dinámica y sin fuerza | Francesca Dari → **Carmen – Bold and Magnetic** (`iHGx33VgO2KQ1Fdw6noG`, es-peninsular, «punchy, charismatic») con la etiqueta de dirección `[confident]` al inicio de cada tramo (no se pronuncia: 3,12 s con etiqueta frente a 3,20 s sin ella). Se regeneraron los 30 tramos femeninos; los masculinos (Alejandro) no cambian. La elección es por la descripción de la voz y por mediciones básicas (rango dinámico de la frase de prueba); **no se ha podido escuchar** |
| Música más «cañera», estilo de la primera referencia | `scripts/synth_music.py` reescrito: 124 bpm (tempo medido en el vídeo original, pulso de bombo con fuerza 0,71 en la referencia), bombo a negro, palmas en 2 y 4, hats a contratiempo, bajo a contratiempo con sidechain, stabs, arpegio con eco, melodía en frases de 4 compases, redoble + riser antes de cada corte e impacto al entrar; rejilla reiniciada en cada escena. Voz 9 dB por encima de la música mientras habla (música −9 dB armonía / −5 dB percusión bajo la voz). Mezcla final −16,7 LUFS (referencia −16,0) |
| Clientes: logos muy rápidos y poca explicación | Locución ampliada: «Nuestro mercado es España, con expansión en Europa y Latinoamérica» + «Banca, seguros, retail y servicios: estas son algunas de las compañías con las que trabajamos» + «Compañías que ya modernizan y aceleran con atmira». Pantalla: España → Europa → Latinoamérica en grande, sincronizado con la voz, que luego se reduce a línea de contexto; 6 secuencias de logos de 44 fotogramas (antes 34) durante la locución. Escena de 21 s (antes 13) |
| Final con transición «de pintura» | Clímax del cierre rehecho: haz de luz horizontal que se abre como rendija (magenta con logo blanco) y barrido diagonal con filo luminoso hacia el blanco de marca; sin formas orgánicas |

Notas de proceso: transcripción de los tramos nuevos con Scribe sobre cada nodo TTS (0 créditos; devuelve el texto con alineación, incluida la etiqueta como pseudo-palabra de 0–0,17 s que se descarta); el montaje (`scripts/build_audio_v8.mjs`) mezcla los tramos nuevos (`audio/raw_v8`) con los masculinos de v7 (`audio/raw_v6`). Gasto de créditos de voz en esta ronda ≈ 3.900 (audiciones incluidas).

## Verificación del MP4 v8 (`entrega/atmira-corporativo-v8.mp4`)
| Comprobación | Resultado |
|---|---|
| Formato | H.264, 1920×1080, 25 fps, yuv420p rango TV, AAC 48 kHz, ≈ 78,5 MB |
| Duración / fotogramas | 483,92 s · 12.098 fotogramas |
| Sonoridad | −16,8 LUFS (LRA 3,0; referencia original −15,9) · pico real −1,4 dBFS · sin silencios > 2 s |
| Voz sobre música | voz ≈ 9 dB por encima de la música mientras habla (medido en la mezcla sin limitador) |
| Imagen quieta ≥ 4,5 s | 7 casos de 4,7–10 s, todos con la voz hablando; el más largo (236,8 s, 10 s) es el final de «Quién acelera» con todas las cajas en pantalla |
| Revisión visual | 54 fotogramas (25 %, 60 %, 88 % de cada escena) en 3 hojas de contacto: sin cortes de margen ni solapes salvo los cruces de transición esperados |
| No verificado | **Audio no escuchado** (voz nueva, pronunciación de «Sírec», pausas entre voces, mezcla con la música); transiciones no revisadas una a una |

## v9 · Voz peninsular, música sin cortes y Clientes con mercados
| Petición | Cambio |
|---|---|
| La voz de mujer debe ser de España (península); Carmen no lo era | Carmen (ficha sin etiqueta de acento) → **Natalia – Direct and Polished** (`jQrhxsqzG6CPKo3ll0w9`, etiqueta ElevenLabs `es-peninsular`, «neutral, high-standard Castilian accent», segura y directa) con `[confident]`. Se regeneraron los 31 tramos femeninos. Se descartaron Gala (más baja de nivel y estilo «influencer») y las voces sin etiqueta de acento. No se ha podido escuchar: la elección es por etiqueta y descripción |
| Los cortes de la música se notan mucho | `synth_music.py`: el corte musical cae en mitad del solape de cada transición; cada escena dura un número entero de compases (tempo por escena 112–136 bpm, normalmente ±2 % de 124); la rejilla ya no se reinicia en cada corte y la progresión armónica continúa (contador global de compases); se eliminan el impacto grave y el riser de ruido de cada entrada (queda un platillo suave) y el relleno pasa a ser un solo pulso de semicorcheas suaves. Saltos de nivel de la música en los 17 cortes: ≤ 1,4 dB (salvo la entrada inicial) |
| Clientes: la parte de mercados se corta y no está locutada | **Corte visual**: «Latinoamérica» se salía por el borde derecho (fila de 3 mercados demasiado ancha) → tamaños 124/92/92 px y arrow 56 px, todo dentro del margen de 120 px. **Locución y guion nuevos** (5 tramos, M/F alternos): «Relaciones duraderas con nuestros clientes.» · «Nuestro mercado principal es España: aquí acompañamos a bancos y aseguradoras en su modernización.» · «Y desde España nos expandimos por Europa y Latinoamérica, llevando el mismo método y la misma capa agéntica.» · «Banca, seguros, retail y servicios: estas son algunas de las compañías con las que trabajamos.» · «Compañías que ya modernizan y aceleran con atmira.» En pantalla cada mercado lleva su rótulo (mercado principal / expansión) y su explicación (con bancos y aseguradoras, en su modernización · el mismo método · la misma capa agéntica) y permanece hasta que empiezan los logos. Escena de 29,8 s |

Verificación del MP4 v9 (`entrega/atmira-corporativo-v9.mp4`): H.264 1920×1080 25 fps yuv420p, AAC 48 kHz, 78 MB · 486,84 s · 12.171 fotogramas · −16,9 LUFS (LRA 3,0), pico real −1,3 dBFS · sin silencios > 2 s · 7 reposos de 4,6–10 s con la voz hablando · escenas revisadas fotograma a fotograma en Clientes; el resto con la misma revisión de v8. **No verificado**: audio no escuchado (voz, pronunciación de «Sírec», mezcla con la música).

## v10 · Orden Sector → Ámbitos → Tecnología y mensaje único en Clientes
| Petición | Cambio |
|---|---|
| En los Digital Brain, voz y pantalla deben seguir el orden sector → ámbitos → tecnología y arquitectura | **Contenido** (`content.ts`): las tres capas pasan a «01 · Sector», «02 · Ámbitos de negocio» (en Smart, «ámbitos de solución») y «03 · Tecnología y arquitectura»; también en leyendas, cabeceras de columna y en la tabla de Casos. **Locución** (`audio/script_v10.json`, 10 tramos regenerados: b10b_1, b11_1, b11_2, b12_1–4, b13_3–5): intro «por sector» («el sector, los ámbitos de negocio, y la tecnología y arquitectura»), Banking con «Primero, el sector… Después, los ámbitos de negocio… Y por último, tecnología y arquitectura», e Insurance y Smart divididos en tres tramos (sector / ámbitos / tecnología) con voces alternas. **Pantalla**: S11 enlaza las tres columnas con «el sector», «los ámbitos de negocio» y «la tecnología»; S12 muestra las capas una a una con «Primero / Después / Y por último»; S13 (Insurance) y S14 (Smart) se reordenan: bloque de sector arriba, ámbitos debajo y, al llegar a «tecnología y arquitectura», el bloque 03 ocupa la escena (Insurance) o se añade como tercera fila (Smart). Error corregido de paso: texto «Karaoke» en azul en Insurance por usar un hex de 3 cifras (`#fff`) → siempre hex de 6 cifras |
| Clientes: un único mensaje potente para los tres mercados, no uno por mercado | S16: se elimina la correspondencia mercado ↔ frase. Bajo la fila España → Europa → Latinoamérica aparece un bloque propio, «EN LOS TRES MERCADOS / **El mismo método. La misma capa agéntica.**» (118 px, la segunda línea en magenta, entra con «mismo método» / «misma capa» de la voz) y se retira cuando arrancan los logos. La locución ya lo decía en una sola frase («…llevando el mismo método y la misma capa agéntica») |

Notas de proceso: Scribe sobre cada nodo TTS (0 créditos). `scripts/build_audio_v10.mjs` (raw/transcripts con prioridad v10 → v9 → v6). Gasto de créditos de voz en esta ronda ≈ 1.450 (10 tramos). Escenas revisadas por fotogramas: por sector, Banking, Insurance, Smart y Clientes (sin avisos de cue; cobertura en ámbito, orden y márgenes).

Verificación del MP4 v10 (`entrega/atmira-corporativo-v10.mp4`): H.264 1920×1080 25 fps yuv420p, AAC 48 kHz, 83 MB · 516,76 s · 12.919 fotogramas · −16,8 LUFS (LRA 2,9), pico real −1,4 dBFS · sin silencios > 2 s · 6 reposos de 4,6–10 s con la voz hablando · hojas de contacto del MP4 final en por sector, Banking, Insurance y Smart. **No verificado**: audio no escuchado (voz, pronunciación de «Sírec», mezcla con la música).
