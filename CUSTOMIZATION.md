# Customization Guide

This guide walks you through customizing your linktree without touching any code.

## Quick Start

Everything you need to customize is in the `public/data.json` file. No coding required!

## Step 1: Edit Your Profile

Open `public/data.json` and update the profile section:

```json
{
  "profile": {
    "name": "Your Name Here",
    "bio": "Your bio or tagline",
    "gitHubUsername": "your-github-username",
    "socialMediaHandle": "@your-handle"
  }
}
```

**Fields:**
- **name**: Your display name (up to 100 characters)
- **bio**: Short description of who you are (up to 300 characters)
- **gitHubUsername**: Your GitHub username - your profile picture will be automatically fetched from GitHub
- **socialMediaHandle**: Optional - your social media handle like @username

## Step 2: Customize Your Links

Add, remove, or reorder your links in the `links` array:

```json
{
  "links": [
    {
      "id": "unique-id",
      "title": "Link Title",
      "url": "https://example.com",
      "icon": "🌟",
      "description": "What this link is about",
      "order": 0
    }
  ]
}
```

### Link Fields

| Field | What it is |
|-------|-----------|
| **id** | Unique identifier (use lowercase-with-dashes, like: `my-portfolio`) |
| **title** | What the link is called - shown to visitors |
| **url** | Where the link goes (must start with `http://` or `https://`) |
| **icon** | Single emoji to represent the link (optional but recommended) |
| **description** | Brief explanation of what visitors will find (optional) |
| **order** | Sort order - 0, 1, 2... Links are sorted by this number |

## Example Customizations

### Add a New Link

Copy this and add to your `links` array:

```json
{
  "id": "my-portfolio",
  "title": "Portfolio",
  "url": "https://myportfolio.com",
  "icon": "🎨",
  "description": "View my work and projects",
  "order": 5
}
```

### Change Link Order

Update the `order` field. Lower numbers appear first:

```json
{
  "links": [
    { "order": 0, "title": "First" },
    { "order": 1, "title": "Second" },
    { "order": 2, "title": "Third" }
  ]
}
```

### Remove a Link

Delete the entire link object from the array. For example, remove everything between the curly braces and the comma.

**Before:**
```json
[
  { "id": "link1", ... },
  { "id": "link2", ... },
  { "id": "link3", ... }
]
```

**After (removed link2):**
```json
[
  { "id": "link1", ... },
  { "id": "link3", ... }
]
```

### Add Icons to Your Links

Choose emoji that represent your links:

```json
{
  "icon": "🛍️",      // Shopping/store
  "icon": "📧",      // Email/contact
  "icon": "🎨",      // Art/creative
  "icon": "📱",      // Mobile/app
  "icon": "💼",      // Professional
  "icon": "🎵",      // Music
  "icon": "📚",      // Books/education
  "icon": "🌐",      // Website
  "icon": "❤️",      // Favorites
  "icon": "🔗",      // Links
}
```

## Deploy Your Changes

### Option 1: Local Testing (Recommended First)

1. Edit `public/data.json`
2. Run: `pnpm dev`
3. Open http://localhost:5173
4. Check your changes

### Option 2: Build & Deploy to GitHub Pages

1. Edit `public/data.json`
2. Commit your changes: `git add public/data.json && git commit -m "Update linktree data"`
3. Push to GitHub: `git push`
4. GitHub Actions will automatically build and deploy

Your changes will be live in a few minutes!

## Verification Checklist

After making changes:

- [ ] All URLs start with `http://` or `https://`
- [ ] No duplicate `id` values
- [ ] `order` numbers are unique (or at least ascending)
- [ ] Required fields are filled: `name`, `bio`, `gitHubUsername`, `url`
- [ ] Valid JSON syntax (check with https://jsonlint.com if unsure)
- [ ] At least 1 link is in the links array (maximum 50)

## Common Issues

### "Links don't appear after editing"

1. Check your JSON syntax - use https://jsonlint.com
2. Make sure each link has `id`, `title`, `url`, and `order`
3. Rebuild: `pnpm build` and refresh your browser

### "GitHub avatar doesn't load"

1. Check your GitHub username is spelled correctly
2. Your GitHub account must be public
3. GitHub API might be rate limited - wait a minute and refresh

### "My changes didn't deploy"

1. Did you push to GitHub? `git push`
2. Check GitHub Actions - go to your repo → Actions tab
3. Look for deployment workflow and check if it succeeded

### "JSON validation error"

Paste your JSON into https://jsonlint.com to find the exact error. Common mistakes:
- Missing comma between objects
- Mismatched quotes
- Extra or missing brackets

## Advanced: Common Patterns

### Portfolio with Categories

```json
[
  { "order": 0, "title": "Website", "url": "...", "icon": "🌐" },
  { "order": 1, "title": "Blog", "url": "...", "icon": "📝" },
  { "order": 2, "title": "Portfolio", "url": "...", "icon": "🎨" },
  { "order": 3, "title": "GitHub", "url": "...", "icon": "💻" },
  { "order": 4, "title": "Email", "url": "mailto:you@example.com", "icon": "📧" }
]
```

### E-commerce Links

```json
[
  { "order": 0, "title": "Shop", "url": "...", "icon": "🛍️" },
  { "order": 1, "title": "New Collection", "url": "...", "icon": "⭐" },
  { "order": 2, "title": "Sale", "url": "...", "icon": "🎁" },
  { "order": 3, "title": "About", "url": "...", "icon": "ℹ️" }
]
```

## Need More Help?

- Check DATA_FORMAT.md for detailed field specifications
- Look at public/data.json for the current structure
- Use https://jsonlint.com to validate your JSON
- Check browser DevTools console for error messages
