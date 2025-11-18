# 🚀 GitHub Pages Deployment Guide

## Overview

The Frov Game Platform is configured for automatic deployment to GitHub Pages using GitHub Actions. Every push to the branch triggers an automated build and deployment process.

## 📋 Repository Settings Required

To enable GitHub Pages deployment, follow these steps in your GitHub repository:

### 1. Enable GitHub Pages

1. Go to your repository: `https://github.com/J-h-o/frov`
2. Click on **Settings** (top navigation)
3. Scroll down to **Pages** (left sidebar under "Code and automation")
4. Under **Source**, select:
   - **Source**: GitHub Actions
5. Click **Save**

### 2. Verify Workflow Permissions

1. In **Settings**, go to **Actions** → **General** (left sidebar)
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check ✅ **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

## 🔄 Deployment Process

### Automatic Deployment

The deployment happens automatically when you:
- Push changes to the `claude/setup-instructions-01TjLN2SxA9V1L5wMJMQwLku` branch
- Manually trigger the workflow from GitHub Actions tab

### Manual Deployment

To manually trigger a deployment:
1. Go to **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## 🌐 Live URL

Once deployed, your site will be available at:

**https://j-h-o.github.io/frov/**

## 📊 Monitoring Deployment

### Check Deployment Status

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Monitor the build and deploy steps
4. Wait for ✅ green checkmarks (usually takes 2-3 minutes)

### Verify Live Site

1. Wait for deployment to complete
2. Visit: https://j-h-o.github.io/frov/
3. Test the Pong game and platform features

## 🔧 Technical Details

### Build Configuration

- **Build Tool**: Vite 6
- **Base Path**: `/frov/` (configured in `vite.config.ts`)
- **Output Directory**: `dist/`
- **Node Version**: 20.x

### Workflow File

Location: `.github/workflows/deploy.yml`

The workflow:
1. Checks out code
2. Sets up Node.js 20
3. Installs dependencies with `npm ci`
4. Builds the project with `npm run build`
5. Uploads the `dist/` folder to GitHub Pages
6. Deploys to GitHub Pages environment

### Files Added

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `.nojekyll` - Disables Jekyll processing
- `public/.nojekyll` - Copied to dist during build
- Updated `vite.config.ts` - Added base path
- Updated `README.md` - Added live demo link

## 🐛 Troubleshooting

### Deployment Fails

**Problem**: Workflow fails at build step
- **Solution**: Check the workflow logs in Actions tab
- **Common Issues**:
  - TypeScript errors (run `npm run build` locally to check)
  - Missing dependencies (ensure package.json is up to date)

**Problem**: 404 errors on deployed site
- **Solution**: Verify the base path in `vite.config.ts` is set to `/frov/`

**Problem**: CSS/JS files not loading
- **Solution**: Check browser console, ensure base path is correct

### Permission Denied

**Problem**: Workflow fails with permission error
- **Solution**: Check workflow permissions in repository settings (see step 2 above)

### Site Not Updating

**Problem**: Changes pushed but site shows old version
- **Solution**:
  1. Check Actions tab - ensure workflow completed successfully
  2. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
  3. Clear browser cache
  4. Wait 1-2 minutes for GitHub CDN to update

## 🔄 Updating the Site

### Making Changes

1. Make your code changes locally
2. Test locally with `npm run dev`
3. Build and verify with `npm run build && npm run preview`
4. Commit changes:
   ```bash
   git add .
   git commit -m "feat: your changes"
   ```
5. Push to trigger deployment:
   ```bash
   git push origin claude/setup-instructions-01TjLN2SxA9V1L5wMJMQwLku
   ```
6. Monitor deployment in Actions tab
7. Verify changes at https://j-h-o.github.io/frov/

### Testing Before Deploy

Always test the production build locally:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Open http://localhost:4173 to test
```

## 📱 Mobile Testing

The site is responsive and works on mobile devices:
- Test on actual devices
- Use browser DevTools mobile emulation
- Check touch controls (for future games)
- Verify canvas scaling on different screen sizes

## 🔐 Security Notes

- The workflow uses GitHub's official actions
- No secrets or API keys are required
- Build artifacts are automatically cleaned up
- Only the `dist/` folder is deployed (no source code)

## 🎯 Next Steps

After enabling GitHub Pages:

1. ✅ Visit the live site at https://j-h-o.github.io/frov/
2. ✅ Play the Pong game
3. ✅ Test all platform features (Profile, Leaderboard, etc.)
4. ✅ Share the link with others
5. 🚧 Add more games (see GAME_EXPANSION_GUIDE.md)
6. 🚧 Implement additional features

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Static Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

## 🆘 Support

If you encounter issues:

1. Check workflow logs in Actions tab
2. Review this deployment guide
3. Test build locally: `npm run build`
4. Check browser console for errors
5. Verify GitHub Pages is enabled in repository settings

---

**Status**: ✅ Configured and Ready
**Deployment Method**: Automated via GitHub Actions
**Live URL**: https://j-h-o.github.io/frov/
**Last Updated**: 2025-11-18
