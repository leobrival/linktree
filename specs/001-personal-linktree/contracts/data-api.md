# Data API Contract

**Status**: Complete
**Version**: 1.0.0

## Overview

This document specifies the API contracts for data loading in the Personal Linktree application.

## 1. Load Linktree Data (data.json)

### Endpoint

```
GET /data.json
```

### Description

Fetches the complete linktree configuration including profile and links.

### Request

**Method**: GET
**Content-Type**: application/json
**Authentication**: None required

### Response

**Status**: 200 OK

```json
{
  "version": "1.0.0",
  "profile": {
    "name": "string",
    "bio": "string",
    "gitHubUsername": "string",
    "socialMediaHandle": "string (optional)"
  },
  "links": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "icon": "string (optional)",
      "description": "string (optional)",
      "order": "number"
    }
  ]
}
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| version | string | Yes | Schema version (e.g., "1.0.0") |
| profile | object | Yes | Profile information |
| profile.name | string | Yes | Display name (1-100 chars) |
| profile.bio | string | Yes | Short biography (0-160 chars) |
| profile.gitHubUsername | string | Yes | GitHub username for avatar |
| profile.socialMediaHandle | string | No | Social media handle |
| links | array | Yes | Array of links (0-50 items) |
| links[].id | string | Yes | Unique link identifier |
| links[].title | string | Yes | Display title (1-100 chars) |
| links[].url | string | Yes | Target URL (valid HTTP(S)) |
| links[].icon | string | No | Emoji or icon identifier |
| links[].description | string | No | Additional description |
| links[].order | number | Yes | Display order (0-based index) |

### Error Responses

**404 Not Found**: data.json file not found
```json
{
  "error": "Not Found"
}
```

**500 Internal Server Error**: Server error processing request
```json
{
  "error": "Internal Server Error"
}
```

### Cache Headers

```
Cache-Control: public, max-age=86400
ETag: [file-hash]
```

### Example Request

```bash
curl -X GET https://username.github.io/linktree/data.json
```

### Example Response

```json
{
  "version": "1.0.0",
  "profile": {
    "name": "Leo Brival",
    "bio": "Full-stack developer",
    "gitHubUsername": "leobrival",
    "socialMediaHandle": "@leobrival"
  },
  "links": [
    {
      "id": "github",
      "title": "GitHub",
      "url": "https://github.com/leobrival",
      "icon": "🔗",
      "description": "My projects",
      "order": 0
    }
  ]
}
```

---

## 2. GitHub API: Get User Profile

### Endpoint

```
GET https://api.github.com/users/{username}
```

### Description

Fetches public user profile data from GitHub API, primarily to get the avatar URL.

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | GitHub username |

### Request Headers

```
Accept: application/vnd.github.v3+json
User-Agent: linktree-app
```

### Response

**Status**: 200 OK

```json
{
  "login": "string",
  "id": "number",
  "avatar_url": "string (URL)",
  "url": "string",
  "name": "string (optional)",
  "company": "string (optional)",
  "blog": "string (optional)",
  "location": "string (optional)",
  "bio": "string (optional)",
  "twitter_username": "string (optional)",
  "public_repos": "number",
  "followers": "number",
  "following": "number",
  ...
}
```

### Response Fields (Relevant to Application)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| login | string | Yes | GitHub username |
| avatar_url | string | Yes | Avatar image URL |
| name | string | No | User's full name |
| bio | string | No | User's bio |
| public_repos | number | Yes | Number of public repositories |

### Error Responses

**404 Not Found**: User does not exist
```json
{
  "message": "Not Found",
  "documentation_url": "..."
}
```

**403 Forbidden**: API rate limit exceeded (60 requests/hour unauthenticated)
```json
{
  "message": "API rate limit exceeded for 127.0.0.1",
  "documentation_url": "..."
}
```

### Rate Limiting

- **Unauthenticated**: 60 requests per hour per IP
- **Response Headers**:
  - `X-RateLimit-Limit`: 60
  - `X-RateLimit-Remaining`: [count]
  - `X-RateLimit-Reset`: [unix-timestamp]

### Cache Headers

```
Cache-Control: public, max-age=60
ETag: [entity-tag]
Vary: Accept-Encoding
```

### Example Request

```bash
curl -X GET https://api.github.com/users/leobrival \
  -H "Accept: application/vnd.github.v3+json" \
  -H "User-Agent: linktree-app"
