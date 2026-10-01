# Agent Economy — pieza de motion design (Remotion)

1920 × 1080 · 30 fps · 2055 fotogramas (≈ 68,5 s) · Roboto · acento `#E81F76`.

Una sola cámara virtual 3D recorre un único mundo continuo: no hay escenas sueltas ni fundidos.
Las transiciones nacen del contenido (una cámara que viaja, una estructura que se reorganiza,
una superficie rosa que sube y luego se contrae en la pieza de cierre).

## Comandos

```bash
npm install
npm start         # Remotion Studio (genera antes los SFX)
npm run build     # render final → out/agent-economy.mp4  (H.264, CRF 16)
npm run preview   # render rápido a media resolución
npm run sfx       # regenera public/sfx/*.wav (kit sintetizado, sin descargas)
npm run typecheck
```

## Arquitectura

```
src/
  config.ts        formato, línea de tiempo (SC), logo, interruptor de sonido
  theme.ts         paleta, easings, tipografía, safe areas (nada va "inline")
  cameraPath.ts    la cámara: keyframes de toda la pieza + anchorAt() para anclar texto en el mundo
  climax.ts        tiempos de la superficie rosa y del panel de cierre
  events.ts        reacciones del suelo (ondas)
  Main.tsx         composición: fondo → grano → superficie rosa → suelo → actos → sonido
  engine/          motor propio 2.5D/3D
    camera.tsx       project / unproject / sampleCamera (x, y, z, yaw, pitch, focal)
    primitives.tsx   Dot3, Poly3, Solid3 (sólidos planos sombreados), Layer
    Text.tsx         TextBlock (máscara de líneas, easing expo-out, salidas rápidas) y PlaneText (texto en el mundo)
    fonts.tsx        carga explícita de Roboto desde public/fonts (nunca fuente de sistema)
    math.ts          ramp / lerp / rng determinista
  world/           Floor (retícula que reacciona), Channel (canales + paquetes), Entities, System, layout
  scenes/          Act1 (S1–S3) · Act2 (S4) · Act3 (S5–S6) · Act4 (S7–S10) · Act5 (S11–S13)
  audio/           cues.ts (mapa de sonido por fotograma) + Sound.tsx
scripts/           make-sfx.mjs · stills.mjs (renderiza varios fotogramas con un solo bundle)
```

## Lenguaje visual

| Actor | Forma |
|---|---|
| Cliente | un punto oscuro |
| Mediador | un prisma facetado |
| Aseguradora | una losa en capas |
| Agente de IA | un enjambre de puntos rosa que actúa como una sola entidad, en un plano propio sobre los demás |

El rosa solo aparece en lo que es del agente o de la señal que se activa; va ganando peso (S3 → S4 → S9 → S11)
hasta ocupar toda la pantalla en el clímax y se recoge en un panel para el cierre.

## Sobre el logo

El repositorio no contiene ningún archivo de logo, así que **no se ha inventado ninguno**.
Para integrarlo: copia el archivo a `public/` y rellena `LOGO` en `src/config.ts`:

```ts
export const LOGO = { file: "logo.svg", aspect: 4.2 }; // archivo en /public · aspect = ancho / alto
```

Aparece en el cierre, arriba a la izquierda, alineado a los márgenes de seguridad (160 px), a 72 px de alto,
sin deformar, sin sombras y sin efecto de "logo reveal".

## Sonido

Diseño secundario, pensado para que la pieza funcione igual en silencio. `src/audio/cues.ts` es el mapa
(un cue por línea: fotograma, muestra, volumen, nota). Los samples se sintetizan con `npm run sfx`
(ticks, pings, whooshes, risers, un impacto para el clímax y una cama casi inaudible que crece hacia él).
Para renderizar sin audio: `SOUND_ENABLED = false` en `src/config.ts`. Para sustituir por sound design propio,
reemplaza los `.wav` de `public/sfx/` conservando los nombres, o edita `cues.ts`.
