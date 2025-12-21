# GitHub Pages Implementation Checklist

Quick checklist for implementing GitHub Pages deployment for the BCL project.

## ✅ Configuration Changes Applied

### 1. Vite Configuration (`vite.config.ts`)
- [x] Added `base` property with conditional GitHub repository path
- [x] Falls back to `/bcl/` for local development
- [x] Automatically uses repository name in GitHub Actions

### 2. Package.json Updates
- [x] Added `predeploy` script (runs build before deploy)
- [x] Added `deploy` script (uses gh-pages)
- [x] Added `gh-pages` to devDependencies

### 3. GitHub Actions Workflow
- [x] Created `.github/workflows/deploy.yml`
- [x] Configured to build on push to `main` branch
- [x] Added manual trigger option (`workflow_dispatch`)
- [x] Environment variables from GitHub Secrets
- [x] Two-job workflow (build → deploy)

---

## 🔧 Repository Setup Required

### Step 1: Install Dependencies
```bash
npm install
```

This will install `gh-pages` that was added to `package.json`.

### Step 2: Set GitHub Secrets
Go to: **Repository Settings → Secrets and variables → Actions**

Add these secrets:
- **Name**: `VITE_SUPABASE_URL`
  - **Value**: Your Supabase project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)

- **Name**: `VITE_SUPABASE_ANON_KEY`
  - **Value**: Your Supabase anonymous key (from Supabase Dashboard → Settings → API)

### Step 3: Enable GitHub Pages
Go to: **Repository Settings → Pages**

- **Source**: Select **"GitHub Actions"**
- Save settings

---

## 🧪 Local Testing

### Test Build with Base Path
```bash
# Build the project locally
npm run build

# Preview the production build (simulates GitHub Pages)
npm run preview
```

Then test these URLs in your browser:
- `http://localhost:4173/bcl/` - Landing page
- `http://localhost:4173/bcl/admin/auction` - Admin panel
- `http://localhost:4173/bcl/admin/manage` - Management page
- `http://localhost:4173/bcl/display` - Display view

**Verify**:
- [ ] All routes load correctly
- [ ] No 404 errors on direct URL access
- [ ] Navigation between routes works
- [ ] Images load correctly
- [ ] No console errors

### Test Environment Variables (Local)
Create a `.env.local` file (already in .gitignore):
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run build and preview to verify Supabase connection works.

---

## 🚀 First Deployment

### Option A: Automatic (Recommended)
1. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. Monitor deployment:
   - Go to **Actions** tab in GitHub
   - Watch the workflow run
   - Check for any errors

3. After successful deployment:
   - Go to **Settings → Pages**
   - Verify deployment is "Published"
   - Visit `https://<your-username>.github.io/bcl/`

### Option B: Manual (Quick Test)
```bash
# This uses gh-pages directly (won't have GitHub Secrets)
npm run deploy
```

Note: Manual deployment won't have environment variables unless you set them locally.

---

## ✅ Post-Deployment Verification

Test these URLs after deployment:
- [ ] `https://<username>.github.io/bcl/` - Landing page loads
- [ ] `https://<username>.github.io/bcl/admin/auction` - Admin panel accessible
- [ ] `https://<username>.github.io/bcl/admin/manage` - Management page works
- [ ] `https://<username>.github.io/bcl/display` - Display view functional
- [ ] Environment variables loaded (check browser console)
- [ ] Supabase connection works (check Network tab)
- [ ] Real-time features functional
- [ ] Images load correctly
- [ ] Mobile responsiveness verified
- [ ] No console errors

---

## 🔄 Future Updates

After the initial setup, deployment is automatic:

1. Make changes locally
2. Test: `npm run build && npm run preview`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
4. GitHub Actions automatically builds and deploys
5. Check Actions tab for deployment status

---

## 🐛 Troubleshooting

### Issue: 404 Errors on Routes
**Solution**: Verify `base` path in `vite.config.ts` matches repository name.

### Issue: Environment Variables Not Loading
**Solution**: 
- Check GitHub Secrets are set correctly
- Verify secrets are named exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check workflow logs to ensure variables are passed to build

### Issue: Build Fails in GitHub Actions
**Solution**: 
- Check workflow logs for specific errors
- Test build locally first: `npm run build`
- Verify all dependencies are in `package.json`

### Issue: Deployment Doesn't Trigger
**Solution**:
- Verify workflow file is in `.github/workflows/deploy.yml`
- Check that you're pushing to `main` branch
- Verify GitHub Pages is set to use "GitHub Actions" source

---

## 📝 Files Modified/Created

### Modified Files
- `vite.config.ts` - Added base path configuration
- `package.json` - Added deployment scripts and gh-pages dependency

### New Files
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `GITHUB_PAGES_DEPLOYMENT_PLAN.md` - Full deployment plan
- `GITHUB_PAGES_IMPLEMENTATION_CHECKLIST.md` - This file

---

**Status**: Ready to deploy once GitHub Secrets are configured and Pages is enabled.

