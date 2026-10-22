/**
 * Textos en pantalla. Fuente: vídeo corporativo original de atmira (v4, 8:43).
 * Se conservan denominaciones, cifras y afirmaciones; solo se reordena y se divide por escenas.
 * Los textos de la locución están en audio/script.json (no se leen literalmente todos los de pantalla).
 */

export const OPENING = {
  kicker: "No hacemos todo. Hacemos esto.",
  headline: ["Modernizamos", "y aceleramos", "los servicios financieros"],
};

export const MODERNIZAR = {
  statement: ["Modernizar es renovar lo", "que sostiene el negocio,"],
  statementAccent: ["dominio a dominio y de", "forma continua."],
  body:
    "Es convertir la tecnología en valor de negocio cada día: una transformación controlada, liderada por la arquitectura, que preserva el conocimiento crítico del negocio mientras reduce la deuda técnica.",
  gainsLabel: "Qué gana el negocio",
  gains: [
    { t: "Velocidad", d: "cada producto nuevo y cada cambio llegan antes a los clientes." },
    { t: "Conocimiento que se queda", d: "queda ordenado en un Digital Brain, accesible a toda la organización." },
    { t: "Cumplimiento como ventaja", d: "trazabilidad de serie para DORA, AI Act y supervisor." },
    { t: "Datos listos para la IA", d: "la base para que analítica y agentes aporten valor." },
  ],
  pull: { t: "Innovación continua:", d: "la base para crecer, cumplir con el regulador e incorporar IA en cada dominio." },
};

export const AGENTICA = {
  title: ["Modernizar permite", "evolucionar hacia", "una arquitectura agéntica"],
  lead: "Es el paso que conecta los sistemas actuales con la arquitectura objetivo, en tres movimientos:",
  steps: [
    { n: "01", t: "Simplifica el presente", d: "Reduce la complejidad de los sistemas legacy y facilita su integración." },
    { n: "02", t: "Habilita el futuro", d: "Evoluciona hacia arquitecturas modulares y agénticas que aceleren la innovación." },
    { n: "03", t: "Genera valor medible", d: "Mejora la eficiencia, agilidad y rendimiento, con gobierno y control regulatorio." },
  ],
};

export const BENEFICIOS = {
  line: "Un enfoque que aporta dos beneficios al negocio:",
  a: "aceleración",
  b: "especialización.",
};

export const PLATAFORMA = {
  title: ["Ofrecemos un enfoque de plataforma:", "servicios y soluciones que conectan", "tus sistemas con tu arquitectura objetivo."],
  systemsLabel: "Tus sistemas",
  systems: ["Core bancario y asegurador", "Monolitos", "Canales y escritorio", "Integración: ESB, SOAP, batch", "Datos y reporting", "Riesgo de crédito"],
  targetLabel: "Arquitectura objetivo",
  target: ["Arquitectura agéntica", "Aplicaciones modernizadas", "APIs gobernadas", "Microservicios cloud-native", "Core componible", "Dato preparado para IA"],
  hub: "ModernIzA",
  layers: [
    {
      t: "Aceleración",
      s: "Agent Factory",
      d: "Agentes que analizan, deciden, construyen y operan en todo el ciclo de desarrollo, con una persona que aprueba en cada fase.",
    },
    {
      t: "Especialización",
      s: "Digital Brain",
      d: "El conocimiento del negocio de cada sector y la tecnología aplicada a él, preservados y ampliados con cada proyecto, para modernizar dominio a dominio.",
    },
    {
      t: "Gobierno",
      s: "AI Steering · Guardrails",
      d: "AI Steering fija dirección y límites y consolida el reporting a dirección; los Guardrails ponen puntos de control sobre lo que hacen los agentes.",
    },
  ],
  sirec: {
    label: "Solución de la plataforma",
    t: "Inteligencia aplicada al ciclo de riesgo de crédito",
    d: "Orquesta anticipación, seguimiento y recobro con agentes propios y de terceros.",
    n: "Más de 15 clientes en Europa y Latinoamérica.",
  },
};

