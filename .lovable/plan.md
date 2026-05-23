# Building Supervisor Management System — Frontend Plan

A clean, professional construction-management UI built with the project's existing stack (React 19 + TanStack Start + Tailwind v4 + Framer Motion + Lucide). Frontend-only, dummy data, fully responsive.

## Design direction

- Aesthetic: minimal modern construction-management dashboard. Dark slate sidebar, light neutral content area, soft shadows, generous rounded corners (xl/2xl), confident spacing.
- Palette (added as oklch tokens in `src/styles.css`):
  - Sidebar: deep slate `#0F172A` with muted slate text and amber accent for active state
  - Content bg: warm off-white `#F7F8FA`
  - Primary: construction amber `#F59E0B`
  - Accent/secondary: steel blue `#2563EB`
- Typography: Inter for body, Plus Jakarta Sans (or system fallback) for headings — loaded via Google Fonts link in `__root.tsx`.
- Motion: framer-motion for sidebar item hover, modal scale+fade, list item stagger fade-in.

## Routes (TanStack Start file-based, not React Router)

The project uses TanStack Router, not `react-router-dom`. Will use it equivalently — same UX, type-safe routing.

```
src/routes/
  __root.tsx           (updated: wraps Outlet in <AppLayout> with sidebar)
  index.tsx            (redirects to /dashboard)
  dashboard.tsx        ("Dashboard Coming Soon" centered)
  buildings.tsx        (list + add modal + detail modal)
  filter.tsx           (search bar + results)
```

Each route gets its own `head()` metadata.

## Components

```
src/components/
  layout/
    AppLayout.tsx       (sidebar + main content shell)
    Sidebar.tsx         (dark sidebar, nav items, active highlight, mobile toggle)
  buildings/
    BuildingCard.tsx    (horizontal card: owner photo + name)
    AddBuildingModal.tsx
    BuildingDetailModal.tsx (details + AssignWorkersForm)
    AssignWorkersForm.tsx   (dynamic rows: category + count)
  filter/
    SearchBar.tsx
    AssignmentCard.tsx  (date / building / category / count)
  ui/
    Modal.tsx           (reusable: backdrop blur, scale+fade, close btn, ESC + click-outside)
```

## State & data (frontend-only)

- `src/data/buildings.ts` — dummy buildings array (id, name, address, phone, ownerPhoto, sitePhoto, assignments[]).
- `src/data/assignments.ts` — flattened assignments for the Filter page (date, buildingName, category, count).
- Local state with `useState` in each route; new buildings + assignments persist for the session only. No backend, no Cloud.
- Photos uploaded in the Add modal handled via `URL.createObjectURL` for preview.

## Page details

**Dashboard** — centered "Dashboard Coming Soon" heading with subtle fade-in.

**Buildings**
- Header row: "Buildings" title + "Add Building" button (amber, rounded-full, Plus icon).
- Vertical stack of `BuildingCard`s (owner photo left, name right, hover lift).
- Click card → `BuildingDetailModal` with full details + `AssignWorkersForm` (dynamic rows, Add/Remove row, Save Assignment — saves to local state and pushes into assignments list).
- Categories dropdown: Electrician, Plumber, Painter, Centering, Carpenter, Mason, Men Worker, Women Worker.

**Filter**
- Centered Google-style rounded-full `SearchBar` with Search icon and focus ring animation.
- Below: list of `AssignmentCard`s filtered by query against building name / category / date. Framer-motion stagger fade-in on results.

## Technical notes

- Stack adjustment: spec asks for "React Router" — project uses TanStack Router (file-based). Functionally identical for this UI; will not add `react-router-dom`.
- Tailwind v4: add custom tokens via `@theme inline` + `:root` in `src/styles.css` (sidebar bg, primary amber, etc.). Use semantic classes (`bg-sidebar`, `bg-primary`) — no hardcoded hex in components.
- Framer Motion already idiomatic; install if not present (`bun add framer-motion`).
- Responsive: sidebar collapses to a top hamburger on `<md` screens with slide-in drawer.
- Accessibility: modals trap focus, ESC closes, buttons have aria-labels.

## Out of scope

- Backend, persistence across reloads, auth, real file uploads, validation libraries.
