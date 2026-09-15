# SIREC — Motion Graphics (30s)

Vídeo de 30 segundos construido con [Remotion](https://www.remotion.dev) (React + TypeScript),
siguiendo el playbook de la skill `remotion-motion-graphics` (pila de 5 capas, spring en vez de
easing lineal, entradas de 2-3 propiedades, salidas más rápidas que las entradas, etc.).
16:9, 1920×1080, 30fps, exportable a MP4/H.264.

## Estructura

```
src/
  Root.tsx              composición raíz (SirecMotion, 900 frames @ 30fps)
  SirecMotion.tsx        timeline: pila de 5 capas + las 7 escenas en su Sequence
  styles/theme.ts         paleta, tipografía, timing de escenas, easings y springs con nombre
  lib/random.ts           utilidades deterministas para posiciones/redes
  assets/manifest.ts       registro de assets reales (screenshots) — ver más abajo
  components/
    CinematicLayers.tsx      BgMesh / Grade / Grain / Vignette — la pila de 5 capas
    ConnectionLine, GeometricNode                          lenguaje geométrico base
    KineticText, Wordmark, PillButton                       tipografía y marca
    AnimatedCounter, Sparkline                               "datos" — contadores y tendencias
    AgentNode, ModuleCard, LevelLadder, DashboardFrame       piezas específicas de escena
    PulseRings, ScanGrid, OrbitField, RotatingHalo, FlowStream   fondos animados,
      uno distinto por escena (radar / scan-line / órbita / halo giratorio / flujo)
    SceneExit.tsx            salida animada compartida (fade + rise, más rápida que la entrada)
  scenes/
    Scene01Complexity      0:00–0:04  complejidad → orden
    Scene02Sirec            0:04–0:08  presentación SIREC
    Scene03Autonomy         0:08–0:13  automatización → autonomía
    Scene04Agents            0:13–0:18  fuerza de trabajo agéntica
    Scene05Governance        0:18–0:23  autonomía gobernada
    Scene06Specialization    0:23–0:27  especialización
    Scene07Outro              0:27–0:30  cierre
```

Cada escena es independiente y editable sin tocar las demás.

## Comandos

```bash
npm install
npm start      # Remotion Studio — preview interactivo con scrubber
npm run preview  # render rápido a media resolución (revisión)
npm run build    # render final 1920x1080 H.264 → out/sirec-motion.mp4
```

Este entorno no tiene salida a internet para descargar el Chrome Headless Shell propio de
Remotion ni para verificar certificados de fonts.gstatic.com a través del proxy, así que los
scripts ya incluyen `--ignore-certificate-errors` y `remotion.config.ts` apunta al Chromium
headless preinstalado del entorno. Si renderizas en otra máquina con salida a internet normal,
ambos ajustes son innecesarios (pero no estorban).

## Logo — dejado en blanco a propósito

No hay ningún logo ni marca en el vídeo. Scene02 y Scene07 reservan el hueco (un `<div>` vacío
con la altura del logo) marcado con un comentario en el código:

```tsx
{/* Logo slot — intentionally left blank; drop the real SIREC logo file in
    public/ and render it here (e.g. <Img src={staticFile("logo.png")} />). */}
<div style={{ height: 96 }} />
```

Para añadir el logo real: guarda el archivo en `public/`, sustituye ese `<div>` por
`<Img src={staticFile("logo.svg")} style={{ height: 96 }} />` en ambas escenas.

## Integrar la captura real del dashboard (Escena 02)

Por defecto, Scene02 usa un panel de constelación de nodos animado (con contador y sparkline)
en vez de una captura real, porque las capturas que se compartieron en el chat no quedaron
accesibles como archivo en este entorno. Para activar la real:

1. Guarda la captura como `public/screenshots/dashboard.png`.
2. En `src/assets/manifest.ts`, cambia `dashboard: null` por
   `dashboard: staticFile("screenshots/dashboard.png")` (importando `staticFile` de `remotion`).

No hace falta tocar nada más — `DashboardFrame` usará la imagen real automáticamente.

## Reglas de marca respetadas

- Paleta: `#3365A2` / `#233456` / `#2ABBCE` / `#DDE7F4`, tipografía Roboto.
- Lenguaje visual 100% geométrico (nodos, líneas, módulos, contadores, sparklines) — nada de
  cyberpunk/neón/glitch — sin ningún logo ni personaje.

## Sonido

El vídeo se entrega sin audio. La skill de motion graphics recomienda no entregar nunca un
vídeo mudo, pero como no se pidió banda sonora y esto es una pieza corporativa que probablemente
lleve su propia locución/música más adelante, no se ha sintetizado un kit de SFX — decilo si lo
quieres y se añade (whooshes en las transiciones, un tick suave en los contadores, música de
fondo a bajo volumen).
