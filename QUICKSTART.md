# Quick Start (5 Minutes)

Get your linktree live in 5 minutes!

## 1️⃣ Edit Your Data (2 min)

Open `public/data.json` and update:

```json
{
  "profile": {
    "name": "Your Name",
    "bio": "Your bio",
    "gitHubUsername": "your-github-username"
  },
  "links": [
    {
      "id": "my-site",
      "title": "My Website",
      "url": "https://yoursite.com",
      "icon": "🌐",
      "description": "My awesome website",
      "order": 0
    }
  ]
}
```

Save the file.

## 2️⃣ Test Locally (1 min)

```bash
pnpm dev
```

Open http://localhost:5173 and see your linktree!

Press Ctrl+C to stop.

## 3️⃣ Deploy (2 min)

### Option A: GitHub Pages (Automatic)

```bash
git add public/data.json
git commit -m "Update linktree"
git push
```

Done! Your site deploys automatically. Check GitHub Actions tab for status.

### Option B: Build & Deploy Manually

```bash
pnpm build
```

Upload the `dist/` folder to any static host (Vercel, Netlify, etc).

## 🎉 You're Live!

Your linktree is now live!

### Next Steps

- 🎨 Customize with more links
- 🌐 Add custom domain (GitHub Pages settings)
- 📱 Test on mobile
- 🔗 Share your linktree!

## Common Tasks

### Add Another Link

```json
{
  "id": "my-portfolio",
  "title": "Portfolio",
  "url": "https://myportfolio.com",
  "icon": "🎨",
  "description": "View my work",
  "order": 1
}
```

### Change Link Order

Update the `order` field (0, 1, 2, ...).

### Remove a Link

Delete the entire link object.

## Troubleshooting

**"My GitHub avatar doesn't show?"**
- Check your GitHub username in data.json
- Make sure it's public
- Wait a minute and refresh

**"My changes didn't deploy?"**
- Check GitHub Actions tab
- Make sure you pushed to `main` or `master` branch
- Verify data.json syntax

**"How do I use a custom domain?"**
- GitHub Pages Settings → Add custom domain
- Update your DNS records
- Enabled HTTPS

## Need Help?

- 📖 [README.md](./README.md) - Full project guide
- 🎨 [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Detailed customization
- 📋 [DATA_FORMAT.md](./DATA_FORMAT.md) - Data structure reference
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment options

## What's Included

✅ Fast (Vite)
✅ Beautiful (Tailwind CSS)
✅ Responsive (Mobile-first)
✅ Easy to customize (JSON-based)
✅ Automatic deployment (GitHub Actions)
✅ GitHub avatar (Auto-fetch)
✅ Skeleton loaders (Better UX)

Enjoy! 🚀
