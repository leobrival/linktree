# Deployment Guide

This guide explains how to deploy your linktree to various platforms.

## GitHub Pages (Recommended - Automatic)

GitHub Pages hosting is **free** and **automatic** via GitHub Actions.

### Setup

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Create a public repository named `linktree`

2. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/linktree.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository → Settings → Pages
   - Set "Source" to "GitHub Actions"
   - The workflow `.github/workflows/deploy.yml` will handle deployment

4. **Your site is live!**
   - Site URL: `https://YOUR-USERNAME.github.io/linktree`
   - Changes auto-deploy when you push

### Custom Domain (Optional)

To use your own domain:

1. **Update DNS**
   - Add these DNS records (with your domain provider):
   ```
   Type: A
   Name: @
   Value: 185.199.108.153

   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```

2. **GitHub Pages Settings**
   - Repository → Settings → Pages
   - Enter your domain in "Custom domain"
   - Enable "Enforce HTTPS"

3. **Update vite.config.ts** (if subdirectory)
   ```typescript
   export default defineConfig({
     base: '/', // or '/linktree/' if not root
   })
   ```

## Vercel (Free - Easiest)

Vercel provides zero-configuration deployment and is extremely fast.

### Setup

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** and your site is live!

**Advantages:**
- One command deployment
- Free tier with unlimited deployments
- Analytics and monitoring included

## Netlify (Free)

### Setup

1. **Build locally**
   ```bash
   pnpm build
   ```

2. **Use Netlify CLI**
   ```bash
   pnpm add -D netlify-cli
   npx netlify deploy --prod --dir=dist
   ```

Or drag-and-drop the `dist/` folder to [Netlify](https://netlify.com).

## Manual Deployment

### Build for Production

```bash
pnpm build
```

This creates a `dist/` folder with all files needed.

### Upload to Any Host

- **AWS S3 + CloudFront**
- **DigitalOcean Spaces**
- **Azure Static Web Apps**
- **Google Cloud Storage**
- **Any web hosting with FTP**

Simply upload the contents of `dist/` to your host's public directory.

## Continuous Deployment

### GitHub Actions (Automatic)

The `.github/workflows/deploy.yml` file automatically:
1. Builds your project on push to `main`
2. Runs type checking and linting
3. Deploys to GitHub Pages

**Triggering Deployments:**
```bash
git add public/data.json  # Edit your links
git commit -m "Update linktree"
git push                  # Deploy automatically!
```

### Manual Workflow

```bash
# 1. Make changes
vim public/data.json

# 2. Build
pnpm build

# 3. Commit
git add public/data.json src/...
git commit -m "Update linktree"

# 4. Push (if using GitHub Pages or CI/CD)
git push
```

## Environment Variables

Create `.env.local` for local development:

```bash
# Optional - for custom base URL
VITE_BASE_URL=http://localhost:5173
```

**Note:** Environment variables are not needed for basic deployment.

## Troubleshooting

### "My GitHub avatar doesn't load"

- GitHub API sometimes has rate limits
- Check your username in `public/data.json`
- Try refreshing the page
- Check browser console for errors

### "Changes didn't deploy"

1. Check GitHub Actions status: Repository → Actions
2. Look for workflow run - verify it passed
3. Check repository → Settings → Pages for status
4. Try hard refresh: Cmd/Ctrl + Shift + R

### "404 error on subdomain"

If deploying to `example.com/linktree`:

1. Update `vite.config.ts`:
   ```typescript
   base: '/linktree/',
   ```

2. Rebuild and redeploy:
   ```bash
   pnpm build
   git add .
   git commit -m "Update base path"
   git push
   ```

### "HTTPS not working"

- GitHub Pages: Automatically available after 15 minutes
- Vercel: Automatic
- Other hosts: May need to configure SSL certificate

## Performance Optimization

### Already Optimized

Your linktree is optimized out of the box:
- Minified CSS & JS
- Gzip compression
- Code splitting
- Lazy loading

### Further Optimization

```bash
# Check build size
ls -lh dist/assets/

# Build size should be < 200KB total
```

### Lighthouse Scores

Run locally:
```bash
pnpm preview
```

Open DevTools → Lighthouse and check your scores. Should be:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Monitoring

### GitHub Pages

- View deployment status in Actions tab
- Check for build errors in workflow logs

### Vercel

- Dashboard shows all deployments
- Analytics included (traffic, performance)
- Environment variable management

### Netlify

- Netlify dashboard shows deployment history
- Analytics addon available
- Form submissions tracking

## Rollback

### If Something Breaks

#### GitHub Pages
```bash
git log                  # View history
git revert <commit-id>   # Undo a commit
git push                 # Redeploy
```

#### Vercel/Netlify
- Both show deployment history
- One-click rollback available in dashboard

## CI/CD Pipeline

The `.github/workflows/deploy.yml` runs:

1. **Install**: Dependencies
2. **Typecheck**: `tsc --noEmit`
3. **Build**: `vite build`
4. **Deploy**: To GitHub Pages

**On every push to main/master:**
```bash
git push → Workflow triggers → Site updates live in 2-3 minutes
```

## Next Steps

1. ✅ Deploy your site
2. 🔄 Test from different devices
3. 🎨 Customize `public/data.json`
4. 📤 Share your linktree!

Need help? Check:
- [README.md](./README.md) - Project overview
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Edit your data
- [DATA_FORMAT.md](./DATA_FORMAT.md) - Data structure
