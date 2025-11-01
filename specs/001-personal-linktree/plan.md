# Implementation Plan: Personal Linktree Interface

**Branch**: `001-personal-linktree` | **Date**: 2025-11-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personal-linktree/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a minimalist, static personal linktree interface hosted on GitHub Pages. The application will load profile data (name, bio, GitHub username) and links from a data.json file, fetch the profile picture from GitHub API, and display everything using shadcn/ui components with skeleton loaders for better UX. Built with Vite + React + TypeScript for fast development and optimized production builds.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.x
**Primary Dependencies**:
  - Vite 5.x (build tool)
  - React 18.x (UI framework)
  - shadcn/ui (component library)
  - Tailwind CSS 3.x (styling)
  - Axios or Fetch API (HTTP client for GitHub API)

**Storage**: Static JSON file (data.json in public directory) + GitHub API
**Testing**: Vitest for unit tests, React Testing Library for component tests
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+)
**Project Type**: Single-page web application (SPA)
**Performance Goals**:
  - Page load under 2 seconds on 3G connection
  - Lighthouse scores: Performance 90+, Accessibility 95+, SEO 95+
  - First Contentful Paint (FCP) < 1.5 seconds

**Constraints**:
  - Must work without backend server (static hosting on GitHub Pages)
  - Profile picture must load from public GitHub API (no authentication required)
  - All data must be statically defined in data.json
  - Bundle size < 200KB gzipped

**Scale/Scope**:
  - Single landing page with profile and link list
  - Support for up to 50 links
  - Responsive design for mobile/tablet/desktop

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASS (No constitution defined in project - using standard web development practices)

- ✓ Single project (no multi-project complexity)
- ✓ Clear purpose: Personal linktree interface
- ✓ Minimal dependencies (Vite, React, shadcn/ui, Tailwind)
- ✓ Static deployment target (GitHub Pages)
- ✓ No organizational-only dependencies

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── App.tsx                 # Main application component
├── main.tsx                # Entry point
├── index.css               # Global styles
│
├── components/             # Reusable UI components
│   ├── ProfileCard.tsx     # Profile header with avatar
│   ├── LinksList.tsx       # Links container
│   ├── LinkButton.tsx      # Individual link button
│   ├── Skeletons/
│   │   ├── ProfileSkeleton.tsx
│   │   └── LinkSkeleton.tsx
│   └── ui/                 # shadcn/ui component imports
│
├── pages/
│   └── Home.tsx            # Main landing page
│
├── services/
│   ├── githubApi.ts        # GitHub API integration
│   ├── dataLoader.ts       # Load data.json
│   └── types.ts            # TypeScript interfaces
│
├── hooks/
│   ├── useGithubProfile.ts # Fetch GitHub profile
│   └── useLinktreeData.ts  # Load linktree data
│
└── styles/
    └── globals.css         # Tailwind setup

public/
├── data.json               # Linktree configuration

tests/
├── components/
│   ├── ProfileCard.test.tsx
│   └── LinkButton.test.tsx
├── services/
│   └── githubApi.test.ts
└── integration/
    └── app.test.tsx

vite.config.ts             # Vite configuration
tsconfig.json              # TypeScript configuration
tailwind.config.js         # Tailwind configuration
```

**Structure Decision**: Web application structure (Option 2) with frontend-only setup. Single SPA entry point with component-driven architecture. shadcn/ui components in dedicated ui/ subdirectory. Services layer for API and data loading. Custom hooks for data fetching logic. Tests organized by type (unit, component, integration).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
