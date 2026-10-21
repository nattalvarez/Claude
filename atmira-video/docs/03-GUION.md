# 03 · Guion final y locución

Texto **exactamente igual** al enviado a ElevenLabs (`audio/script.json`, fuente única). Todo el contenido procede del texto en pantalla del vídeo original; no se han añadido datos, capacidades ni clientes. Las cifras se dicen en palabras para evitar lecturas ambiguas.

## Voz y parámetros

> **v9: doble voz.** Alejandro Castellanos (M, `WWVK6dYMrl0ZHnHT7cRj`) y Natalia – Direct and Polished (F, `jQrhxsqzG6CPKo3ll0w9`, castellano, con `[confident]`; en v8 Carmen `iHGx33VgO2KQ1Fdw6noG` y en v7 Francesca Dari `S7bOxFEwwuJG764dSujP`), modelo `eleven_v4`; 58 tramos en `audio/script_v9.json` (reparto por frase y voz). «SIREC» se envía como «Sírec» y «ModernIzA» como «Moderniza». Lo que sigue describe la voz única de v5/v6.

| Parámetro | Valor |
|---|---|
| Voz | Alejandro Castellanos (`WWVK6dYMrl0ZHnHT7cRj`), tomada de `creative_list_voices` (etiqueta de acento: español peninsular) |
| Modelo | `eleven_v4` |
| Vía | Conector ElevenLabs de la sesión (herramientas `creative_generate_speech` y `creative_transcribe_audio`), sin clave API en el repositorio |
| Ajustes | Los de la voz por defecto del conector; no se han fijado `stability`/`similarity` a mano ni se han usado etiquetas de interpretación (las pausas se escriben con puntuación y `…`) |
| Un solo flujo | `RalSn6lzvJ0lk7E50e5p` (identificadores de nodos/generaciones en `audio/registry.json`) |
| Tiempos | Scribe (`creative_transcribe_audio`) con marcas por palabra → `audio/transcripts/*.json` |
| Normalización | −18 LUFS por bloque (`scripts/build_audio.mjs`), ganancia aplicada en `src/data/audio.json` |

Los clips se generaron agrupados (varias escenas por llamada) para mantener la entonación; `build_audio.mjs` los corta por el silencio que separa las escenas en `public/audio/voz/<bloque>.mp3`. Los MP3 originales de ElevenLabs están en `audio/raw/`.

## Pronunciación

- **atmira**: tal cual (at-MI-ra)
- **ModernIzA**: se envía como «ModernIzA»; en pantalla se mantiene la grafía oficial
- **Agent Factory / Digital Brain / Banking / Insurance / Smart / Guardrails / AI Steering**: anglicismos corporativos: se dejan en inglés dentro de frase española
- **SIREC**: tal cual; en pantalla «SIREC»
- **Temenos / Mambu / SISnet**: tal cual

## Guion por bloque

| Bloque | Duración de voz | Archivo |
|---|---|---|
| `b01_apertura` | 7.0 s | `public/audio/voz/b01_apertura.mp3` |
| `b02_modernizar` | 33.0 s | `public/audio/voz/b02_modernizar.mp3` |
| `b03_agentica` | 23.7 s | `public/audio/voz/b03_agentica.mp3` |
| `b04_beneficios` | 5.6 s | `public/audio/voz/b04_beneficios.mp3` |
| `b05_plataforma` | 42.4 s | `public/audio/voz/b05_plataforma.mp3` |
| `b06_agentfactory` | 21.1 s | `public/audio/voz/b06_agentfactory.mp3` |
| `b07_donde` | 30.5 s | `public/audio/voz/b07_donde.mp3` |
| `b08_como` | 29.7 s | `public/audio/voz/b08_como.mp3` |
| `b09_quien` | 19.1 s | `public/audio/voz/b09_quien.mp3` |
| `b10a_especializacion` | 18.7 s | `public/audio/voz/b10a_especializacion.mp3` |
| `b10b_porsector` | 22.3 s | `public/audio/voz/b10b_porsector.mp3` |
| `b11_banking` | 30.2 s | `public/audio/voz/b11_banking.mp3` |
| `b12_insurance` | 22.3 s | `public/audio/voz/b12_insurance.mp3` |
| `b13_smart` | 19.0 s | `public/audio/voz/b13_smart.mp3` |
| `b14_casos` | 41.9 s | `public/audio/voz/b14_casos.mp3` |
| `b15_clientes` | 6.2 s | `public/audio/voz/b15_clientes.mp3` |
| `b16_cifras` | 15.0 s | `public/audio/voz/b16_cifras.mp3` |
| `b17_cierre` | 8.1 s | `public/audio/voz/b17_cierre.mp3` |

Total de locución: 6:36 (396 s) dentro de un vídeo de 7:48.

### b01_apertura

atmira. No hacemos todo. Hacemos esto. … Modernizamos y aceleramos los servicios financieros.

### b02_modernizar

Modernizar es renovar lo que sostiene el negocio, dominio a dominio y de forma continua. Es convertir la tecnología en valor de negocio cada día: una transformación controlada, liderada por la arquitectura, que preserva el conocimiento crítico del negocio mientras reduce la deuda técnica. … ¿Qué gana el negocio? Velocidad. Conocimiento que se queda. Cumplimiento como ventaja. Y datos listos para la IA. … Innovación continua: la base para crecer, cumplir con el regulador e incorporar IA en cada dominio.

### b03_agentica

