# Phase 1: Quick Start Guide

**Status**: Complete
**Date**: 2025-11-01

## Project Setup

### Prerequisites

- Node.js 18.x or higher
- pnpm package manager (recommended) or npm
- Git for version control
- GitHub account (for profile picture)

### Initial Setup

1. **Create Vite project**
```bash
pnpm create vite@latest linktree -- --template react-ts
cd linktree
pnpm install
```

2. **Install shadcn/ui**
```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p
pnpm add next-themes
```

Add shadcn/ui CLI:
```bash
pnpm add -D @shadcn-ui/ui
pnpm exec shadcn-ui init
```

3. **Install additional dependencies**
```bash
pnpm add axios
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

4. **Project structure initialization**
```bash
mkdir -p src/components/{ui,Skeletons}
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/styles
mkdir -p tests/{components,services,integration}
mkdir -p public
```

---

## File Structure Overview

```
linktree/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point with React.StrictMode
│   ├── index.css               # Global styles
│   │
│   ├── components/
│   │   ├── ProfileCard.tsx     # Skeleton loader while loading
│   │   ├── LinksList.tsx       # Container for links
│   │   ├── LinkButton.tsx      # Individual link component
│   │   ├── Skeletons/
│   │   │   ├── ProfileSkeleton.tsx
│   │   │   └── LinkSkeleton.tsx
│   │   └── ui/                 # shadcn/ui imports
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── skeleton.tsx
│   │
│   ├── pages/
│   │   └── Home.tsx            # Landing page
│   │
│   ├── services/
│   │   ├── githubApi.ts        # GitHub API client
│   │   ├── dataLoader.ts       # Load data.json
│   │   └── types.ts            # TypeScript interfaces
│   │
│   ├── hooks/
│   │   ├── useGithubProfile.ts # Fetch profile from GitHub
│   │   └── useLinktreeData.ts  # Load linktree config
│   │
│   └── styles/
│       └── globals.css         # Tailwind imports
│
├── public/
│   ├── data.json               # Linktree configuration
│   └── vite.svg                # Vite logo (optional)
│
├── tests/
│   ├── components/
│   │   ├── ProfileCard.test.tsx
│   │   └── LinkButton.test.tsx
│   ├── services/
│   │   └── githubApi.test.ts
│   └── integration/
│       └── app.test.tsx
│
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind configuration
├── vitest.config.ts            # Vitest configuration
├── package.json
├── package-lock.json (or pnpm-lock.yaml)
└── README.md
```

---

## Key Files to Create

### 1. src/services/types.ts

```typescript
// Type definitions for the entire application
export interface Profile {
  name: string;
  bio: string;
  gitHubUsername: string;
  socialMediaHandle?: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  order: number;
}

export interface LinktreeData {
  version: string;
  profile: Profile;
  links: Link[];
}

export interface GitHubUser {
  avatar_url: string;
  name?: string;
  bio?: string;
}
```

### 2. src/services/dataLoader.ts

```typescript
// Load linktree data from public/data.json
import { LinktreeData } from './types';

export async function loadLinktreeData(): Promise<LinktreeData> {
  const response = await fetch('/data.json');
  if (!response.ok) {
    throw new Error(`Failed to load data.json: ${response.status}`);
  }
  return response.json();
}
```

### 3. src/services/githubApi.ts

```typescript
// Fetch user profile from GitHub API
import { GitHubUser } from './types';

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error(`GitHub user ${username} not found`);
  }
  return response.json();
}
```

### 4. src/hooks/useLinktreeData.ts

```typescript
// Custom hook for loading linktree data
import { useEffect, useState } from 'react';
import { loadLinktreeData } from '../services/dataLoader';
import { LinktreeData } from '../services/types';

