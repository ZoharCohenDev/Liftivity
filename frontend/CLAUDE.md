# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Vite dev server → http://localhost:5173
pnpm build      # tsc + vite build → dist/
pnpm typecheck  # TypeScript type check only (no emit)
pnpm lint       # ESLint over src/ (ts, tsx)
pnpm preview    # Preview the production build locally
```

No test runner is configured yet.

## Architecture

This is a **React 18 + TypeScript + Vite** SPA. The package name is `@liftivity/web` and it lives inside a pnpm monorepo (`/Users/matancohen/Liftivity`).

### Routing & Layouts

`App.tsx` is the root — it owns the router tree and wraps everything in the two context providers. There are two layout branches:

- `/` → `PublicLayout` → `LandingPage` (marketing)
- `/app/*` → `AppLayout` (sidebar + topbar shell) → authenticated pages

`AppLayout` renders `Sidebar` + `TopBar` from `src/components/nav/` and an `<Outlet>` for the page content.

### State & Context

Two contexts wrap the whole app:

- **`AppThemeProvider`** (`src/context/ThemeContext.tsx`) — manages `dark`/`light` MUI palette mode; exposes `useThemeMode()`. Defaults to dark.
- **`AppProvider`** (`src/context/AppContext.tsx`) — holds mock `sites[]` and a hardcoded `user` object; exposes `useApp()`.

All data is currently mocked — there is no real API integration yet.

### Theme

`src/theme/theme.ts` exports `getTheme(mode)` which builds the full MUI theme. The file also exports `SIDEBAR_COLORS` and `TOPBAR_COLORS` token maps (keyed by `"dark"` | `"light"`) used directly by the nav components — extend these when touching sidebar or topbar styling.

### Pages & Co-located Components

Each page folder under `src/pages/` owns its own `components/` subfolder for page-specific UI. Shared, cross-page components (e.g. `StatCard`, `ScoreDonut`, `StatusBadge`) live in `src/components/`.

Current pages: `Landing`, `Dashboard`, `Analysis/NewAnalysisPage`, `Analysis/AnalysisProgressPage`, `Report`.

### Mock Data

All chart and list data used across pages lives in `src/data/mockData.ts`. When integrating real APIs, replace the exports from this file and update `AppContext`.

### Styling

MUI v5 with Emotion. Component overrides are centralized in `getTheme()` — prefer adding overrides there over inline `sx` prop styles for anything that should apply globally.