```

### Example Response

```json
{
  "login": "leobrival",
  "id": 12345678,
  "avatar_url": "https://avatars.githubusercontent.com/u/12345678?v=4",
  "url": "https://api.github.com/users/leobrival",
  "name": "Leo Brival",
  "company": null,
  "blog": "https://leobrival.com",
  "location": "France",
  "bio": "Full-stack developer",
  "twitter_username": "leobrival",
  "public_repos": 42,
  "followers": 100,
  "following": 50,
  "created_at": "2015-01-01T00:00:00Z",
  "updated_at": "2025-11-01T12:00:00Z"
}
```

---

## 3. Internal Data Loading Service

### Service: loadLinktreeData()

```typescript
async function loadLinktreeData(): Promise<LinktreeData>
```

**Description**: Loads linktree configuration from public/data.json

**Returns**:
- **Success**: LinktreeData object with validated profile and links
- **Error**: Throws Error with descriptive message

**Throws**:
- `Error('Failed to load data.json: [status]')` - Network or fetch error
- `Error('Invalid data format')` - JSON parse error
- `Error('Validation error: [field]')` - Data validation failed

**Implementation Notes**:
- Uses native Fetch API
- No authentication required
- Response cached by browser (24 hours)
- Errors logged to console

### Service: getGitHubUser()

```typescript
async function getGitHubUser(username: string): Promise<GitHubUser>
```

**Description**: Fetches user profile from GitHub API

**Parameters**:
- `username` (string): GitHub username

**Returns**:
- **Success**: GitHubUser object with avatar_url
- **Error**: Throws Error with descriptive message

**Throws**:
- `Error('GitHub user [username] not found')` - 404 response
- `Error('Failed to fetch GitHub profile')` - Network error
- `Error('Rate limited')` - 403 response

**Implementation Notes**:
- Uses native Fetch API
- No authentication token required
- 60 requests per hour per IP limit
- Errors gracefully handled with fallback avatar

---

## 4. Data Validation Contract

### Profile Validation Rules

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
}
```

**Profile Validation**:
- `name`: Required, 1-100 characters, non-empty after trim
- `bio`: Required, 0-160 characters
- `gitHubUsername`: Required, valid GitHub username format
- `socialMediaHandle`: Optional, 0-200 characters if provided

### Link Validation Rules

- `id`: Required, unique per links array
- `title`: Required, 1-100 characters, non-empty after trim
- `url`: Required, valid HTTP(S) URL format
- `icon`: Optional, single emoji or icon identifier
- `description`: Optional, 0-200 characters if provided
- `order`: Required, non-negative integer, sequential

### Collection Validation

- Links array: Minimum 1 link, maximum 50 links
- Links must be sorted by `order` property
- All order values must be unique

---

## Error Handling Strategy

### Client-Side Error Handling

| Error | Handling |
|-------|----------|
| data.json 404 | Show error message with retry button |
| data.json parse error | Show generic error message, check console |
| GitHub API 404 | Use fallback avatar, continue loading |
| GitHub API rate limit | Cache previous response, show cached avatar |
| Network timeout | Show error with automatic retry after 3 seconds |

### Fallback Avatar

When GitHub API fails, use fallback:
```
https://unavatar.io/github/{username}
```

Or simple default:
```
https://api.github.com/users/ghost/avatar_url
```

---

## Testing Contract

### Unit Test Examples

```typescript
// Test data loading success
describe('loadLinktreeData', () => {
  it('returns valid LinktreeData', async () => {
    const data = await loadLinktreeData();
    expect(data.version).toBeDefined();
    expect(data.profile.name).toBeDefined();
    expect(Array.isArray(data.links)).toBe(true);
  });
});

// Test GitHub API success
describe('getGitHubUser', () => {
  it('returns user with avatar_url', async () => {
    const user = await getGitHubUser('leobrival');
    expect(user.avatar_url).toBeDefined();
    expect(user.login).toBe('leobrival');
  });
});
```

---

## Versioning

**Current Version**: 1.0.0

**Backward Compatibility**:
- Future versions will maintain compatibility with v1.0.0
- New fields will be optional with sensible defaults
- Breaking changes will increment major version number

**Schema Evolution**:
- Version field in data.json allows for future upgrades
- Application supports version 1.x.x
- Newer versions require application update
