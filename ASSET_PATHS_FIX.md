# Asset Paths Fix for GitHub Pages

## Problem

When deployed to GitHub Pages at `https://chetannr.github.io/bcl/`, all asset paths need to include the base path `/bcl/`. 

Currently, assets are hardcoded with absolute paths like:
- `/assets/player-template.png`
- `/assets/stadium-bg.jpg`
- `/assets/teams/bcl-bidding.jpg`

These should be:
- `/bcl/assets/player-template.png`
- `/bcl/assets/stadium-bg.jpg`
- `/bcl/assets/teams/bcl-bidding.jpg`

## Solution

A utility function `getAssetPath()` has been created in `src/utils/assets.ts` that automatically prepends the base path using Vite's `import.meta.env.BASE_URL`.

### Usage

Replace hardcoded asset paths:

**Before:**
```tsx
<img src="/assets/player-template.png" alt="Player" />
```

**After:**
```tsx
import { getAssetPath } from '../../utils/assets';

<img src={getAssetPath('/assets/player-template.png')} alt="Player" />
```

### Files That Need Updates

Based on the grep results, these files contain hardcoded asset paths:

#### High Priority (Display/Public Facing):
1. `src/routes/display/index.tsx` - Background image, logo
2. `src/components/display/CurrentPlayerDisplay.tsx` - Welcome image, logos, player photos
3. `src/components/display/TeamStatsPanel.tsx` - Player photos
4. `src/components/display/TeamPlayersModal.tsx` - Player photos

#### Admin Components:
5. `src/components/admin/AddPlayerModal.tsx` - Photo URLs, placeholder
6. `src/components/admin/EditPlayerModal.tsx` - Photo URLs, placeholder
7. `src/components/admin/AddTeamModal.tsx` - Logo URLs, placeholder
8. `src/components/admin/EditTeamModal.tsx` - Logo URLs, placeholder
9. `src/components/admin/PlayerManagement.tsx` - Player photos
10. `src/components/admin/AuctionControls.tsx` - Player photos
11. `src/components/admin/PlayerQueue.tsx` - Player photos
12. `src/components/admin/TeamManagement.tsx` - Team logos
13. `src/components/admin/TransactionTable.tsx` - Player photos
14. `src/components/admin/TeamBudgetPanel.tsx` - Player photos

#### Shared Components:
15. `src/components/shared/PlayerInfo.tsx` - Player photos
16. `src/components/shared/TeamBadge.tsx` - Team logos

### Quick Fix Script

You can use find-and-replace in your IDE:

1. Find: `src="/assets/`
2. Replace with: `src={getAssetPath('/assets/`
3. Then manually close the JSX: add `)}` before the closing `/>` or `>`

Or for inline styles:
1. Find: `url('/assets/`
2. Replace with: `url('${getAssetPath('/assets/`
3. Close with: `')}`

### Testing

After updating:
1. Build locally: `npm run build`
2. Preview: `npm run preview`
3. Visit: `http://localhost:4173/bcl/`
4. Check that all images load correctly
5. Check browser console for 404 errors on assets

### Example Fix

**File: `src/routes/display/index.tsx`**

Before:
```tsx
<div
  style={{
    backgroundImage: "url('/assets/stadium-bg.jpg')",
  }}
>
```

After:
```tsx
import { getAssetPath } from '../../utils/assets';

<div
  style={{
    backgroundImage: `url('${getAssetPath('/assets/stadium-bg.jpg')}')`,
  }}
>
```

**File: `src/components/display/CurrentPlayerDisplay.tsx`**

Before:
```tsx
<img
  src="/assets/welcome.jpeg"
  alt="Welcome to BCL 2025 Auction"
/>
```

After:
```tsx
import { getAssetPath } from '../../utils/assets';

<img
  src={getAssetPath('/assets/welcome.jpeg')}
  alt="Welcome to BCL 2025 Auction"
/>
```

### Error Handler Updates

For `onError` handlers that set fallback images:

Before:
```tsx
onError={(e) => {
  (e.target as HTMLImageElement).src = '/assets/player-template.png';
}}
```

After:
```tsx
import { getAssetPath } from '../../utils/assets';

onError={(e) => {
  (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
}}
```

## Priority

**Immediate**: Fix display route and CurrentPlayerDisplay as these are the most visible components.

**Important**: Fix all admin components that reference assets.

**Nice to have**: Fix shared components for consistency.

---

**Note**: This fix ensures assets load correctly both in development (`npm run dev`) and in production on GitHub Pages.

