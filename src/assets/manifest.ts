/**
 * Real product screenshots go in /public/screenshots and get referenced here via staticFile().
 * Until a file is dropped in, the value stays null and DashboardFrame renders an abstract
 * geometric placeholder instead — never a fabricated recreation of the UI.
 *
 * To activate the real SIREC dashboard screenshot in Scene02:
 *   1. Save the screenshot as public/screenshots/dashboard.png
 *   2. Set `dashboard: staticFile("screenshots/dashboard.png")` below
 */
export const SCREENSHOTS: { dashboard: string | null } = {
  dashboard: null,
};
