# Phase 0: Research & Decisions

**Status**: Complete
**Date**: 2025-11-01

## Research Areas Covered

### 1. Vite + React + TypeScript Setup

**Decision**: Use Vite as the primary build tool with React 18 and TypeScript

**Rationale**:
- Vite offers significantly faster development server (< 100ms HMR)
- Smaller production bundles compared to Create React App
- Native TypeScript support without additional configuration
- Perfect for static hosting on GitHub Pages
- Growing ecosystem and strong community support

**Alternatives Considered**:
- Create React App: slower build times, larger bundles, less flexible configuration
- Next.js: overkill for static single-page application, adds complexity
- Astro: better for static content but less flexible for React interactivity

### 2. shadcn/ui Component Library

**Decision**: Use shadcn/ui with Tailwind CSS for UI components

**Rationale**:
- Copy-and-paste component library (no node_modules bloat)
- Fully customizable with Tailwind CSS
- Minimalist aesthetic aligns with Linktree design philosophy
- Built on Radix UI for accessibility
- Can selectively import only needed components to reduce bundle size

**Alternatives Considered**:
- Material UI: too heavy, not minimalist enough
- Chakra UI: larger bundle size
- Bootstrap: doesn't match minimalist design goals
- Headless UI: requires more manual styling

### 3. GitHub API for Profile Pictures

**Decision**: Fetch profile images from public GitHub API (https://api.github.com/users/{username})

**Rationale**:
- No authentication required for public data
- Users don't need to host images separately
- Automatic avatar fallback built into GitHub API
- Lightweight and efficient endpoint
- CORS-friendly

**Alternatives Considered**:
- Direct image upload to repository: requires image management, increases bundle
- Third-party avatar services: adds dependency, potential reliability issues
- Gravatar API: requires email hashes, less direct integration

### 4. Static Data Storage (data.json)

**Decision**: Store all profile and link data in public/data.json

**Rationale**:
- Simple, human-readable format (JSON)
- No build step required for changes (easy manual editing)
- Cacheable by browsers and CDNs
- Works perfectly with static hosting
- Easy to version control

**Alternatives Considered**:
- YAML: additional parser dependency
- TOML: more complex for simple use case
- API endpoint: requires backend server (against project goals)
- Environment variables: less suitable for dynamic data lists

### 5. Skeleton Loaders

**Decision**: Implement skeleton UI components for ProfileCard, LinksList

**Rationale**:
- Improves perceived performance during data loading
- Better user experience than blank loading states
- Can be built with shadcn/ui Skeleton component
- Matches modern UX patterns
- Minimal performance overhead

### 6. Testing Framework

**Decision**: Vitest for unit tests + React Testing Library for component tests

**Rationale**:
- Vitest: Vite-native testing framework, faster than Jest
- React Testing Library: encourages testing user behavior, not implementation
- Both have excellent TypeScript support
- Smaller learning curve for Vite-based projects

**Alternatives Considered**:
- Jest: heavier, slower with Vite setup
- Mocha + Chai: more verbose, less opinionated
- Playwright: overkill for component testing

### 7. Bundle Size Optimization

**Decision**: Target < 200KB gzipped with code splitting and dynamic imports

**Rationale**:
- Critical for fast loading on GitHub Pages
- Vite's native tree-shaking helps achieve this
- shadcn/ui's copy-paste approach allows selective imports
- React is ~40KB gzipped, shadcn/ui components ~20-30KB
- Data fetching logic and styles add ~20KB

### 8. Responsive Design Approach

**Decision**: Mobile-first approach with Tailwind CSS responsive utilities

**Rationale**:
- Most linktree users access from mobile devices
- Tailwind's responsive prefixes (sm:, md:, lg:) make this natural
- Mobile-first ensures good UX across all devices
- Easier to maintain than separate mobile/desktop code paths

## Technology Stack Summary

| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| Build Tool | Vite | 5.x | Fast HMR, small bundles, static hosting friendly |
| Frontend Framework | React | 18.x | Component-based, large ecosystem, familiar |
| Language | TypeScript | 5.x | Type safety, better IDE support, fewer runtime errors |
| Component Library | shadcn/ui | Latest | Copy-paste, customizable, minimalist |
| Styling | Tailwind CSS | 3.x | Utility-first, fast development, small bundles |
| HTTP Client | Fetch API | Native | No dependencies, modern, sufficient for simple requests |
| Testing | Vitest + RTL | Latest | Fast, modern, Vite-native |
| Hosting | GitHub Pages | - | Free, easy, perfect for static sites |

## Implementation Approach

1. Initialize Vite project with React + TypeScript template
2. Install and configure shadcn/ui with Tailwind CSS
3. Create data loading services (GitHub API + data.json parser)
4. Build component hierarchy with skeleton loaders
5. Implement responsive design with Tailwind
6. Add unit and integration tests
7. Configure GitHub Pages deployment
8. Optimize bundle size and Lighthouse scores

## Open Questions Resolved

- ✓ Profile picture source: GitHub API public endpoint
- ✓ Data storage: Static JSON file in public directory
- ✓ Design philosophy: Minimalist, similar to official Linktree
- ✓ Component loading states: Skeleton UI components
- ✓ Target browsers: Modern (Chrome 90+, Firefox 88+, Safari 14+)

## Next Steps (Phase 1)

- Create detailed data model documentation
- Generate API/contract specifications
- Create quick-start guide for developers
- Set up project structure and configuration files