export const AGENT_FACTORY = {
  title: "Aceleración",
  sub: "habilitada por la Agent Factory",
  lead: "Dotando a tu plataforma de los activos necesarios",
  l1: "No convertimos código. Transformamos cómo se construye software.",
  l2:
    "La Agent Factory es lo que la hace posible: industrializa la modernización del software con la arquitectura como guía, agentes que aceleran la ejecución y personas que gobiernan las decisiones.",
  l3: "Una capacidad escalable que forma parte de tu capa agéntica.",
};

export const DONDE = {
  title: ["Dónde aceleramos,", "eficientamos e industrializamos"],
  lead: ["Transformamos los sistemas críticos en arquitecturas modernas, flexibles y escalables,", "sin interrumpir el negocio."],
  support: "Combinamos arquitecturas cloud, evolución del core e ingeniería avanzada. Los agentes ejecutan; la arquitectura marca el camino.",
  includes: "Esto incluye",
  items: [
    { n: "01", t: "Modernización del legacy", d: "evolucionamos sistemas monolíticos y mainframes, reducimos la deuda técnica y preservamos la continuidad operativa." },
    { n: "02", t: "Evolución del core financiero y asegurador", d: "por dominios, conviviendo con Temenos, Mambu o SISnet mientras se migra, sin parar la operación." },
    { n: "03", t: "Ciclo de riesgo de crédito con SIREC", d: "SIREC se integra sobre el core y los canales del cliente; evolucionamos sus estrategias y conectamos los agentes que ya usa." },
    { n: "04", t: "Arquitecturas cloud para crecer", d: "plataformas modulares, escalables e interoperables que simplifican la integración y aceleran la innovación." },
    { n: "05", t: "Diseño por dominios y eventos", d: "soluciones alineadas con el negocio que dan flexibilidad y aceleran la evolución de productos y servicios." },
    { n: "06", t: "Ingeniería y automatización continua", d: "desarrollo, pruebas, despliegue y operación optimizados para ganar velocidad, calidad y fiabilidad." },
  ],
};

export const COMO = {
  title: ["Cómo aceleramos:", "cada cambio, trazado"],
  lead:
    "En todos esos frentes, el mismo método: Spec-Driven Development. Cada cambio avanza sobre especificaciones versionadas en tus repositorios y tu CI/CD, con una aprobación humana antes de cada fase.",
  factory: "Agent Factory",
  harness: { l: "Arnés de orquestación", d: "asigna tareas, versiona artefactos y deja traza de cada paso" },
  steering: { l: "AI Steering", d: "fija qué se delega en cada gate" },
  phases: [
    { t: "Analiza", items: ["Conocimiento técnico", "Conocimiento de dominio", "Impacto en negocio"], gate: "valida negocio" },
    { t: "Decide", items: ["Arquitectura", "Complejidad y riesgo", "Cumplimiento"], gate: "revisión de arquitectura" },
    { t: "Construye", items: ["Spec y codificación", "Pruebas", "Documentación"], gate: "Code & test review" },
    { t: "Opera", items: ["Despliegue", "Observabilidad", "Evidencia y memoria"], gate: "go / no-go" },
  ],
  notes: [
    { l: "Trazable", d: "cada artefacto queda versionado con quién lo generó y quién lo aprobó." },
    { l: "Sobre tu stack", d: "tus repositorios, tu CI/CD, tus arquetipos y tus estándares." },
    { l: "Personas donde importa", d: "los agentes generan y prueban; las personas aprueban en cada gate." },
  ],
  gateLegend: "punto de aprobación humano",
  brain: { l: "Digital Brain", d: "ontología del dominio · memoria compartida · estándares y decisiones del cliente · consolidación con revisión humana" },
  brainUp: "aporta contexto",
  brainDown: "consolida lo aprendido",
  guardrails: { l: "Guardrails", d: "identidad · sandboxing · control de salidas · pasarela MCP · secretos · model proxy · kill switch" },
};

