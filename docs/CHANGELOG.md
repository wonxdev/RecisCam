# Changelog
All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [3.0.0] - Dark Design System Redesign
### Added
- Centralized design system in `assets/css/style.css` built on CSS custom properties: color tokens, spacing scale, radius scale, elevation, and motion tokens.
- Reusable component classes — `.btn` (primary/secondary/ghost/success/danger), `.card`, `.field`, `.badge`, `.list-row`, `.stat`, `.toast`, `.empty-state` — shared by every page.
- Shared `showToast()` helper in `assets/js/app.js`; all `alert()` dialogs replaced with in-app toast notifications.
- Sticky top bar with brand mark and logout action on the dashboard pages.
- Subtle fade/scale animations with `prefers-reduced-motion` support.

### Changed
- Redesigned the entire UI around a dark theme (dark is now the default and only theme).
- Rebuilt the login and register pages as centered auth cards with branding, a divider, and demo-account quick actions.
- Login and register forms are now real `<form>` elements (Enter-to-submit works) with associated `label for` attributes and autocomplete hints.
- Removed all inline styles from HTML and JS-rendered markup in favor of design-system classes.
- Submitting attendance proof now updates the schedule in place instead of reloading the page.
- Demo seed attendance records now land on each student's actual piket weekday (`weeksAgo` instead of `daysAgo`), so the demo history looks correct on any day of the week.
- Refreshed the app icon and `manifest.json` colors to match the dark theme.

## [2.1.0] - Page Folder Restructure
### Changed
- Moved `register.html`, `student.html`, and `teacher.html` into a new `pages/` folder to keep the project root clean. `index.html` remains at the root as the entry point.
- Updated all asset references (`assets/`, `demo/`, `manifest.json`) in the moved pages to use relative `../` paths.
- Updated redirect logic in `assets/js/index.js` and `assets/js/app.js` (`requireRole`, `logoutAndRedirect`) so login, role checks, and logout correctly navigate between the root `index.html` and the pages inside `pages/`.
- Updated the "Belum punya akun? Daftar" link on the login page to point to `pages/register.html`.

## [2.0.0] - Portfolio Demo Rebuild
### Added
- `demo/demo-data.js` — sample fictional profiles and attendance records to seed the demo.
- `assets/js/demo-store.js` — a `localStorage`-backed fake backend replacing Supabase.
- "Portfolio Demo" badge shown on every page.
- One-tap demo login buttons for the Student and Teacher roles on the login page.
- `docs/README.md`, `docs/CHANGELOG.md`, and `docs/LICENSE`.
- Local SVG app icon (`assets/icons/icon.svg`) replacing external placeholder image URLs.

### Changed
- Reorganized the project into `assets/css`, `assets/js`, `assets/icons`, `demo/`, and `docs/` folders.
- Split all inline `<script>` blocks out into dedicated files per page (`index.js`, `register.js`, `student.js`, `teacher.js`) plus shared helpers (`app.js`).
- Rewrote all data operations (login, register, submit attendance, approve/reject, notifications) to use `DemoStore` instead of Supabase.
- Excel export now saves as `RecisCam-demo.xlsx`.
- `manifest.json` now points to a local icon instead of an external placeholder service.

### Removed
- Supabase client, project URL, and anon key (no real backend in the portfolio version).
- All `console.log` debug statements.
- Inline `onclick="..."` handlers in favor of `addEventListener`.

### Security
- Removed a live Supabase project URL and anon key that were previously hard-coded in the client-side source.

## [1.0.0] - Original Project
- Initial version of RecisCam: camera-based piket attendance app using Supabase for authentication, database, and photo storage.