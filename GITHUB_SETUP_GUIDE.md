# GitHub Repository Setup Guide

Quick guide for configuring your GitHub repository: https://github.com/chetannr/bcl

---

## ℹ️ Supabase Project Information

### Project Details:
- **Login**: Go to [supabase.com](https://supabase.com)
  - Email: `chetan.nr@gmail.com` (GitHub.com account)
- **Organization**: Propage
- **Project name**: BCL Project
- **Region**: Asia-Pacific
- **Project URL**: `https://rnroiebdxsrvpatrmhmw.supabase.co`
- **API Key (anon/public)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucm9pZWJkeHNydnBhdHJtaG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ5MDUsImV4cCI6MjA4MTY1MDkwNX0.ChvER2dzVOHi8E1zCbriNsN7osmsyu8LSaIuQSl1Ico`

> **Note**: The API key above is the anonymous/public key, which is safe to use in client-side applications when Row Level Security (RLS) is enabled.

---

## ✅ Step 1: Set Up GitHub Secrets

**Navigate to**: Repository Settings → Secrets and variables → Actions  
**Direct link**: https://github.com/chetannr/bcl/settings/secrets/actions

### Add These Secrets:

1. **New repository secret** → Name: `VITE_SUPABASE_URL`
   - **Value**: `https://rnroiebdxsrvpatrmhmw.supabase.co`
   - Copy from: Supabase Project URL above

2. **New repository secret** → Name: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucm9pZWJkeHNydnBhdHJtaG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ5MDUsImV4cCI6MjA4MTY1MDkwNX0.ChvER2dzVOHi8E1zCbriNsN7osmsyu8LSaIuQSl1Ico`
   - Copy from: API Key above

### ✅ Verification:
After adding both secrets, you should see:
- `VITE_SUPABASE_URL` in the secrets list
- `VITE_SUPABASE_ANON_KEY` in the secrets list

---

## ✅ Step 2: Enable GitHub Pages

**Navigate to**: Repository Settings → Pages  
**Direct link**: https://github.com/chetannr/bcl/settings/pages

### Configuration:
1. **Source**: Select **"GitHub Actions"** (NOT "Deploy from a branch")
2. Click **Save**

### ✅ Verification:
After saving, you should see:
- **Source**: GitHub Actions
- A message indicating Pages will be published from Actions workflows

---

## ✅ Step 3: Verify Workflow File

The workflow file should already be in your repository:
- Path: `.github/workflows/deploy.yml`
- Trigger: On push to `main` branch
- Also: Manual trigger available

**Verify it exists**: https://github.com/chetannr/bcl/tree/main/.github/workflows

---

## 🚀 Step 4: First Deployment

### Option A: Automatic (Recommended)
1. Commit and push the changes if you haven't already:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. **Monitor the deployment**:
   - Go to: https://github.com/chetannr/bcl/actions
   - You should see a workflow run: "Deploy to GitHub Pages"
   - Click on it to see the build progress

3. **After successful deployment**:
   - Go back to: https://github.com/chetannr/bcl/settings/pages
   - You should see: "Your site is published at https://chetannr.github.io/bcl/"
   - Visit: https://chetannr.github.io/bcl/

### Option B: Manual Trigger (Test)
1. Go to: https://github.com/chetannr/bcl/actions
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow" button
4. Monitor the deployment

---

## ✅ Step 5: Post-Deployment Verification

After deployment completes, test these URLs:

- ✅ Landing page: https://chetannr.github.io/bcl/
- ✅ Admin auction: https://chetannr.github.io/bcl/admin/auction
- ✅ Admin manage: https://chetannr.github.io/bcl/admin/manage
- ✅ Display view: https://chetannr.github.io/bcl/display

### Checklist:
- [ ] Site loads at the base URL
- [ ] All routes are accessible
- [ ] No 404 errors on direct route access
- [ ] Navigation works between routes
- [ ] Environment variables loaded (check browser console)
- [ ] Supabase connection works (check Network tab for API calls)
- [ ] Images load correctly
- [ ] Real-time features work (if applicable)
- [ ] No console errors

---

## 🔧 Troubleshooting

### Secrets Not Working
- **Verify names are exact**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (case-sensitive)
- **Check workflow logs**: Go to Actions → Select workflow run → Expand "Build project" step
- **Verify values**: Make sure you copied the full URLs/keys without extra spaces

### Pages Not Publishing
- **Check source**: Must be "GitHub Actions" (not "Deploy from a branch")
- **Check workflow**: Go to Actions tab and verify workflow ran successfully
- **Wait a moment**: GitHub Pages can take 1-2 minutes to publish after workflow completes

### 404 Errors on Routes
- **Verify base path**: Check that `vite.config.ts` has `base: '/bcl/'`
- **Check workflow logs**: Verify build completed successfully
- **Test base URL first**: Make sure https://chetannr.github.io/bcl/ works before testing routes

### Build Failures
- **Check Actions logs**: Look for specific error messages
- **Test locally first**: Run `npm run build` locally to catch errors early
- **Verify Node version**: Workflow uses Node 20 (should match your local if possible)

---

## 📋 Quick Reference

### Repository URLs
- **Repository**: https://github.com/chetannr/bcl
- **Settings**: https://github.com/chetannr/bcl/settings
- **Secrets**: https://github.com/chetannr/bcl/settings/secrets/actions
- **Pages Settings**: https://github.com/chetannr/bcl/settings/pages
- **Actions**: https://github.com/chetannr/bcl/actions
- **Published Site**: https://chetannr.github.io/bcl/

### Important Files
- Workflow: `.github/workflows/deploy.yml`
- Vite Config: `vite.config.ts` (base path: `/bcl/`)
- Package.json: `package.json` (deployment scripts added)

---

## 🎯 Current Status

✅ **Code changes applied**:
- `vite.config.ts` - Base path configured
- `package.json` - Deployment scripts added
- `.github/workflows/deploy.yml` - Workflow created

⏳ **Pending your action**:
- [ ] Add GitHub Secrets (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Enable GitHub Pages (set source to "GitHub Actions")
- [ ] Push changes to trigger first deployment
- [ ] Verify deployment works

---

**Ready to proceed?** Follow Steps 1-4 above, and your BCL app will be live on GitHub Pages! 🚀

