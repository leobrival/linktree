# Tasks: Personal Linktree Interface

**Input**: Design documents from `/specs/001-personal-linktree/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks grouped by user story priority (P1, P2) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[ID]**: Task identifier (T001, T002, etc.)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3, US4)
- Exact file paths included for each task

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite project with React 18 + TypeScript 5 using `pnpm create vite@latest linktree -- --template react-ts && cd linktree && pnpm install`
- [x] T002 [P] Install Tailwind CSS and configure in `tailwind.config.js` and `postcss.config.js`
- [x] T003 [P] Install and configure shadcn/ui CLI for component management
- [x] T004 [P] Install additional dependencies (axios, vitest, @testing-library/react) in `pnpm` dependency list
- [x] T005 Create directory structure: `src/{components,pages,services,hooks,styles}`, `public/`, `tests/{components,services,integration}`

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure and configuration that blocks all user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Configure TypeScript strict mode in `tsconfig.json`
- [x] T007 Create `src/services/types.ts` with all interfaces: Profile, Link, LinktreeData, GitHubUser
- [x] T008 [P] Create `src/services/dataLoader.ts` for loading public/data.json with error handling
- [x] T009 [P] Create `src/services/githubApi.ts` for fetching GitHub user avatars with fallback handling
- [x] T010 Create `src/styles/globals.css` with Tailwind imports and base styles
- [x] T011 [P] Add shadcn/ui components: `npx shadcn-ui add button card skeleton` in `src/components/ui/`
- [x] T012 Create `src/hooks/useLinktreeData.ts` custom hook for loading data.json with loading/error states
- [x] T013 Create `src/hooks/useGithubProfile.ts` custom hook for fetching GitHub profile with caching
- [x] T014 Create `src/main.tsx` entry point with React.StrictMode
- [x] T015 Create `vite.config.ts` with GitHub Pages base path configuration
- [x] T016 Create `.env.example` with GitHub Pages repository configuration
- [x] T017 Create `public/data.json` template with example profile and links
- [x] T018 [P] Configure Vitest in `vitest.config.ts` and add test scripts to `package.json`
- [x] T019 Create `.github/workflows/deploy.yml` GitHub Actions workflow for automatic deployment

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Personal Link Dashboard (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Display a clean dashboard with profile information and link list when page loads

**Independent Test**: Load the page in browser, verify profile picture, name, bio, and 3+ links displayed with skeleton loaders during fetch

### Components for User Story 1

- [x] T020 [P] [US1] Create `src/components/Skeletons/ProfileSkeleton.tsx` using shadcn/ui Skeleton with avatar and text placeholders
- [x] T021 [P] [US1] Create `src/components/Skeletons/LinkSkeleton.tsx` using shadcn/ui Skeleton mimicking LinkButton layout
- [x] T022 [US1] Create `src/components/ProfileCard.tsx` component accepting profile, avatarUrl, loading, error props; show ProfileSkeleton while loading
- [x] T023 [US1] Create `src/components/LinksList.tsx` component accepting links array, loading, error props; show 5 LinkSkeleton while loading; sort links by order property
- [x] T024 [P] [US1] Create `src/components/LinkButton.tsx` component for individual link with icon, title, description; opens URL in new tab on click
- [x] T025 [US1] Create `src/pages/Home.tsx` page component orchestrating ProfileCard and LinksList
- [x] T026 [US1] Create `src/App.tsx` main component integrating useLinktreeData and useGithubProfile hooks; render Home page with error handling
- [x] T027 [US1] Update `src/index.css` with responsive Tailwind base styles for mobile-first design
- [x] T028 [US1] Create `public/data.json` with sample profile (name, bio, gitHubUsername) and 5 example links with icons

### Styling for User Story 1

- [x] T029 [US1] Add responsive Tailwind classes for ProfileCard: container width, avatar sizing, text hierarchy
- [x] T030 [US1] Add responsive Tailwind classes for LinksList and LinkButton: padding, spacing, touch targets (min 44x44px)
- [x] T031 [US1] Implement mobile-first breakpoints: base (mobile 375px), md (tablet 768px), lg (desktop 1024px)

### Testing for User Story 1 (OPTIONAL - test in browser)

- [x] T032 [US1] Manual test: Load page and verify dashboard renders with profile picture, name, bio visible
- [x] T033 [US1] Manual test: Verify skeleton loaders show while data is loading (add 2s delay in service for testing)
- [x] T034 [US1] Manual test: Verify all 3+ links display with correct order and styling
- [x] T035 [US1] Manual test: Verify responsive layout on mobile (375px), tablet (768px), desktop (1920px) using DevTools

**Checkpoint**: User Story 1 complete - dashboard fully functional with skeleton loaders and responsive design ✅

---

## Phase 4: User Story 2 - Click and Navigate to External Links (Priority: P1) ✅ COMPLETE

**Goal**: All links are clickable and navigate to correct URLs in new tabs

**Independent Test**: Click each link, verify correct URL opens in new tab, verify page data unchanged after navigation

### Implementation for User Story 2

- [x] T036 [US2] Update `src/components/LinkButton.tsx` to use `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"`
- [x] T037 [US2] Add URL validation in `src/services/types.ts` - ensure URLs start with http:// or https://
- [x] T038 [US2] Update `src/services/dataLoader.ts` to validate all links have valid URLs; log warnings for invalid URLs
- [x] T039 [US2] Add error boundary in `src/App.tsx` for graceful error handling if link navigation fails

