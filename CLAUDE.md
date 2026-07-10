# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite exists in this project.

## Architecture

Personal portfolio/design showcase site for Usman Khan, built with React 19 + Vite + TypeScript.

**Routing** (`src/App.tsx`): React Router v7 with a `RootLayout` wrapper (includes `ScrollToTop`). Routes map to individual project pages plus a dynamic `/art/:id` route.

**Pages** (`src/pages/`): Each project has its own page component. `Home.tsx` and `ProjectsPage.tsx` are the primary pages; the rest are individual design case studies. Pages are large, self-contained files with inline animation logic.

**Styling**: CSS Modules per component (`.module.css` files), global styles in `src/index.css`, and a CSS custom property theming system in `src/styles/colors.css` using OKLCH color values. No Tailwind.

**State**: Single React Context (`src/contexts/ProjectContext.tsx`) exposing `selectedProject` via a `useProject()` hook. Minimal global state — most state is local to components.

**Animation**: Heavy use of Framer Motion throughout pages and components. Shader/gradient backgrounds use `@paper-design/shaders-react` and `unicornstudio-react`.

**Responsive design**: `src/hooks/useBreakpoint.ts` detects `mobile`/`tablet`/`desktop` (calculated once on mount). `src/config/imageConfig.ts` stores per-breakpoint image dimensions and positions.

**Content data**: `src/config/artContent.json` drives the ProjectsPage gallery — add new art entries here.
