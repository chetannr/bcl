# Deployment Guide

This guide covers deploying the BCL 2025 Bidding application to various hosting platforms.

## Prerequisites

1. **Supabase Setup**: Ensure your Supabase project is configured with:
   - Database tables (teams, players, auction_results, auction_state)
   - Row Level Security (RLS) policies configured
   - Realtime subscriptions enabled

2. **Environment Variables**: You'll need:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important**: Never commit `.env` files to version control. They are already in `.gitignore`.

## Deployment Options

### Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```

3. **Deploy via Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Add environment variables in project settings
   - Deploy

4. **Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

The `vercel.json` file is already configured for optimal Vite deployment.

### Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   netlify deploy --prod
   ```

3. **Deploy via Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Import your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site settings → Environment variables

The `netlify.toml` file is already configured.

### Other Platforms

#### GitHub Pages

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

#### Cloudflare Pages

1. Connect your Git repository to Cloudflare Pages
2. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Add environment variables in Pages settings

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test admin panel access (`/admin/auction`)
- [ ] Test display view (`/display`)
- [ ] Verify real-time updates work
- [ ] Test player selection and bidding flow
- [ ] Check that Supabase RLS policies allow public read access for display view
- [ ] Verify images load correctly
- [ ] Test on mobile devices

## Performance Optimizations

The application includes several performance optimizations:

1. **Code Splitting**: Automatic via Vite and TanStack Router
2. **Query Optimization**: React Query with optimized stale times
3. **Component Memoization**: Expensive components use `React.memo`
4. **Real-time Optimization**: Single Supabase channel for all subscriptions
5. **Build Optimization**: Manual chunks for vendor libraries

## Troubleshooting

### Real-time Updates Not Working

1. Check Supabase Realtime is enabled in project settings
2. Verify RLS policies allow subscriptions
3. Check browser console for WebSocket errors

### Environment Variables Not Loading

1. Ensure variables start with `VITE_` prefix
2. Restart dev server after adding variables
3. In production, verify variables are set in hosting platform

### Build Failures

1. Run `npm run build` locally to check for errors
2. Ensure all dependencies are in `package.json`
3. Check TypeScript errors: `npm run lint`

## Support

For issues or questions, check:
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vite Documentation](https://vitejs.dev)