### Testing for User Story 2 (OPTIONAL - test in browser)

- [x] T040 [US2] Manual test: Click each link and verify correct URL opens in new browser tab
- [x] T041 [US2] Manual test: Close opened tab and verify dashboard still displays all links unchanged
- [x] T042 [US2] Manual test: Click multiple links sequentially and verify all open correct destinations
- [x] T043 [US2] Manual test: Test with invalid URL and verify handling (warning logged, link still clickable)

**Checkpoint**: User Story 1 + 2 complete - full MVP with dashboard display and navigation ✅

---

## Phase 5: User Story 3 - Customize Linktree Data (Priority: P2) ✅ COMPLETE

**Goal**: Users can edit data.json to customize profile and links without touching code

**Independent Test**: Edit data.json, rebuild, reload page, verify changes applied

### Documentation for User Story 3

- [x] T044 [P] [US3] Create `DATA_FORMAT.md` documenting data.json structure, field validation rules, example JSON
- [x] T045 [P] [US3] Create `CUSTOMIZATION.md` with step-by-step guide: edit data.json, add/remove links, change profile
- [x] T046 [US3] Add comments in `public/data.json` explaining each field and constraints (max 160 chars bio, valid URLs, etc.)

### Implementation for User Story 3

- [x] T047 [US3] Update `src/services/dataLoader.ts` with comprehensive validation: profile fields, link fields, collection size (1-50 links)
- [x] T048 [US3] Create validation error messages in `src/services/dataLoader.ts` showing which field failed validation
- [x] T049 [US3] Update `src/App.tsx` to display validation errors user-friendly: "Please check data.json - [field] is invalid"
- [x] T050 [US3] Add console warnings for non-critical issues: missing optional fields, icon recommendations

### Testing for User Story 3 (OPTIONAL - test in browser)

- [x] T051 [US3] Manual test: Edit `public/data.json` - change name, bio, add new link, rebuild with `npm run build`, reload and verify changes
- [x] T052 [US3] Manual test: Add invalid JSON to `public/data.json` and verify error message displays
- [x] T053 [US3] Manual test: Add 60 links and verify only first 50 displayed with warning
- [x] T054 [US3] Manual test: Reorder links by changing order property and verify new order displayed

**Checkpoint**: User Stories 1, 2, and 3 complete - full feature with customization ✅

---

## Phase 6: User Story 4 - Mobile-Optimized Experience (Priority: P2) ✅ COMPLETE

**Goal**: Fully optimized mobile experience with proper touch targets and readable text

**Independent Test**: Access on mobile device (real or emulated), verify no horizontal scroll, 44x44px touch targets, readable 16px+ fonts

### Mobile Optimization for User Story 4

- [x] T055 [US4] Audit all touch targets: ProfileCard avatar (32x32 min), LinkButton (full width, 44px min height), ensure spacing between clickable areas
- [x] T056 [US4] Verify font sizes: base 16px, headings 20px+, descriptions 14px+ on mobile for readability (DevTools mobile view)
- [x] T057 [US4] Test horizontal scrolling: use DevTools 375px width, verify no overflow, all content visible
- [x] T058 [US4] Verify spacing and padding: consistent 16px padding on mobile, increases to 24px on tablet, 32px on desktop
- [x] T059 [US4] Add viewport meta tag in `index.html`: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [x] T060 [US4] Test on real mobile devices or Chrome DevTools emulation: iPhone 12 (390px), Samsung Galaxy (412px), iPad (768px)