export const QUIEN = {
  title: ["Quién acelera:", "agentes expertos en cada fase"],
  lead: "Familias de agentes de negocio y de tecnología cubren Analiza, Decide, Construye y Opera, dentro de un arnés que delimita el perímetro.",
  phases: [
    { t: "Analiza", d: "valora situación, prioridad y encaje" },
    { t: "Decide", d: "recomienda el mejor camino" },
    { t: "Construye", d: "construye y verifica" },
    { t: "Opera", d: "asegura la operación" },
  ],
  business: {
    t: "Agentes de negocio",
    d: "Saben del dominio: recobro, lending, core asegurador, siniestros…",
    cells: [
      ["Conocimiento de dominio", "uno por dominio: reglas de negocio, procesos y excepciones."],
      ["Spec de negocio", "convierte la necesidad en criterios de aceptación verificables."],
      ["Pruebas de negocio", "escenarios E2E por dominio con datos de prueba realistas."],
      ["Evidencia", "resultados y KPIs para dirección: valor, desvíos y riesgos."],
      ["Impacto en negocio", "prioridad, riesgo y encaje de cada petición en la cartera."],
      ["Cumplimiento", "clasifica el riesgo del caso (AI Act, DORA, supervisor) antes de construir."],
      ["Documentación funcional", "deja explicado qué hace el sistema y por qué."],
      ["Memoria", "consolida lo aprendido en el Digital Brain."],
    ],
  },
  tech: {
    t: "Agentes de tecnología",
    d: "Saben de la tecnología: plataformas, APIs, datos, cloud…",
    cells: [
      ["Conocimiento técnico", "uno por plataforma: mapa de dependencias e impacto de cada cambio."],
      ["Arquitectura", "propone el diseño objetivo (APIs, eventos, cloud-native) y registra la decisión."],
      ["Codificación", "por lenguaje y arquetipo: genera, migra y refactoriza entre plataformas."],
      ["Despliegue", "releases con control de versiones y vuelta atrás automática."],
      ["Complejidad y riesgo", "cuantifica complejidad, riesgo y coste de cada vía de modernización."],
      ["Spec técnica", "contratos de API, modelos de datos y arquetipos del cliente."],
      ["Pruebas unitarias y PR", "cobertura, regresiones y cambio listo para revisión humana."],
      ["Observabilidad", "vigila disponibilidad y fiabilidad y abre el siguiente ciclo."],
    ],
  },
  hitl: { l: "Human-in-the-loop", d: "Los agentes proponen, generan y dejan evidencia trazable; las personas deciden en cada punto de aprobación." },
};

export const ESPECIALIZACION = {
  title: "Especialización",
  sub: "habilitada por el Digital Brain",
  body:
    "El conocimiento del negocio es lo que convierte la tecnología en resultados. El Digital Brain lo hace posible: reúne el conocimiento de cada dominio de negocio y el conocimiento tecnológico aplicado a él (sistemas, arquitectura y datos) para modernizar dominio a dominio.",
};

export const POR_SECTOR = {
  title: ["Un Digital Brain", "por sector"],
  lead: "Cada Digital Brain reúne tres capas de conocimiento:",
  threes: [
    { n: "01", t: "El sector", d: "a quién servimos" },
    { n: "02", t: "Los ámbitos de negocio", d: "qué hace el negocio" },
    { n: "03", t: "Tecnología y arquitectura", d: "con qué sistemas funciona" },
  ],
  tail: "Crece con cada proyecto y es la base para acelerar con IA la modernización de cada dominio.",
  frame: "Un marco, diferentes cerebros:",
  brains: [
    { a: "Banking", t: "El cerebro de la banca agéntica", d: "Activamos la banca agéntica modernizando con IA el negocio del banco, de punta a punta." },
    { a: "Insurance", t: "El cerebro de los seguros inteligentes", d: "Activamos los seguros inteligentes modernizando con IA el negocio de la aseguradora, de punta a punta." },
    { a: "Smart", t: "Brains en construcción multi industria", d: "Llevamos nuestra capacidad tecnológica a otros sectores y, con cada cliente, sumamos conocimiento para que evolucionen a Digital Brains propios." },
  ],
};

export type Col = { n: string; t: string; items: { h: string; d: string }[] };
export type Brain = { name: string; accent: string; tagline: string; intro?: string; cols: Col[]; legend: string[] };

