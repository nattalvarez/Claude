# SIREC — Motion Graphics (30s)

Vídeo de 30 segundos construido con [Remotion](https://www.remotion.dev) (React + TypeScript).
16:9, 1920×1080, 30fps, exportable a MP4/H.264.

## Estructura

```
src/
  Root.tsx              composición raíz (SirecMotion, 900 frames @ 30fps)
  SirecMotion.tsx        timeline: monta las 7 escenas en su Sequence
  styles/theme.ts         paleta, tipografía, timing de escenas
  lib/random.ts           utilidades deterministas para posiciones/redes
  assets/manifest.ts       registro de assets reales (screenshots) — ver más abajo
  components/
    ConnectionLine, GeometricNode                        lenguaje geométrico base
    KineticText, Wordmark, AxolotlMark, BrandLockup, PillButton   tipografía y marca
    AgentNode, ModuleCard, LevelLadder, DashboardFrame   piezas específicas de escena
    PulseRings, ScanGrid, OrbitField, RotatingHalo, FlowStream    fondos animados,
      uno distinto por escena (radar / scan-line / órbita / halo giratorio / flujo)
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

## Integrar la captura real del dashboard (Escena 02)

Por defecto, Scene02 usa un placeholder geométrico abstracto en vez de una captura real,
porque las capturas que se compartieron en el chat no quedaron accesibles como archivo en este
entorno. Para activar la real:

1. Guarda la captura como `public/screenshots/dashboard.png`.
2. En `src/assets/manifest.ts`, cambia `dashboard: null` por
   `dashboard: staticFile("screenshots/dashboard.png")` (importando `staticFile` de `remotion`).

No hace falta tocar nada más — `DashboardFrame` usará la imagen real automáticamente.

## El logo (`AxolotlMark`)

El archivo del logo tampoco quedó accesible como archivo en este entorno (solo se vio como
imagen en el chat), así que `src/components/AxolotlMark.tsx` es una reconstrucción vectorial
fiel del isotipo (cápsula, dos ojos, tres branquias por lado) que se autodibuja trazo a trazo.
Si en algún momento se dispone del SVG/AI original del logo, puede sustituirse ese componente
por un `<Img>`/`staticFile` sin tocar `BrandLockup` (que combina el icono con el wordmark
"sirec" y es lo que usan Scene02 y Scene07).

## Reglas de marca respetadas

- Paleta: `#3365A2` / `#233456` / `#2ABBCE` / `#DDE7F4`, tipografía Roboto.
- Lenguaje visual mayoritariamente geométrico (nodos, líneas, módulos) — nada de
  cyberpunk/neón/glitch — con el isotipo de la marca (ajolote) en la intro y el cierre.
