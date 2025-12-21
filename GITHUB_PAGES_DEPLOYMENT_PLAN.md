# GitHub Pages Deployment Plan for BCL Project

> **Goal**: Deploy the BCL 2025 Bidding application to GitHub Pages with automated CI/CD pipeline.

---

## 📋 Project Overview

### Tech Stack Analysis
- **Frontend Framework**: React 19 + TypeScript + Vite 7
- **Routing**: TanStack Router (client-side routing, requires base path configuration)
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (requires environment variables)
- **Build Output**: `dist/` directory
- **Current Build Command**: `npm run build` (runs `tsc -b && vite build`)

### Key Considerations
1. **SPA Routing**: TanStack Router requires proper base path configuration for subdirectory deployment
2. **Environment Variables**: Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. **Static Assets**: Player photos, team logos in `public/assets/`
4. **Real-time Features**: Supabase Realtime subscriptions must work correctly

---

## 🎯 Deployment Strategy

### Option 1: Repository Root Deployment (Recommended if using custom domain)
- **Base Path**: `/`
- **URL**: `https://username.github.io/repo-name/` or custom domain
- **Pros**: Cleaner URLs, easier custom domain setup
- **Cons**: Requires repository name in base path if using GitHub Pages subdomain

### Option 2: Subdirectory Deployment (Default for GitHub Pages)
- **Base Path**: `/bcl/` (or your repository name)
- **URL**: `https://username.github.io/bcl/`
- **Pros**: Works immediately with GitHub Pages
- **Cons**: All routes prefixed with repository name

**We'll implement Option 2 first (subdirectory), which can easily be changed to Option 1 if using a custom domain.**

---

## 📝 Step-by-Step Implementation Plan

### Phase 1: Pre-Deployment Configuration

#### Step 1.1: Determine Repository Name
- **Action**: Confirm your GitHub repository name (e.g., `bcl`, `bcl-2025-bidding`, etc.)
- **Note**: This will be used as the base path in Vite configuration

#### Step 1.2: Update Vite Configuration for Base Path
**File**: `vite.config.ts`

**Changes Needed**:
```typescript
export default defineConfig({
  base: process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : '/bcl/', // Fallback to '/bcl/' if not set
  // ... rest of config
})
```

**Or for simpler setup (hardcoded repo name)**:
```typescript
base: '/bcl/', // Replace 'bcl' with your actual repo name
```

#### Step 1.3: Configure TanStack Router Base Path (if needed)
**File**: `src/main.tsx`

TanStack Router should automatically respect Vite's base path, but we may need to verify this works correctly. The router is created without explicit base path configuration, so Vite's base path should be sufficient.

#### Step 1.4: Install GitHub Pages Deployment Package
```bash
npm install --save-dev gh-pages
```

#### Step 1.5: Update package.json Scripts
**File**: `package.json`

Add deployment script:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

### Phase 2: GitHub Actions Workflow (Recommended)

#### Step 2.1: Create GitHub Actions Workflow
**File**: `.github/workflows/deploy.yml`

This workflow will:
- Build the project on every push to main
- Deploy to GitHub Pages automatically
- Use GitHub Secrets for environment variables

**Workflow Content**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  workflow_dispatch: # Allow manual triggering

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### Phase 3: GitHub Repository Configuration

#### Step 3.1: Set Up GitHub Secrets
**Location**: Repository Settings → Secrets and variables → Actions

Add the following secrets:
1. **VITE_SUPABASE_URL**: Your Supabase project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
2. **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key
   - Found in Supabase Dashboard → Settings → API

#### Step 3.2: Enable GitHub Pages
**Location**: Repository Settings → Pages

**Configuration**:
- **Source**: GitHub Actions
- **Branch**: (automatically handled by workflow)
- **Custom domain**: (optional, configure later if needed)

#### Step 3.3: Verify Repository Name
- Confirm the repository name matches the base path in `vite.config.ts`
- If different, update `vite.config.ts` base path accordingly

---

### Phase 4: Local Testing

#### Step 4.1: Test Build with Base Path
```bash
# Set environment variables locally
export VITE_SUPABASE_URL="your-supabase-url"
export VITE_SUPABASE_ANON_KEY="your-anon-key"

# Build with base path
npm run build

# Preview the build locally (simulates GitHub Pages)
npm run preview
```

#### Step 4.2: Test SPA Routing
After preview starts:
1. Navigate to `/bcl/` (or your base path)
2. Test all routes:
   - `/bcl/` - Landing page
   - `/bcl/admin/auction` - Admin panel
   - `/bcl/admin/manage` - Management page
   - `/bcl/display` - Display view
3. Verify direct URL access works (no 404s)
4. Verify navigation between routes works

#### Step 4.3: Verify Environment Variables
- Check browser console for Supabase connection
- Verify no "MISSING" warnings in console
- Test real-time features (if applicable)

---

### Phase 5: Initial Deployment

#### Option A: Manual Deployment (Quick Test)
```bash
# Build locally
npm run build

# Deploy using gh-pages
npm run deploy
```

**Note**: This method won't use GitHub Secrets, so environment variables won't be available unless you set them locally.

#### Option B: Automated Deployment (Recommended)
1. Push code to main branch
2. GitHub Actions workflow will automatically:
   - Build the project
   - Deploy to GitHub Pages
3. Monitor workflow in Actions tab
4. Check deployment status in Pages settings

---

### Phase 6: Post-Deployment Verification

#### Checklist
- [ ] Site is accessible at `https://username.github.io/repo-name/`
- [ ] All routes load correctly (no 404 errors)
- [ ] Navigation works between pages
- [ ] Environment variables are loaded (check browser console)
- [ ] Supabase connection works (check Network tab)
- [ ] Real-time features work (if applicable)
- [ ] Images load correctly
- [ ] Admin panel accessible and functional
- [ ] Display view works correctly
- [ ] Mobile responsiveness verified
- [ ] No console errors