export const BANKING: Brain = {
  accent: "Banking",
  name: "Digital Brain",
  tagline: "El cerebro de la banca agéntica.",
  intro: "Activamos la banca agéntica, de punta a punta.",
  legend: ["01 · Sector", "02 · Ámbitos de negocio", "03 · Tecnología y arquitectura"],
  cols: [
    {
      n: "01",
      t: "Sector",
      items: [
        { h: "Banca retail", d: "Contratación y relación omnicanal: mismo contexto de cliente en oficina, app y contact center, con APIs gobernadas y capacidad IA en el canal." },
        { h: "Banca privada", d: "Asesoramiento apoyado en el dato del cliente: propensión, contexto y propuesta preparados antes de la conversación." },
        { h: "Banca corporativa", d: "Operativa de empresa, cash management y financiación: procesos largos resueltos de extremo a extremo con trazabilidad." },
      ],
    },
    {
      n: "02",
      t: "Ámbitos de negocio",
      items: [
        { h: "Credit Risk & Collections", d: "Recobro inteligente con SIREC: agentes que anticipan comportamientos, definen estrategias y ejecutan la siguiente mejor acción." },
        { h: "Customer & Onboarding", d: "Alta, contratación y gestión del cliente, integrando identidad, cumplimiento y operaciones de forma fluida y contextual." },
        { h: "Corporate & Structured Lending", d: "Financiación corporativa y estructurada de extremo a extremo: de la originación y estructuración al servicing." },
        { h: "Core & Payments", d: "Modernización del core bancario y de pagos dominio a dominio, conviviendo con Temenos o Mambu, sin parar la operación." },
      ],
    },
    {
      n: "03",
      t: "Tecnología y arquitectura",
      items: [
        { h: "Core bancario y sistemas legacy", d: "Entendimiento técnico de los sistemas críticos, para habilitar nuevas capacidades inteligentes sin comprometer la continuidad operativa." },
        { h: "Arquitectura de referencia", d: "Inferimos la arquitectura de referencia para la integración de agentes de IA, modelos y servicios, con capacidad para orquestar procesos y decisiones de negocio." },
        { h: "API & Open Finance", d: "Incluimos la conexión e interoperabilidad entre sistemas, canales y ecosistemas a través de las APIs y definición de sus contratos." },
        { h: "Datos y conocimiento contextual", d: "Integración de datos, reglas, procesos y conocimiento corporativo para dotar a los agentes de contexto, seguridad y trazabilidad." },
      ],
    },
  ],
};

export const INSURANCE: Brain = {
  accent: "Insurance",
  name: "Digital Brain",
  tagline: "El cerebro de los seguros inteligentes.",
  intro: "Activamos los seguros inteligentes, de punta a punta.",
  legend: ["01 · Sector", "02 · Ámbitos de negocio", "03 · Tecnología y arquitectura"],
  cols: [
    {
      n: "01",
      t: "Sector",
      items: [
        { h: "Vida y pensiones", d: "Asesoramiento basado en dato para contratación, gestión de cartera y prestaciones con el contexto del cliente compartido entre mediador y compañía." },
        { h: "Generales: autos, hogar y empresas", d: "Tarificación, emisión y siniestros de extremo a extremo en el canal que prefiera el cliente, con IA y trazabilidad de cada decisión." },
        { h: "Salud", d: "Autorizaciones, cuadro médico y reembolsos con procesos largos automatizados y control humano donde importa." },
      ],
    },
    {
      n: "02",
      t: "Ámbitos de negocio",
      items: [
        { h: "Underwriting & Pricing", d: "Suscripción y tarificación con agentes que valoran riesgo, contexto y propensión antes de la oferta." },
        { h: "Claims & Benefits", d: "Siniestros y prestaciones de extremo a extremo: apertura, valoración, detección de fraude y pago, con agentes que priorizan y control humano donde importa." },
        { h: "Distribution & Customer", d: "Mediadores, bancaseguros y canal directo con el mismo contexto y visión de cliente." },
        { h: "Capas normativas y de país", d: "Cumplimiento: supervisión DGSFP, Solvencia II, RGPD y LOPDGDD, DORA. Localización: idioma, moneda, formatos, identificadores (DNI/NIE) y conexiones sectoriales como EIAC/CIMA." },
      ],
    },
    {
      n: "03",
      t: "Tecnología y arquitectura",
      items: [
        { h: "Core asegurador y sistemas legacy", d: "Entendimiento técnico del core sobre SISnet/WOLF o el core actual, para habilitar nuevas capacidades inteligentes sin comprometer la operación." },
        { h: "Arquitectura de referencia", d: "Inferimos la arquitectura de referencia para integrar agentes de IA, modelos y servicios, con capacidad para orquestar procesos y decisiones de negocio." },
        { h: "API & Open Insurance", d: "Incluimos la conexión e interoperabilidad entre compañía, mediación y ecosistema a través de las APIs y la definición de sus contratos." },
        { h: "Datos y conocimiento contextual", d: "Integración de datos de cartera, siniestralidad y cliente, reglas, procesos y conocimiento corporativo para dotar a los agentes de contexto, seguridad y trazabilidad." },
      ],
    },
  ],
};