Modernizar permite evolucionar hacia una arquitectura agéntica: el paso que conecta los sistemas actuales con la arquitectura objetivo, en tres movimientos. Simplifica el presente, reduciendo la complejidad de los sistemas legacy. Habilita el futuro, con arquitecturas modulares y agénticas que aceleran la innovación. Y genera valor medible, con gobierno y control regulatorio.

### b04_beneficios

Un enfoque que aporta dos beneficios al negocio: aceleración, y especialización.

### b05_plataforma

Lo hacemos con un enfoque de plataforma: servicios y soluciones que conectan tus sistemas con tu arquitectura objetivo. En el centro, ModernIzA, con tres capas. Aceleración, con la Agent Factory: agentes que analizan, deciden, construyen y operan, con una persona que aprueba en cada fase. Especialización, con el Digital Brain: el conocimiento de cada sector, preservado y ampliado con cada proyecto. Y gobierno: AI Steering fija dirección y límites, y los Guardrails ponen puntos de control sobre lo que hacen los agentes. … Además, SIREC: inteligencia aplicada al ciclo de riesgo de crédito, con más de quince clientes en Europa y Latinoamérica.

### b06_agentfactory

Aceleración, habilitada por la Agent Factory. No convertimos código: transformamos cómo se construye software. La Agent Factory industrializa la modernización del software, con la arquitectura como guía, agentes que aceleran la ejecución y personas que gobiernan las decisiones. Una capacidad escalable, que forma parte de tu capa agéntica. …

### b07_donde

¿Dónde aceleramos? Eficientamos e industrializamos. Transformamos los sistemas críticos en arquitecturas modernas, flexibles y escalables, sin interrumpir el negocio. Seis frentes: el legacy y el core financiero y asegurador, conviviendo con Temenos, Mambu o SISnet mientras se migra; el ciclo de riesgo de crédito con SIREC; las arquitecturas cloud; el diseño por dominios y eventos; y la ingeniería y automatización continua. Los agentes ejecutan; la arquitectura marca el camino.

### b08_como

¿Cómo aceleramos? Con el mismo método en todos los frentes: Spec-Driven Development. Cada cambio avanza sobre especificaciones versionadas en tus repositorios y en tu CI/CD, con una aprobación humana antes de cada fase. Analiza. Decide. Construye. Opera. Un arnés de orquestación asigna tareas, versiona artefactos y deja traza de cada paso. El Digital Brain aporta contexto y consolida lo aprendido, y los Guardrails acotan el perímetro. …

### b09_quien

¿Y quién acelera? Agentes expertos en cada fase: familias de agentes de negocio y de tecnología que cubren Analiza, Decide, Construye y Opera, dentro de un arnés que delimita el perímetro. Los agentes proponen, generan y dejan evidencia trazable. Las personas deciden en cada punto de aprobación.

### b10a_especializacion

Especialización, habilitada por el Digital Brain. El conocimiento del negocio es lo que convierte la tecnología en resultados. El Digital Brain lo hace posible: reúne el conocimiento de cada dominio de negocio y el conocimiento tecnológico aplicado a él, para modernizar dominio a dominio. …

### b10b_porsector

Un Digital Brain por sector. Cada uno reúne tres tipos de conocimiento: a quién servimos, qué hace el negocio, y con qué tecnología y arquitectura funciona. Crece con cada proyecto, y es la base para acelerar con IA la modernización de cada dominio. Un marco, diferentes cerebros: Banking, Insurance y Smart Digital Brain.

### b11_banking

Banking Digital Brain: el cerebro de la banca agéntica. Activamos la banca agéntica modernizando con IA los dominios de negocio del banco: del core al recobro inteligente y a la relación con el cliente, en retail, privada y corporativa. Tres capas de conocimiento: los segmentos de cliente; los dominios de negocio, desde Credit Risk and Collections con SIREC hasta Core and Payments; y la tecnología y arquitectura, del core legacy a las APIs y Open Finance. …

### b12_insurance

Insurance Digital Brain: el cerebro de los seguros inteligentes. Activamos los seguros inteligentes modernizando con IA los dominios de negocio de la aseguradora: del core a la suscripción, los siniestros y la distribución, en vida, generales y salud. Con capas normativas y de país, como Solvencia II, RGPD y DORA, sobre el core asegurador. …

### b13_smart

Smart Digital Brains: brains en construcción. Llevamos nuestra capacidad tecnológica a otros sectores y, con cada cliente, sumamos conocimiento para que evolucionen a Digital Brains propios. Retail y servicios. Industria, energía y utilities. Turismo, transporte y educación.

### b14_casos

Experiencia en servicios financieros, con proyectos reales. Asisa: un portal del mediador sobre SISnet 360. MoraBanc: crédito lombardo digital en banca privada. Mutua Madrileña: asesoramiento digital con cumplimiento. BBVA: lending corporativo global, con IA agéntica. AXA: suscripción multirramo al ritmo del producto. Sabadell: recobro conversacional con agentes humanizados. CaixaBank: APIs gobernadas, base para evolucionar. Mapfre: microservicios industrializados con IA y SDD. Y Aegon: una capa agéntica sobre el core legacy. …

### b15_clientes

Relaciones duraderas con nuestros clientes. Estas son algunas de las compañías con las que trabajamos. …

### b16_cifras

atmira en cifras. Veinte años. Ochocientos veinte especialistas. Setenta millones de euros de cifra de negocio. Más de cuarenta clientes activos. Dos sedes centrales, en Europa y Latinoamérica. Y más de siete hubs.

### b17_cierre

Modernizamos y aceleramos los servicios financieros. … Y la capa agéntica que construimos contigo … es tuya. … atmira.
