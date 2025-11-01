# Personal Linktree

A minimal, fast, and customizable personal linktree interface built with Vite, React, TypeScript, and Tailwind CSS. Deploy to GitHub Pages with a single push.

## Features

- **⚡ Ultra-fast**: Built with Vite for instant HMR and blazing-fast builds
- **🎨 Beautiful UI**: Modern, minimal design with responsive layout using Tailwind CSS
- **🔄 Skeleton Loaders**: Smooth loading states for better UX
- **🐙 GitHub Integration**: Automatically fetch your GitHub profile picture
- **🚀 Easy Deployment**: Deploy to GitHub Pages automatically via GitHub Actions
- **📝 Data-Driven**: Customize everything via JSON (no code changes needed!)
- **📱 Mobile-First**: Fully responsive design optimized for all screen sizes
- **🔒 No Backend**: Static site - fast, secure, and free to host

## Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd linktree
pnpm install
```

### 2. Customize Your Data

Edit `public/data.json` with your information:

```json
{
  "profile": {
    "name": "Your Name",
    "bio": "Your bio here",
    "gitHubUsername": "your-github-username",
    "socialMediaHandle": "@your-handle"
  },
  "links": [
    {
      "id": "portfolio",
      "title": "My Portfolio",
      "url": "https://yoursite.com",
      "icon": "🎨",
      "description": "View my work",
      "order": 0
    }
  ]
}
```

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed instructions.

### 3. Test Locally

```bash
pnpm dev
```

Open http://localhost:5173 and see your linktree!

### 4. Deploy

**Option A: GitHub Pages (Automatic)**

```bash
git add .
git commit -m "Update linktree"
git push
```

GitHub Actions will automatically build and deploy to GitHub Pages.

**Option B: Build & Host Anywhere**

```bash
pnpm build
# Upload dist/ folder to any static host
```

## Project Structure

```
linktree/
├── public/
│   └── data.json           # Your profile and links data
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Skeletons/      # Loading skeletons
│   │   ├── ProfileCard.tsx
│   │   ├── LinksList.tsx
│   │   └── LinkButton.tsx
│   ├── pages/
│   │   └── Home.tsx        # Main page layout
│   ├── hooks/
│   │   ├── useLinktreeData.ts
│   │   └── useGithubProfile.ts
│   ├── services/
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── dataLoader.ts   # Load data.json
│   │   └── githubApi.ts    # Fetch GitHub avatar
│   ├── styles/
│   │   └── globals.css     # Global styles
│   ├── App.tsx
│   └── main.tsx
├── DATA_FORMAT.md          # Data structure reference
├── CUSTOMIZATION.md        # How to customize
└── README.md              # This file
```

## Available Commands

```bash
# Development
pnpm dev          # Start local dev server at http://localhost:5173

# Production
pnpm build        # Build for production (dist/)
pnpm preview      # Preview production build locally

# Quality
pnpm typecheck    # Type checking with TypeScript
pnpm build        # Includes type checking before build
```

## Customization

### Change Profile Information

Edit `public/data.json` → `profile` section:
- **name**: Your display name
- **bio**: Short description
- **gitHubUsername**: Used for your profile picture
- **socialMediaHandle**: Optional social media handle

### Manage Links

Edit `public/data.json` → `links` array:
- **Add**: Create new link objects
- **Remove**: Delete link objects
- **Reorder**: Change the `order` property (0, 1, 2, ...)
- **Icons**: Use any emoji (🌟, 🎨, 📧, etc.)

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed examples.

### Styling

Styles are in `src/styles/globals.css` with Tailwind CSS classes. Customize colors, spacing, and layout by editing component files.

## Data Format

Your linktree is configured entirely through `public/data.json`. This file defines:

- Profile information (name, bio, GitHub username)
- External links with icons, titles, and descriptions
- Display order and metadata

See [DATA_FORMAT.md](./DATA_FORMAT.md) for complete field reference and validation rules.

## Deployment

### GitHub Pages

1. Push to your repository:
   ```bash
   git push
   ```

2. GitHub Actions automatically builds and deploys to GitHub Pages

3. Your site is live at `https://username.github.io/linktree`

**Note**: If deploying to a subdirectory, update `vite.config.ts`:
```javascript
base: '/linktree/', // or your subdirectory
```

### Other Hosting

```bash
pnpm build
# Upload dist/ folder to:
# - Vercel
# - Netlify
# - Any static host
```

## Tech Stack

- **Vite 7**: Ultra-fast build tool and dev server
- **React 18**: Component-based UI with hooks
- **TypeScript 5**: Full type safety
- **Tailwind CSS 3**: Utility-first CSS framework
- **shadcn/ui**: Copy-paste component library

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- **Page Load**: < 100ms (local), < 500ms (network)
- **Bundle Size**: ~50KB gzipped
- **Lighthouse**: 100/100 on Performance, Accessibility, Best Practices

## FAQ

### How do I update my links?

Edit `public/data.json` and either:
- Push to GitHub for automatic deployment, or
- Run `pnpm build` and redeploy manually

### Can I use my own domain?

Yes! Configure your DNS and add a CNAME file. See [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

### Why isn't my GitHub avatar showing?

- Ensure your GitHub username is correct
- Your GitHub profile must be public
- Check browser console for errors
- GitHub API might be rate-limited - wait a minute

### Can I add custom styling?

Yes! Edit `src/styles/globals.css` or component files. All styling uses Tailwind CSS.

### What if data.json is invalid?

You'll see an error message on the page. Check the browser console for details. Use [jsonlint.com](https://www.jsonlint.com/) to validate your JSON.

## License

MIT - Feel free to use this template for your own linktree!

## Contributing

Found a bug or want to improve? Create an issue or pull request.

## Support

- Check [CUSTOMIZATION.md](./CUSTOMIZATION.md) for setup help
- See [DATA_FORMAT.md](./DATA_FORMAT.md) for data structure reference
- Check browser console for error messages