export const SMART: Brain = {
  accent: "Smart",
  name: "Digital Brains",
  tagline: "Brains en construcción para otras industrias.",
  legend: ["01 · Sector", "02 · Ámbitos de solución", "03 · Tecnología y arquitectura"],
  cols: [
    {
      n: "01",
      t: "Sector",
      items: [
        { h: "Retail & Servicios", d: "Comercio, distribución y servicios profesionales: experiencia de cliente omnicanal, personalización de la oferta y digitalización del punto de venta y la atención." },
        { h: "Industria, Energía y Utilities", d: "Sector productivo e infraestructuras críticas: mantenimiento predictivo, eficiencia operativa y gestión inteligente de activos, redes y consumo." },
        { h: "Turismo, Transporte & Educación", d: "Movilidad y experiencia de personas: gestión de reservas, itinerarios y aprendizaje personalizado con el mismo contexto de usuario en cada interacción." },
      ],
    },
    {
      n: "02",
      t: "Ámbitos de solución",
      items: [
        { h: "Customer & Channel Experience", d: "Contratación, atención y fidelización con el mismo contexto de cliente en cada canal, físico y digital, y personalización en tiempo real." },
        { h: "Operations & Asset Intelligence", d: "Mantenimiento predictivo, gestión de activos y optimización de la cadena de suministro con datos en tiempo real y modelos de IA." },
        { h: "Product & Service Innovation", d: "Diseño y lanzamiento de nuevos productos, servicios y modelos de negocio digitales, del concepto al mercado." },
        { h: "Data Platform", d: "Modernización de sistemas core y consolidación de una plataforma de datos común, dominio a dominio, sin parar la operación." },
      ],
    },
    {
      n: "03",
      t: "Tecnología y arquitectura",
      items: [
        { h: "Sistemas legacy", d: "Entendimiento técnico de los sistemas críticos de cada sector, para habilitar nuevas capacidades inteligentes sin comprometer la continuidad operativa." },
        { h: "Arquitectura de referencia", d: "Inferimos la arquitectura de referencia para la integración de agentes de IA, modelos y servicios, con capacidad para orquestar procesos y decisiones de negocio." },
        { h: "API & Open Ecosystem", d: "Incluimos la conexión e interoperabilidad entre sistemas, canales y ecosistemas del sector a través de las APIs y la definición de sus contratos." },
        { h: "Datos y conocimiento contextual", d: "Integración de datos, reglas, procesos y conocimiento corporativo para dotar a los agentes de contexto, seguridad y trazabilidad." },
      ],
    },
  ],
};

