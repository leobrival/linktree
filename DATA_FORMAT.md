# Data Format Guide

This document describes the structure and validation rules for the `public/data.json` file that controls your linktree interface.

## File Location

```
public/data.json
```

## Data Structure

### Root Object

```json
{
  "version": "1.0.0",
  "profile": { ... },
  "links": [ ... ]
}
```

### Profile Object

The `profile` object contains your personal information displayed at the top of your linktree.

| Field | Type | Required | Max Length | Description |
|-------|------|----------|-----------|-------------|
| `name` | string | Yes | 100 | Your full name or display name |
| `bio` | string | Yes | 300 | Short biography or tagline |
| `gitHubUsername` | string | Yes | 39 | Your GitHub username (used to fetch your avatar) |
| `socialMediaHandle` | string | No | 100 | Your social media handle (e.g., @username) |

**Example:**

```json
{
  "name": "Lexie Candis",
  "bio": "Pastel artist from Melbourne creating vibrant illustrations",
  "gitHubUsername": "lexiecandis",
  "socialMediaHandle": "@lexiecandis"
}
```

### Links Array

The `links` array contains all the external links displayed in your linktree.

| Field | Type | Required | Max Length | Description |
|-------|------|----------|-----------|-------------|
| `id` | string | Yes | 50 | Unique identifier (kebab-case, used internally) |
| `title` | string | Yes | 50 | Display title of the link |
| `url` | string | Yes | 2048 | Full URL starting with http:// or https:// |
| `icon` | string | No | 1 | Emoji icon to display (single character) |
| `description` | string | No | 100 | Short description of what the link leads to |
| `order` | number | Yes | N/A | Sort order (0, 1, 2, ... in ascending order) |

**Example:**

```json
{
  "id": "print-store",
  "title": "Print Store",
  "url": "https://example.com/prints",
  "icon": "🛍️",
  "description": "Shop my pastel artwork prints",
  "order": 0
}
```

## Validation Rules

### Required Fields

These fields must be present and non-empty:
- `profile.name`
- `profile.bio`
- `profile.gitHubUsername`
- `links[].id`
- `links[].title`
- `links[].url`
- `links[].order`

### URL Format

All URLs in `links[].url` must:
- Start with `http://` or `https://`
- Be valid and accessible
- Not contain spaces

**Valid URLs:**
```
https://example.com
https://example.com/path
https://example.com:8080/path?query=value
```

**Invalid URLs:**
```
example.com
http//example.com
ftp://example.com
```

### Order Property

Link order is determined by the `order` property:
- Links are sorted in ascending order by this value
- Start with 0 for the first link
- Can use any number: 0, 1, 2, ... or 0, 10, 20, ... (gaps are fine)

**Example:**

```json
[
  { "order": 0, "title": "First Link" },
  { "order": 1, "title": "Second Link" },
  { "order": 2, "title": "Third Link" }
]
```

### Emoji Icons

The `icon` field accepts any single emoji:
- ✅ Valid: "🛍️", "📧", "❤️", "🎨", "📱"
- ❌ Invalid: "ab", "😊😊" (multiple emojis)

## Limits

| Item | Minimum | Maximum |
|------|---------|---------|
| Total Links | 1 | 50 |
| Name Length | 1 | 100 chars |
| Bio Length | 1 | 300 chars |
| Description Length | 0 | 100 chars |

Note: If you exceed 50 links, only the first 50 will be displayed with a warning in the browser console.

## Error Messages

If your JSON has errors, you'll see one of these messages:

```
Invalid data format: missing profile or links
Invalid profile: name and gitHubUsername are required
Invalid links: must be a non-empty array
Invalid link at index 2: title and url are required
```

## Example Complete Data File

```json
{
  "version": "1.0.0",
  "profile": {
    "name": "Lexie Candis",
    "bio": "Pastel artist from Melbourne creating vibrant illustrations and digital art",
    "gitHubUsername": "lexiecandis",
    "socialMediaHandle": "@lexiecandis"
  },
  "links": [
    {
      "id": "print-store",
      "title": "Print Store",
      "url": "https://example.com/prints",
      "icon": "🛍️",
      "description": "Shop my pastel artwork prints",
      "order": 0
    },
    {
      "id": "contact",
      "title": "Contact Me",
      "url": "https://example.com/contact",
      "icon": "📧",
      "description": "Get in touch for commissions",
      "order": 1
    },
    {
      "id": "portfolio",
      "title": "Portfolio",
      "url": "https://example.com/portfolio",
      "icon": "🎨",
      "description": "View my full art portfolio",
      "order": 2
    }
  ]
}
```

## Troubleshooting

### My GitHub avatar doesn't show

Make sure:
1. Your GitHub username is correct and public
2. Your GitHub profile has a public avatar set
3. You have internet connectivity

If the GitHub API fails, a fallback avatar URL will be used automatically.

### Links don't appear

Check that:
1. The `links` array is not empty
2. Each link has `id`, `title`, `url`, and `order` properties
3. URLs start with `http://` or `https://`
4. JSON syntax is valid (check for missing commas or brackets)

### Data won't load

Check the browser console for error messages. Common issues:
- Invalid JSON syntax
- Missing required fields in profile
- Empty links array

### To validate your JSON

Use a JSON validator like [jsonlint.com](https://www.jsonlint.com/) to check for syntax errors before deploying.
