# Real product screenshots

Drop the SIREC dashboard screenshot here as `dashboard.png` (the one used in Scene02 — the
hero image behind "La plataforma agéntica para la gestión del riesgo de crédito").

Then in `src/assets/manifest.ts`, change:

```ts
export const SCREENSHOTS: { dashboard: string | null } = {
  dashboard: null,
};
```

to:

```ts
import { staticFile } from "remotion";

export const SCREENSHOTS: { dashboard: string | null } = {
  dashboard: staticFile("screenshots/dashboard.png"),
};
```

No other code changes needed — `DashboardFrame` will render the real image instead of the
abstract placeholder automatically.