export const CASOS = {
  title: ["Experiencia en", "servicios financieros"],
  eyebrow: "Proyectos reales",
  cols: ["Sector", "Ámbitos de negocio", "Tecnología y arquitectura"],
  items: [
    { id: "asisa", col: 0, logoH: 56, h: "Distribución aseguradora multicompañía", d: "Portal del Mediador para Salud, Vida y Decesos en España y Portugal sobre SISnet 360. El legacy queda migrado y la mediación opera sobre un único ecosistema preparado para crecer." },
    { id: "morabanc", col: 0, logoH: 44, h: "Crédito lombardo digital en banca privada", d: "Gestión integral del crédito, digitalizada y automatizada, para que el tiempo del banquero vaya a la relación con el cliente." },
    { id: "mutua-madrilena", col: 0, logoH: 54, h: "Asesoramiento digital con cumplimiento", d: "Canal de asesores para Vida Planes y Fondos, con MiFID II, ESG y RIS aplicados dentro del propio proceso de venta." },
    { id: "bbva", col: 1, logoH: 48, h: "Lending corporativo global, modernizado con IA agéntica", d: "El sistema que sostiene la financiación de corporate banking evoluciona dominio a dominio, con agentes que aceleran cada ciclo." },
    { id: "axa", col: 1, logoH: 70, h: "Suscripción multirramo al ritmo del producto", d: "Salud y Motor configurados sobre core Zero Code. Los productos y cambios nuevos llegan antes, sin desarrollo a medida." },
    { id: "sabadell", col: 1, logoH: 50, h: "Recobro conversacional con agentes humanizados", d: "Inteligencia conversacional aplicada al recobro: cada contacto se adapta al cliente, a escala." },
    { id: "caixabank", col: 2, logoH: 52, h: "APIs gobernadas, base para evolucionar", d: "Calidad y trazabilidad de las APIs en todo el ecosistema bancario. Cada integración queda verificada y lista para el siguiente cambio." },
    { id: "mapfre", col: 2, logoH: 48, h: "Microservicios industrializados con IA y SDD", d: "Desarrollo de APIs asistido por IA sobre un estándar común: más velocidad de construcción, con gobierno en cada paso." },
    { id: "aegon", col: 2, logoH: 52, h: "Capa agéntica sobre el core legacy", d: "El core sigue operando mientras los agentes automatizan RCA, logs y monitorización e industrializan su evolución." },
  ],
};

export const CLIENTES = {
  title: ["Relaciones duraderas", "con nuestros clientes"],
};

export const CIFRAS = {
  title: ["atmira", "en cifras"],
  items: [
    { v: 20, pre: "", suf: "", l: "Años" },
    { v: 820, pre: "", suf: "", l: "Especialistas" },
    { v: 70, pre: "", suf: " M€", l: "Cifra de negocio" },
    { v: 40, pre: "+", suf: "", l: "Clientes activos" },
    { v: 2, pre: "", suf: "", l: "HQ: Europa y Latam" },
    { v: 7, pre: "+", suf: "", l: "Hubs" },
  ],
};

export const CIERRE = {
  l1: "Modernizamos y aceleramos los servicios financieros.",
  l2: "Y la capa agéntica que construimos contigo es tuya.",
  web: "atmira.com",
};

/** Orden curado del muro de clientes (índices de public/clients/cNN.png → nombre). */
export const CLIENT_NAMES: Record<number, string> = {
  1: "aegon", 2: "Amadeus", 3: "ancert", 4: "Andbank", 5: "Aresbank", 6: "asisa", 7: "BancaMarch", 8: "Banco Caminos", 9: "bankinter", 10: "BBVA",
  11: "BBVA Seguros", 12: "Ibermutuamur", 13: "Bci", 14: "BME", 15: "BNP Paribas", 16: "CaixaBank", 17: "Caja de Ingenieros", 18: "cajamar", 19: "cantabria labs", 20: "caser",
  21: "cecabank", 22: "cesce", 23: "cetelem", 24: "codere", 25: "Coexpan", 26: "CriteriaCaixa", 27: "Divarian", 28: "doValue", 29: "eDreams", 30: "EVO Banco",
  31: "EVO Finance", 32: "Fundación BBVA", 33: "GCB", 34: "Generali", 35: "Grupo Piñero", 36: "helvetia", 37: "ibercaja", 38: "informa", 39: "InmoCaixa", 40: "inversis",
  41: "Iris Global", 42: "Konecta", 43: "KRUK", 44: "MANGO", 45: "MAPFRE", 46: "Mediolanum", 47: "Med Vida", 48: "MoraBanc", 49: "Mutua de Propietarios", 50: "Mutua Madrileña",
  51: "Mutuactivos", 52: "Mutualidad Abogacía", 53: "nationale-nederlanden", 54: "Northgate", 55: "nousell", 56: "Ocaso", 57: "Openbank", 58: "pelayo", 59: "privalia", 60: "Prosegur",
  61: "PSN", 62: "Repsol", 63: "Sabadell", 64: "Santander", 65: "Santander Consumer", 66: "Santander Seguros", 67: "Sareb", 68: "Servihabitat", 69: "SIX", 70: "sura",
  71: "Triodos Bank", 72: "UMAS", 73: "Unicaja", 74: "unir", 75: "Vallbanc", 76: "verti", 77: "vueling", 78: "Zurich",
};