### Accessibility for User Story 4

- [x] T061 [US4] Verify semantic HTML: use `<h1>` for name, `<h2>` for section headings, `<a>` for links
- [x] T062 [US4] Add ARIA labels: avatar alt text, error messages announced to screen readers
- [x] T063 [US4] Verify keyboard navigation: Tab through all interactive elements, Enter opens links
- [x] T064 [US4] Check contrast ratios: text/background minimum 4.5:1 for WCAG AA compliance using WebAIM

### Testing for User Story 4 (OPTIONAL - test in DevTools)

- [x] T065 [US4] Chrome DevTools mobile emulation: 375px width, verify no horizontal scroll, all content visible
- [x] T066 [US4] DevTools mobile: verify touch targets at least 44x44px with adequate spacing
- [x] T067 [US4] DevTools mobile: test font readability - base 16px, no content cut off
- [x] T068 [US4] Accessibility audit: Chrome DevTools → Lighthouse → Accessibility, target score 95+
- [x] T069 [US4] Real device test (if available): verify smooth scrolling, no layout shift, proper spacing on actual mobile

**Checkpoint**: All user stories complete - full feature with mobile optimization and accessibility ✅

---

## Phase 7: Performance & Deployment ✅ COMPLETE

**Purpose**: Optimize performance and configure production deployment

- [x] T070 [P] Run Lighthouse audit: target Performance 90+, Accessibility 95+, SEO 95+
- [x] T071 [P] Analyze bundle size with `pnpm build` and verify < 200KB gzipped (check dist/ folder size)
- [x] T072 [P] Optimize images: compress profile picture, optimize any other assets
- [x] T073 [P] Configure Vite production build: `vite.config.ts` minification, source maps for debugging
- [x] T074 Create `.github/workflows/deploy.yml` workflow to auto-deploy on push to main branch (use pnpm)
- [x] T075 Configure GitHub Pages: Settings → Pages → set source to "GitHub Actions"
- [x] T076 Test deployment: push to main branch, verify GitHub Actions runs, site accessible at `https://username.github.io/linktree`
- [x] T077 [P] Add cache headers in `vite.config.ts`: 24h cache for data.json, 7d for static assets
- [x] T078 Test production build locally: `pnpm build && pnpm preview`, verify all features work

---

## Phase 8: Polish & Documentation ✅ COMPLETE

**Purpose**: Final improvements and documentation

- [x] T079 [P] Create comprehensive `README.md` with: setup instructions, feature overview, customization guide, deployment steps
- [x] T080 [P] Create `DEVELOPMENT.md` with: development environment setup, file structure explanation, how to add new links
- [x] T081 [P] Update `package.json`: add keywords, description, repository URL, author information
- [x] T082 Add `.gitignore`: node_modules/, dist/, .env.local, .DS_Store
- [x] T083 Create `TROUBLESHOOTING.md`: common issues (blank page on deploy, GitHub API rate limit, etc.) with solutions
- [x] T084 [P] Add code comments in complex functions: GitHub API fallback logic, data validation logic
- [x] T085 Clean up unused dependencies and optimize imports
- [x] T086 Run `pnpm build` final verification: check bundle size, verify no console warnings/errors
- [x] T087 Test with different browsers: Chrome, Firefox, Safari - verify compatibility

**Checkpoint**: Polish complete, ready for production ✅

---

## Phase 9: Final Validation & Launch ✅ COMPLETE

**Purpose**: Comprehensive testing before public launch

- [x] T088 Final Lighthouse audit in production: Performance 90+, Accessibility 95+, SEO 95+, Best Practices 90+
- [x] T089 Test all user stories end-to-end: profile displays, links click, responsive layout, mobile optimized
- [x] T090 Verify GitHub Pages deployment: custom domain (if applicable), HTTPS working, no 404 errors
- [x] T091 Test with sample data.json: verify customization works, changes appear after rebuild
- [x] T092 [P] Cross-browser testing: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- [x] T093 [P] Test on multiple devices: desktop (1920px), tablet (768px), mobile (375px), verify responsive
- [x] T094 Create demo/screenshot for documentation
- [x] T095 Launch! - Share repository and live site

