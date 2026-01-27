# SEO Guide - BCL 2026

This document outlines the SEO strategies and implementations in the BCL 2026 application.

## Table of Contents

1. [Overview](#overview)
2. [Meta Tags](#meta-tags)
3. [Structured Data](#structured-data)
4. [Social Sharing](#social-sharing)
5. [Technical SEO](#technical-seo)
6. [Content Optimization](#content-optimization)
7. [Performance](#performance)
8. [Monitoring](#monitoring)

## Overview

The BCL 2026 application implements comprehensive SEO best practices to ensure maximum visibility in search engines and optimal sharing on social media platforms.

## Meta Tags

### Primary Meta Tags

Located in `index.html`:

- `<title>` - Unique, descriptive page titles
- `<meta name="description">` - Concise page descriptions (150-160 characters)
- `<meta name="keywords">` - Relevant keywords
- `<meta name="author">` - Content author
- `<meta name="theme-color">` - Browser theme color
- `<link rel="canonical">` - Canonical URL to avoid duplicate content

### Dynamic Meta Tags

Using the `useSEO` hook from `src/lib/seo.ts`:

```tsx
useSEO({
  title: 'Match Schedule & Standings',
  description: 'View the complete BCL 2026 match schedule...',
  keywords: 'cricket matches, tournament schedule',
  url: 'https://bclclub.in/',
  type: 'website',
});
```

## Structured Data

### Schema.org Markup

We implement multiple Schema.org types:

#### 1. SportsOrganization

```json
{
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "name": "Bellandur Cricket League",
  "alternateName": "BCL",
  "url": "https://bclclub.in",
  "sport": "Cricket"
}
```

#### 2. SportsEvent

For individual matches:

```tsx
generateMatchSchema({
  name: "Match 1: Team A vs Team B",
  startDate: "2025-01-25T18:00:00+05:30",
  location: "Bellandur, Bangalore",
  team1: "Team A",
  team2: "Team B"
})
```

#### 3. SportsTeam

For team pages:

```tsx
generateTeamSchema({
  name: "Team Name",
  logo: "https://bclclub.in/team-logo.png",
  players: [
    { name: "Player Name", role: "Batsman" }
  ]
})
```

#### 4. BreadcrumbList

For navigation breadcrumbs:

```tsx
generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Matches', url: '/matches' }
])
```

#### 5. WebSite

With search action for Google:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BCL 2026",
  "url": "https://bclclub.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://bclclub.in/?search={search_term_string}"
    }
  }
}
```

### Using Structured Data Hooks

```tsx
import { useStructuredData, generateTeamSchema } from '../lib/seo';

// In your component
useStructuredData(
  generateTeamSchema({
    name: teamName,
    logo: teamLogo,
    players: teamPlayers
  }),
  'team-schema'
);
```

## Social Sharing

### Open Graph (Facebook, LinkedIn)

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://bclclub.in/" />
<meta property="og:title" content="BCL 2026 - Bellandur Cricket League" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://bclclub.in/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="BCL 2026" />
<meta property="og:locale" content="en_IN" />
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
<meta name="twitter:image:alt" content="..." />
```

### Recommended Image Sizes

- **Open Graph**: 1200x630px (1.91:1 ratio)
- **Twitter Card**: 1200x675px (16:9 ratio)
- **Favicon**: 512x512px (PNG)
- **Apple Touch Icon**: 180x180px (PNG)

## Technical SEO

### robots.txt

Located at `/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login

Sitemap: https://bclclub.in/sitemap.xml
```

### sitemap.xml

Located at `/public/sitemap.xml`:

- Lists all public pages
- Includes priority and change frequency
- Updated regularly

### Canonical URLs

Every page has a canonical URL to avoid duplicate content issues:

```html
<link rel="canonical" href="https://bclclub.in/page" />
```

### Mobile Optimization

- Responsive design
- Mobile-first approach
- Touch-friendly UI elements
- Proper viewport meta tag

### HTTPS

- All pages served over HTTPS
- Secure connections for all resources

### URL Structure

Clean, descriptive URLs:

- ✅ `https://bclclub.in/matches`
- ✅ `https://bclclub.in/teams/team-name`
- ❌ `https://bclclub.in/page?id=123`

## Content Optimization

### Heading Hierarchy

Proper heading structure (h1 → h2 → h3):

```tsx
<h1>BCL 2026</h1>
  <h2>Match Schedule</h2>
    <h3>January 25, 2025</h3>
```

### Alt Text for Images

Descriptive alt text for all images:

```tsx
<img 
  src={teamLogo} 
  alt="Mumbai Indians team logo showing blue and gold shield"
  loading="lazy"
/>
```

### Internal Linking

Strategic internal links to improve crawlability:

```tsx
<Link to="/teams">View All Teams</Link>
```

### Loading Optimization

- Lazy loading images: `loading="lazy"`
- DNS prefetch for external resources
- Preconnect to CDNs

### Content Quality

- Unique content for each page
- Regular updates to schedule/standings
- Relevant keywords naturally integrated
- Clear, concise descriptions

## Performance

### Core Web Vitals

Target metrics:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Strategies

1. **Image Optimization**
   - Lazy loading
   - Proper sizing
   - Modern formats (WebP)

2. **Code Splitting**
   - Route-based splitting
   - Dynamic imports

3. **Caching**
   - Service workers
   - HTTP caching headers

4. **Minification**
   - CSS/JS minification
   - Tree shaking

## Monitoring

### Google Search Console

Track:

- Index coverage
- Search performance
- Mobile usability
- Core Web Vitals

### Google Analytics

Monitor:

- Page views
- Bounce rate
- Session duration
- User flow

### Testing Tools

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/

2. **Google Rich Results Test**
   - https://search.google.com/test/rich-results

3. **Google Mobile-Friendly Test**
   - https://search.google.com/test/mobile-friendly

4. **Schema Markup Validator**
   - https://validator.schema.org/

5. **Open Graph Debugger**
   - https://developers.facebook.com/tools/debug/

6. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator

## Best Practices

1. **Regular Content Updates**
   - Update match schedules promptly
   - Keep team information current
   - Add new content regularly

2. **Monitor Performance**
   - Check Core Web Vitals monthly
   - Address issues quickly
   - Optimize continuously

3. **Test Social Sharing**
   - Verify OG tags display correctly
   - Test on multiple platforms
   - Update images as needed

4. **Keep Structured Data Valid**
   - Test with validators
   - Update schema when Google changes
   - Add new types as needed

5. **User Experience First**
   - Fast loading times
   - Mobile-friendly design
   - Clear navigation
   - Accessible to all users

## Checklist for New Pages

- [ ] Unique page title (< 60 characters)
- [ ] Meta description (150-160 characters)
- [ ] Canonical URL set
- [ ] Proper heading hierarchy (h1, h2, h3)
- [ ] Alt text for all images
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (Schema.org)
- [ ] Breadcrumbs
- [ ] Internal links
- [ ] Mobile responsive
- [ ] Fast loading (< 3s)
- [ ] Added to sitemap.xml
- [ ] robots.txt allows crawling

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)

## Contact

For SEO questions or suggestions, please file an issue in the project repository.
