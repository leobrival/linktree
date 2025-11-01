# Phase 1: Data Model

**Status**: Complete
**Date**: 2025-11-01

## Entity Definitions

### Profile Entity

Represents the linktree owner's profile information.

```typescript
interface Profile {
  name: string;           // Owner's display name (required)
  bio: string;            // Short bio/tagline (required, max 160 chars)
  gitHubUsername: string; // GitHub username for fetching avatar (required)
  socialMediaHandle?: string; // Optional social media handle or URL (e.g., @username)
}
```

**Validation Rules**:
- `name`: 1-100 characters, non-empty
- `bio`: 0-160 characters (recommended)
- `gitHubUsername`: Valid GitHub username format (alphanumeric, hyphens allowed)
- `socialMediaHandle`: 0-200 characters, optional

**Storage Location**: Top-level property in data.json

---

### Link Entity

Represents a single link in the linktree collection.

```typescript
interface Link {
  id: string;             // Unique identifier (UUID or slug)
  title: string;          // Display title (required)
  url: string;            // Destination URL (required)
  icon?: string;          // Icon identifier/emoji (optional)
  description?: string;   // Additional description (optional)
  order: number;          // Display order (required, starting from 0)
}
```

**Validation Rules**:
- `id`: Unique within links array, alphanumeric with hyphens allowed
- `title`: 1-100 characters, non-empty
- `url`: Valid URL format (http:// or https://)
- `icon`: Single emoji or icon identifier (optional)
- `description`: 0-200 characters, optional
- `order`: Non-negative integer, should be sequential

**Data Constraints**:
- Maximum 50 links per linktree
- Links are sorted by `order` property in ascending order
- Duplicate URLs are allowed (but not recommended)
- All URLs must use secure HTTPS protocol when deployed to production

---

### Linktree Data Model (Root)

The complete data structure stored in data.json.

```typescript
interface LinktreeData {
  version: string;  // Data schema version (e.g., "1.0.0")
  profile: Profile;
  links: Link[];
}
```

**File Location**: `public/data.json`

**File Format**: Valid JSON (parsed via `JSON.parse()`)

**Size Constraints**:
- Target: < 50KB uncompressed
- Supports up to 50 links without noticeable performance impact

---

## State Management

### Application State

The application maintains minimal runtime state:

```typescript
interface AppState {
  // Profile state
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;

  // Links state
  links: Link[];
  linksLoading: boolean;
  linksError: string | null;

  // GitHub avatar state
  avatarUrl: string | null;
  avatarLoading: boolean;
  avatarError: string | null;
}
```

**State Origin**:
- Profile and Links: Loaded from public/data.json via fetch
- Avatar URL: Fetched from GitHub API based on gitHubUsername
- All errors: Gracefully handled with fallback UI

**State Transitions**:
1. Initial: All loading = true, data = null
2. Loading: Profile and links fetch in parallel with avatar fetch
3. Success: All data populated, errors = null
4. Error: Partial state available, errors populated with messages

---

## Data Relationships

```
LinktreeData
├── Profile (1:1)
│   └── GitHub Avatar (fetched via API)
└── Links (1:many)
    ├── Link 1
    ├── Link 2
    └── ... (up to 50)
```

**Relationships**:
- **One Profile per Linktree**: Each linktree has exactly one profile
- **Multiple Links per Profile**: Links are ordered and independent
- **External Avatar Reference**: Avatar fetched from external GitHub API endpoint

---

## Data Validation Rules

### Profile Validation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | 1-100 chars, non-empty trim |
| bio | string | Yes | 0-160 chars, can be empty string |
| gitHubUsername | string | Yes | Valid GitHub username, non-empty |
| socialMediaHandle | string | No | 0-200 chars if provided |

### Link Validation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| id | string | Yes | Unique in links array |
| title | string | Yes | 1-100 chars, non-empty trim |
| url | string | Yes | Valid HTTP(S) URL format |
| icon | string | No | Single emoji or icon ID |
| description | string | No | 0-200 chars if provided |
| order | number | Yes | Non-negative integer, sequential |

### Collection-Level Rules

- Links array must have at least 1 link
- Links array must have at most 50 links
- All order values must be unique and sequential (0 to N-1)
- No circular references (N/A for this model)

---

## Example data.json

```json
{
  "version": "1.0.0",
  "profile": {
    "name": "Leo Brival",
    "bio": "Full-stack developer, open source enthusiast",
    "gitHubUsername": "leobrival",
    "socialMediaHandle": "@leobrival"
  },
  "links": [
    {
      "id": "github",
      "title": "GitHub",
      "url": "https://github.com/leobrival",
      "icon": "🔗",
      "description": "My open source projects",
      "order": 0
    },
    {
      "id": "portfolio",
      "title": "Portfolio",
      "url": "https://leobrival.com",
      "icon": "💼",
      "description": "My work and projects",
      "order": 1
    },
    {
      "id": "twitter",
      "title": "Twitter",
      "url": "https://twitter.com/leobrival",
      "icon": "🐦",
      "order": 2
    }
  ]
}
```

---

## API Data Model

### GitHub API Response (Simplified)

When fetching user data from `GET /users/{username}`:

```typescript
interface GitHubUser {
  login: string;
  avatar_url: string;      // URL to user's avatar (guaranteed to exist)
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  // ... other fields (ignored)
}
```

**Usage**: Extract `avatar_url` for profile picture display

**Error Handling**:
- If 404: User doesn't exist → show default avatar
- If network error: Show skeleton loader, retry on component mount
- If rate limited (403): Cache response, show cached avatar

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                  App Component                          │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼─────────────┐      ┌───────▼────────────┐
   │ useLinktreeData  │      │ useGithubProfile   │
   │ (data.json)      │      │ (GitHub API)       │
   └────┬─────────────┘      └───────┬────────────┘
        │                             │
   ┌────▼──────────────┐      ┌───────▼────────────┐
   │ Profile + Links   │      │ Avatar URL         │
   │ Loading States    │      │ Loading States     │
   └────┬──────────────┘      └───────┬────────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Render Components         │
        │ - ProfileCard (with avatar) │
        │ - LinksList (sorted by      │
        │   order property)           │
        └─────────────────────────────┘
```

---

## Implementation Considerations

### Loading States
- Show skeleton loaders while data is fetching
- Profile and links load in parallel
- Avatar loading is independent (can show default while loading)

### Error Handling
- If data.json fails: Show error message with retry button
- If GitHub API fails: Show default avatar, don't block link display
- Parse errors: Log to console, show generic error message

### Performance
- data.json is cached by browser for 24 hours (cache headers)
- GitHub API responses cached locally for 1 hour
- No unnecessary re-fetches on component re-renders

### Caching Strategy
- Browser cache: 24 hours for data.json
- Local storage: 1 hour for GitHub API responses (optional optimization)
- No server-side caching needed (GitHub Pages)

---

## Version History

**v1.0.0** (2025-11-01):
- Initial data model with Profile and Link entities
- GitHub API integration for avatars
- Static JSON file storage
- Validation rules and constraints