#### Testing Routes
Test each route directly:
- `https://username.github.io/bcl/`
- `https://username.github.io/bcl/admin/auction`
- `https://username.github.io/bcl/admin/manage`
- `https://username.github.io/bcl/display`

---

## 🔧 Configuration Files Summary

### Files to Create/Modify

1. **`.github/workflows/deploy.yml`** (NEW)
   - GitHub Actions workflow for automated deployment

2. **`vite.config.ts`** (MODIFY)
   - Add `base` property for GitHub Pages subdirectory

3. **`package.json`** (MODIFY)
   - Add `predeploy` and `deploy` scripts
   - Add `gh-pages` to devDependencies

### Files That Don't Need Changes
- `src/main.tsx` - TanStack Router should work with Vite base path
- `vercel.json` - Keep for Vercel deployments (separate)
- `netlify.toml` - Keep for Netlify deployments (separate)

---

## 🚨 Important Considerations

### 1. Environment Variables
- **GitHub Secrets**: Use for production builds in GitHub Actions
- **Local Development**: Use `.env` file (already in .gitignore)
- **Public Exposure**: VITE_ prefixed variables are embedded in the build
  - This is safe for Supabase anonymous keys (they're designed to be public)
  - Never commit actual credentials

### 2. SPA Routing on GitHub Pages
GitHub Pages serves static files and doesn't support server-side routing natively. However:
- TanStack Router handles client-side routing
- Direct URL access should work with proper base path configuration
- If you encounter 404s on direct route access, it means the base path isn't configured correctly

### 3. Custom Domain (Optional)
If using a custom domain:
1. Change `base` in `vite.config.ts` to `/`
2. Add `CNAME` file to `public/` directory:
   ```
   www.yourdomain.com
   ```
3. Configure DNS as per GitHub Pages documentation
4. Update GitHub Pages settings to enable custom domain

### 4. Build Optimization
The current Vite config includes:
- Manual code splitting (react-vendor, router-vendor, etc.)
- CSS minification with lightningcss
- ESBuild minification
- No sourcemaps in production

These optimizations are already production-ready.

---

## 🐛 Troubleshooting

### Issue: 404 Errors on Direct Route Access
**Solution**: 
- Verify `base` path in `vite.config.ts` matches repository name
- Ensure all routes use TanStack Router's Link component (not `<a>` tags)
- Check browser console for routing errors

### Issue: Environment Variables Not Loading
**Solution**:
- Verify GitHub Secrets are set correctly (exact names: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Check workflow logs to ensure variables are passed to build step
- Verify variables are accessible in browser (check Network tab for API calls)

### Issue: Images Not Loading
**Solution**:
- Verify image paths are relative or use Vite's asset handling
- Check that `public/` directory assets are copied to `dist/`
- Verify base path doesn't break image paths

### Issue: Build Fails in GitHub Actions
**Solution**:
- Check workflow logs for specific error
- Verify Node.js version compatibility
- Ensure all dependencies are in `package.json` (not just package-lock.json)
- Check TypeScript compilation errors locally first

### Issue: TanStack Router Routes Not Working
**Solution**:
- Verify router is using client-side navigation
- Check that base path is correctly configured
- Ensure route generation is up to date: `npm run generate:routes`
- Verify route tree includes all routes

---

## 📊 Deployment Checklist

### Before First Deployment
- [ ] Repository name confirmed
- [ ] Base path updated in `vite.config.ts`
- [ ] GitHub Secrets configured (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] `gh-pages` package installed
- [ ] Deployment scripts added to `package.json`
- [ ] GitHub Actions workflow created
- [ ] Local build tested successfully
- [ ] Local preview tested with base path
- [ ] All routes tested locally

### During Deployment
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow triggered
- [ ] Build step completed successfully
- [ ] Deployment step completed successfully
- [ ] Pages status shows "Published"

### After Deployment
- [ ] Site accessible at GitHub Pages URL
- [ ] All routes accessible and working
- [ ] Environment variables loaded correctly
- [ ] Supabase connection functional
- [ ] Real-time features working
- [ ] Images loading correctly
- [ ] No console errors
- [ ] Mobile responsiveness verified
- [ ] Admin panel functional
- [ ] Display view functional

---

## 🔄 Update Process

### For Future Updates

1. **Make code changes locally**
2. **Test locally**:
   ```bash
   npm run lint
   npm run build
   npm run preview
   ```
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
4. **Automatic deployment**: GitHub Actions will automatically build and deploy
5. **Verify**: Check Actions tab and Pages settings for deployment status

### Manual Deployment (if needed)
```bash
npm run deploy
```

---

## 📚 References

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Base Path Configuration](https://vitejs.dev/config/shared-options.html#base)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Supabase Client Documentation](https://supabase.com/docs/reference/javascript/introduction)

---

## 🎯 Next Steps

1. **Review this plan** and confirm repository name
2. **Grant access** to the BCL repository (as mentioned by user)
3. **Implement configuration changes**:
   - Update `vite.config.ts` with base path
   - Add deployment scripts to `package.json`
   - Install `gh-pages` package
   - Create GitHub Actions workflow
4. **Set up GitHub Secrets** in repository settings
5. **Enable GitHub Pages** in repository settings
6. **Test deployment** with a small change
7. **Verify** all functionality works in production

---

**Status**: Ready for implementation once repository access is granted.

*Plan created based on:*
- BCL project structure and tech stack analysis
- DEPLOYMENT_STANDARDS.md from ai-website-prompts
- TESTING_AND_DEPLOYMENT_WORKFLOW.md from ai-website-prompts
- Current project configuration files

