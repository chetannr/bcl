# Troubleshooting GitHub Pages "Not Found" Error

If you're seeing "Not Found" at `https://chetannr.github.io/bcl/`, follow these steps:

## Step 1: Check GitHub Actions Workflow Status

1. Go to: https://github.com/chetannr/bcl/actions
2. Look for the "Deploy to GitHub Pages" workflow
3. Check if it has run and if it completed successfully

**If the workflow hasn't run:**
- Make sure you've pushed the code to the `main` branch
- Check if GitHub Pages is enabled (see Step 2)

**If the workflow failed:**
- Click on the failed workflow run
- Check the error messages in the logs
- Common issues:
  - Missing GitHub Secrets (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  - Build errors
  - Node version issues

## Step 2: Verify GitHub Pages Configuration

1. Go to: https://github.com/chetannr/bcl/settings/pages
2. Check the **Source** setting:
   - Should be: **"GitHub Actions"** (NOT "Deploy from a branch")
3. If it's set to "Deploy from a branch":
   - Change it to "GitHub Actions"
   - Click "Save"
   - Wait a few minutes for GitHub to process

## Step 3: Verify GitHub Secrets Are Set

1. Go to: https://github.com/chetannr/bcl/settings/secrets/actions
2. Verify these secrets exist:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. If they're missing, add them (see GITHUB_SETUP_GUIDE.md)

## Step 4: Manually Trigger Deployment

If everything looks correct but the site still shows "Not Found":

1. Go to: https://github.com/chetannr/bcl/actions
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow" button
4. Wait for it to complete (usually 1-2 minutes)
5. Check the Pages settings again: https://github.com/chetannr/bcl/settings/pages

## Step 5: Verify the Deployment URL

After a successful deployment:

1. Go to: https://github.com/chetannr/bcl/settings/pages
2. You should see: "Your site is published at https://chetannr.github.io/bcl/"
3. It may take 1-2 minutes after the workflow completes for the site to be available

## Common Issues and Solutions

### Issue: "No deployments yet"
**Solution**: 
- Make sure GitHub Pages source is set to "GitHub Actions"
- Trigger the workflow manually (Step 4)

### Issue: Workflow fails with "Missing secrets"
**Solution**: 
- Add the required secrets (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Re-run the workflow

### Issue: Workflow succeeds but site shows 404
**Solution**:
- Wait 1-2 minutes for GitHub to propagate changes
- Clear your browser cache
- Try in incognito/private browsing mode
- Check the Pages settings for the published URL

### Issue: Site loads but shows blank page or errors
**Solution**:
- Open browser developer console (F12)
- Check for JavaScript errors
- Verify environment variables are loaded correctly
- Check that the base path `/bcl/` is correct in the build

## Quick Checklist

- [ ] GitHub Actions workflow exists and has run
- [ ] Workflow completed successfully (green checkmark)
- [ ] GitHub Pages source is set to "GitHub Actions"
- [ ] GitHub Secrets are configured (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Deployment shows as "Published" in Pages settings
- [ ] Waited 1-2 minutes after successful deployment
- [ ] Tried accessing the site in incognito mode

## Still Having Issues?

1. Check the GitHub Actions logs for specific errors
2. Verify your repository name is exactly `bcl` (case-sensitive)
3. Ensure the `main` branch contains the workflow file: `.github/workflows/deploy.yml`
4. Try accessing: https://chetannr.github.io/bcl/ (with trailing slash)

---

**Note**: GitHub Pages deployments can take 1-5 minutes to become available after a successful workflow run. Be patient and refresh after waiting a bit.