export function useLinktreeData() {
  const [data, setData] = useState<LinktreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLinktreeData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

### 5. src/hooks/useGithubProfile.ts

```typescript
// Custom hook for loading GitHub profile
import { useEffect, useState } from 'react';
import { getGitHubUser } from '../services/githubApi';
import { GitHubUser } from '../services/types';

export function useGithubProfile(username: string) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    getGitHubUser(username)
      .then((user) => setAvatar(user.avatar_url))
      .catch((err) => {
        console.error('Failed to fetch GitHub profile:', err);
        // Set default avatar on error
        setAvatar(`https://unavatar.io/github/${username}`);
      })
      .finally(() => setLoading(false));
  }, [username]);

  return { avatar, loading, error };
}
```

### 6. src/components/ProfileSkeleton.tsx

```typescript
// Loading skeleton for profile
import { Skeleton } from './ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <Skeleton className="w-32 h-32 rounded-full mx-auto" />
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
    </div>
  );
}
```

### 7. public/data.json

```json
{
  "version": "1.0.0",
  "profile": {
    "name": "Your Name",
    "bio": "Your bio here",
    "gitHubUsername": "yourusername",
    "socialMediaHandle": "@yourhandle"
  },
  "links": [
    {
      "id": "github",
      "title": "GitHub",
      "url": "https://github.com/yourusername",
      "icon": "🔗",
      "description": "My projects",
      "order": 0
    },
    {
      "id": "portfolio",
      "title": "Portfolio",
      "url": "https://yourportfolio.com",
      "icon": "💼",
      "order": 1
    }
  ]
}
```

---

## Development Workflow

### Running the Project

```bash
# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Adding shadcn/ui Components

```bash
# Add individual components as needed
pnpm exec shadcn-ui add button
pnpm exec shadcn-ui add card
pnpm exec shadcn-ui add skeleton
```

### Environment Setup

Create `.env.local` (if needed):
```
VITE_APP_TITLE=My Linktree
```

Access in components:
```typescript
import.meta.env.VITE_APP_TITLE
```

---

## Component Development Checklist

When creating new components:

- [ ] Component accepts proper TypeScript props interface
- [ ] Component includes loading/skeleton state
- [ ] Component handles errors gracefully
- [ ] Component is responsive (mobile-first design)
- [ ] Component uses shadcn/ui components internally
- [ ] Component includes JSDoc comments
- [ ] Component has unit tests
- [ ] Component is accessible (semantic HTML, ARIA labels)

---

## Testing Guidelines

### Unit Tests Example

```typescript
import { render, screen } from '@testing-library/react';
import { ProfileCard } from './ProfileCard';

describe('ProfileCard', () => {
  it('renders profile information', () => {
    const profile = {
      name: 'Test User',
      bio: 'Test bio',
      gitHubUsername: 'testuser',
    };

    render(<ProfileCard profile={profile} avatarUrl="..." />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
```

### Component Tests Example

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('loads and displays linktree data', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components if needed (rare for this project)
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Bundle Analysis

```bash
# Install size analyzer
npm install -D vite-plugin-visualizer

# Then analyze after build
npm run build
```

### Lighthouse Target Checks

```bash
# Use Chrome DevTools Lighthouse
# Target: Performance 90+, Accessibility 95+, SEO 95+
```

---

## Deployment to GitHub Pages

### Configuration

1. **Update vite.config.ts**
```typescript
export default {
  base: '/linktree/',  // if deploying to github.com/username/linktree
  // or just '/' if it's your user site
}
```

2. **Add GitHub Actions workflow** (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **Configure GitHub repository**
   - Go to Settings → Pages
   - Set source to "GitHub Actions"
   - Add custom domain if desired

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page on deploy | Check `base` in vite.config.ts matches repo structure |
| CORS errors | GitHub API requests should work without auth token |
| Slow loading | Run `npm run build` and check bundle size with visualizer |
| Styles not applying | Ensure tailwind.config.js is properly configured |
| TypeScript errors | Run `tsc --noEmit` to check all errors |

---

## Next Steps

1. Complete Phase 2 with `/speckit.tasks` to generate implementation tasks
2. Start coding according to task breakdown
3. Run tests regularly during development
4. Monitor Lighthouse scores
5. Deploy and iterate based on user feedback

---

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