**Checkpoint**: All tasks complete - feature ready for production ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 completion - BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 completion - MVP story
- **Phase 4 (US2)**: Depends on Phase 2 (can work parallel with US1 if needed)
- **Phase 5 (US3)**: Depends on Phase 2 (can work parallel with US1/US2)
- **Phase 6 (US4)**: Depends on Phase 2 (can work parallel with US1/US2/US3)
- **Phase 7 (Performance)**: Depends on user story completion
- **Phase 8 (Polish)**: Depends on user story completion
- **Phase 9 (Validation)**: All previous phases

### User Story Execution

**MVP Strategy (Recommended for Solo Developer)**:
1. Complete Phase 1 + 2 (Foundation - ~2 hours)
2. Complete Phase 3 + 4 (US1 + US2 - ~3 hours) ← **MVP READY**
3. Deploy and test
4. Complete Phase 5 (US3 - ~1 hour) if users request customization
5. Complete Phase 6 (US4 - ~2 hours) for mobile users
6. Complete Phases 7-9 for production polish

**Parallel Strategy (Team of 3+)**:
1. All work Phase 1 + 2 together (~2 hours)
2. Developer A: Phase 3 (US1) + 4 (US2)
3. Developer B: Phase 5 (US3) + 6 (US4)
4. Developer C: Phase 7 + 8 (Performance + Polish)
5. All: Phase 9 (Final validation)

### Parallel Opportunities

- All [P] marked tasks can run in parallel within their phase
- Phase 1: T002, T003, T004 can run simultaneously
- Phase 2: T008, T009, T011, T013, T018 can run simultaneously
- Phase 3 (US1): T020, T021 (skeleton components) can run in parallel
- Phase 3 (US1): T022, T023, T024 (main components) can run sequentially (dependencies)
- Phase 7: T070, T071, T072, T073, T077 can run in parallel

---

## Implementation Notes

- Each [P] task = different files, zero dependencies on other tasks
- Each [Story] label = traceable to user story for feature management
- Each user story should be independently completable and testable
- **MVP Checkpoint**: After Phase 3 + 4, you have a working linktree (US1 + US2)
- **Feature Complete**: After Phase 5 + 6, all user stories complete
- **Production Ready**: After Phase 7 + 8, optimized for performance and documented
- **Validated**: After Phase 9, comprehensive testing complete
- Stop at any checkpoint to demo/deploy that increment
- Avoid: vague tasks, same file conflicts, cross-story dependencies

---

## Success Criteria (from spec.md)

By completion, verify:
- ✅ SC-001: Page loads in < 2 seconds on 3G connection
- ✅ SC-002: All links clickable and open correct URLs 100%
- ✅ SC-003: Responsive on 375px-1920px viewports
- ✅ SC-004: Lighthouse Performance 90+, Accessibility 95+, SEO 95+
- ✅ SC-005: Config changes deployed in < 5 minutes
- ✅ SC-006: Zero console errors/warnings in production
- ✅ SC-007: Clear visual hierarchy for links

---

## Quick Reference: Task IDs by Phase

| Phase | Range | Purpose |
|-------|-------|---------|
| 1 | T001-T005 | Project setup |
| 2 | T006-T019 | Foundation/infrastructure |
| 3 | T020-T035 | User Story 1 (Dashboard) |
| 4 | T036-T043 | User Story 2 (Navigation) |
| 5 | T044-T054 | User Story 3 (Customization) |
| 6 | T055-T069 | User Story 4 (Mobile) |
| 7 | T070-T078 | Performance & Deployment |
| 8 | T079-T087 | Documentation & Polish |
| 9 | T088-T095 | Final Validation & Launch |

---

## Commit Strategy

Commit after completing each task or logical group:

```bash
# After Phase 1
git commit -m "feat: Initialize Vite project with React, TypeScript, Tailwind, shadcn/ui"

# After Phase 2
git commit -m "feat: Setup foundation - services, hooks, types, configuration"

# After Phase 3
git commit -m "feat(US1): Implement profile dashboard with skeleton loaders and responsive design"

# After Phase 4
git commit -m "feat(US2): Add link navigation with URL validation and error handling"

# After Phase 5
git commit -m "docs(US3): Add customization guides and data validation"

# etc...
```
