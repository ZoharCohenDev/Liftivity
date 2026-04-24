# router

React Router configuration.

The route tree is currently defined in `../App.tsx`. As the app grows, extract routes here.

## What to implement

- `index.tsx` — export the full `<Routes>` tree
- `routes.ts` — typed route path constants (e.g. `export const ROUTES = { overview: "/app/overview" }`)
- `guards.tsx` — `ProtectedRoute` wrapper that redirects unauthenticated users to login
