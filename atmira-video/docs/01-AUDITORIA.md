# 01 · Auditoría del vídeo original

Material: `atmira-corporativa-video-final-v4.mp4` (H.264 1920×1080 · 25 fps · AAC 44,1 kHz estéreo · **8:42,7** · 29,9 MB).
Método: 131 fotogramas (1 cada 4 s) en 15 hojas de contacto + 17 fotogramas a resolución completa del estado final de cada diapositiva (lectura de todos los textos, cifras y logotipos) + análisis de la pista de audio.
El proyecto fuente de Remotion del original **no estaba disponible** (solo el MP4), así que se ha reconstruido a partir del vídeo.

## 1. Qué es el original
Una presentación de 17 diapositivas exportada a vídeo: fondos blancos con una pieza de arte magenta/negro/gris, tipografía Inter + logotipo serif magenta «atmira», un par de paneles oscuros (Digital Brains) y una mancha de seda magenta en portadillas. Casi todo es **estático**: texto que aparece por bloques con fundidos, y largas esperas (la diapositiva 2 dura ~40 s, la 5 ~50 s, el muro de logos ~38 s).

## 2. Bloques narrativos y mensajes (tiempos del original)
| # | Tiempo | Bloque | Mensaje |
|---|---|---|---|
| 0 | 0:00–0:08 | Logo | Logotipo atmira (disolución por píxeles) |
| 1 | 0:08–0:19 | Posicionamiento | «No hacemos todo. Hacemos esto.» → «Modernizamos y aceleramos los servicios financieros» |
| 2 | 0:19–0:58 | Modernizar | Definición + 4 beneficios (Velocidad, Conocimiento que se queda, Cumplimiento como ventaja, Datos listos para la IA) + «Innovación continua» |
| 3 | 0:58–1:20 | Arquitectura agéntica | 3 movimientos (Simplifica el presente · Habilita el futuro · Genera valor medible) |
| 4 | 1:20–1:26 | Transición | «Un enfoque que aporta dos beneficios: aceleración y especialización» |
| 5 | 1:26–2:15 | Enfoque de plataforma | Tus sistemas → ModernIzA (Aceleración/Agent Factory, Especialización/Digital Brain, Gobierno/AI Steering·Guardrails) → Arquitectura objetivo; SIREC |
| 6 | 2:15–2:39 | Aceleración | Agent Factory: «No convertimos código. Transformamos cómo se construye software.» |
| 7 | 2:40–3:10 | Dónde aceleramos | 6 frentes (legacy, core, SIREC, cloud, dominios y eventos, ingeniería) |
| 8 | 3:12–3:47 | Cómo aceleramos | Spec-Driven Development; fases Analiza/Decide/Construye/Opera; gates humanos; Digital Brain; Guardrails |
| 9 | 3:48–4:07 | Quién acelera | Agentes de negocio y de tecnología × 4 fases (16 celdas); human-in-the-loop |
| 10 | 4:08–4:35 | Especialización | Digital Brain |
| 11 | 4:36–4:58 | Un Digital Brain por sector | 3 tipos de conocimiento; Banking / Insurance / Smart |
| 12–14 | 5:00–6:35 | Banking · Insurance · Smart Digital Brain | 3 columnas × 3-4 epígrafes cada una |
| 15 | 6:36–7:27 | Experiencia en servicios financieros | 9 proyectos reales con logotipo (asisa, MoraBanc, Mutua Madrileña, BBVA, AXA, Sabadell, CaixaBank, mapfre, AEGON) |
| 16 | 7:28–8:07 | Relaciones duraderas | Muro de 78 logotipos de clientes |
| 17 | 8:08–8:40 | Cierre | Cifras (20 años · 820 especialistas · 70 M€ · +40 clientes activos · 2 HQ Europa y Latam · +7 hubs) + «Modernizamos y aceleramos los servicios financieros. Y la capa agéntica que construimos contigo es tuya.» |

La hipótesis de estructura del encargo (12 bloques) encaja con el contenido real; únicamente hubo que **dividir** «Capacidades y procesos» (arquitectura agéntica + plataforma + dónde aceleramos) y **añadir** los bloques «Cómo» y «Quién acelera», que son el corazón de la Agent Factory.

## 3. Problemas detectados
**Imagen**
- **Marca de agua «clideo.com»** (editor online gratuito) grabada en *todas* las diapositivas. No se reutiliza ningún fotograma con ella: logotipos y arte se han recuperado recortando zonas limpias.
- **Plantilla sin rellenar** en el cierre: «[Nombre y cargo] · [email] · [teléfono] · atmira.com · Madrid · Barcelona · [otras sedes]». No se muestra en la nueva versión (solo `atmira.com`, que sí figura sin corchetes); hay que facilitar los datos reales para añadirlos.
- Textos de 8-10 px (≈ 16-20 px a 1080p) en las diapositivas 5, 8, 9, 12-15; esquemas con cajas diminutas y flechas.
- Muro de 78 logotipos grises en un mosaico minúsculo (≈ 90 px de ancho cada uno).
- Repetición: «Modernizamos y aceleramos los servicios financieros» abre y cierra; «Digital Brain», «Agent Factory» y «Guardrails» se explican 3-4 veces.
- Transiciones: fundidos simples; un único cambio de estilo brusco (paneles oscuros a 5:00 y 6:36 sin transición); final con fundido a gris (8:40) y sin resolución.
- Las diapositivas 12-14 son tres copias de la misma plantilla con otro título.
- El logo aparece en 3 posiciones y tamaños distintos (centro, arriba derecha, arriba izquierda sobre panel oscuro).

**Ritmo**: ~40 % del metraje es espera sin cambio visual (p. ej. 3:12–3:30 con el contenedor vacío mientras se «construye»).

## 4. Audio
- Hay pista de audio continua: nivel medio −18,0 dB, pico −1,5 dB, **sin silencios > 1,5 s** (`silencedetect -40 dB`), con estructura espectral de voz (formantes y armónicos < 4 kHz) sobre una base de banda ancha.
- **No he podido transcribirla**: en el entorno no hay ASR local (los modelos de Whisper/Vosk no son descargables: HuggingFace y similares devuelven error de red) y el conector de ElevenLabs no ofrece subida de archivos locales (`creative_create_asset_upload` no está disponible). Por tanto **no afirmo nada sobre el contenido narrado ni su sincronía con la imagen**; el nuevo guion se ha escrito a partir del texto en pantalla.
- Música: no se puede aislar ni verificar licencia. La nueva banda sonora es **original** (sintetizada).

## 5. Estrategia visual por bloque (resumen)
Detalle en `02-DIRECCION-DE-ARTE.md`. Idea común: la **seda** (hilos finos magenta en 3D real) como lenguaje de marca que se enmaraña y se peina («complejidad → orden»), tipografía editorial Inter, un color de acento y mucho blanco; planos oscuros solo para Digital Brains y el clímax.
