# Accessibility Guide - BCL 2025

This document outlines the accessibility features implemented in the BCL 2025 application and best practices for maintaining accessibility.

## Table of Contents

1. [Overview](#overview)
2. [Semantic HTML](#semantic-html)
3. [ARIA Attributes](#aria-attributes)
4. [Keyboard Navigation](#keyboard-navigation)
5. [Screen Reader Support](#screen-reader-support)
6. [Color Contrast](#color-contrast)
7. [Focus Management](#focus-management)
8. [Testing](#testing)

## Overview

The BCL 2025 application is built with accessibility as a core principle, following WCAG 2.1 Level AA guidelines. We aim to provide an inclusive experience for all users, including those using assistive technologies.

## Semantic HTML

### Proper Use of HTML5 Elements

We use semantic HTML5 elements throughout the application:

- `<header>` - Page and section headers
- `<nav>` - Navigation menus
- `<main>` - Primary content area
- `<section>` - Thematic groupings of content
- `<article>` - Self-contained content (e.g., match cards)
- `<footer>` - Page and section footers
- `<aside>` - Sidebar content
- `<time>` - Dates and times with `datetime` attribute

### Example

```tsx
<header>
  <h1>BCL 2025</h1>
  <nav aria-label="Main navigation">
    {/* Navigation items */}
  </nav>
</header>
```

## ARIA Attributes

### Roles

- `role="navigation"` - Navigation landmarks
- `role="main"` - Main content area
- `role="tablist"` - Tab interfaces
- `role="tab"` - Individual tabs
- `role="tabpanel"` - Tab content panels
- `role="status"` - Status updates
- `role="application"` - Root application container

### States and Properties

- `aria-label` - Accessible labels for elements without visible text
- `aria-labelledby` - References to labeling elements
- `aria-describedby` - Additional descriptions
- `aria-selected` - Selected state for tabs
- `aria-pressed` - Pressed state for toggle buttons
- `aria-hidden` - Hide decorative elements from screen readers
- `aria-live` - Live region updates (polite, assertive)
- `aria-controls` - Relationship between controls and content

### Example

```tsx
<button
  role="tab"
  aria-selected={isActive}
  aria-controls="panel-id"
  id="tab-id"
>
  Matches
</button>
```

## Keyboard Navigation

### Focus Management

- All interactive elements are keyboard accessible
- Tab order follows logical reading order
- Skip links provided to bypass repetitive content
- Focus indicators clearly visible

### Keyboard Shortcuts

- `Tab` - Move to next interactive element
- `Shift + Tab` - Move to previous interactive element
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and dropdowns
- Arrow keys - Navigate within tab lists

### Skip Links

A skip link is available at the top of every page:

```tsx
<a href="#main-content">Skip to main content</a>
```

## Screen Reader Support

### Image Alt Text

All images have descriptive alt text:

```tsx
<img 
  src={teamLogo} 
  alt={`${teamName} team logo`}
  loading="lazy"
/>
```

### Form Labels

All form inputs have associated labels:

```tsx
<label htmlFor="team-filter">
  Filter by Team
</label>
<select id="team-filter">
  {/* Options */}
</select>
```

### Live Regions

Dynamic content updates are announced:

```tsx
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

### Visually Hidden Content

Content hidden visually but available to screen readers:

```tsx
<VisuallyHidden>
  Additional context for screen readers
</VisuallyHidden>
```

## Color Contrast

### Contrast Ratios

All text meets WCAG AA standards:

- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

### Theme Support

Both light and dark themes maintain proper contrast ratios.

### Non-Color Indicators

Information is not conveyed by color alone:

- Active states use underlines or borders
- Status indicators use icons and text
- Form errors include text descriptions

## Focus Management

### Focus Indicators

Custom focus styles that are clearly visible:

```css
.button:focus {
  outline: 2px solid #1e40af;
  outline-offset: 2px;
}
```

### Focus Trapping

Modals and dialogs trap focus within their boundaries.

### Focus Restoration

Focus is restored to the triggering element when modals close.

## Testing

### Manual Testing Checklist

- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify all images have alt text
- [ ] Check color contrast ratios
- [ ] Test form validation messages
- [ ] Verify skip links work
- [ ] Test with browser zoom (200%)
- [ ] Check responsive design on mobile

### Automated Testing

Use tools like:

- **axe DevTools** - Browser extension for accessibility testing
- **Lighthouse** - Chrome DevTools audit
- **WAVE** - Web accessibility evaluation tool
- **eslint-plugin-jsx-a11y** - Linting for accessibility issues

### Screen Reader Testing

Test with popular screen readers:

- **NVDA** (Windows) - Free and open source
- **JAWS** (Windows) - Industry standard
- **VoiceOver** (macOS/iOS) - Built-in
- **TalkBack** (Android) - Built-in

## Best Practices for Developers

1. **Always use semantic HTML first** - Before adding ARIA, check if semantic HTML can solve the problem
2. **Test with keyboard only** - Ensure all functionality is accessible via keyboard
3. **Use ARIA sparingly** - Only when HTML semantics are insufficient
4. **Provide meaningful labels** - All interactive elements need accessible names
5. **Maintain focus visibility** - Never remove outline without providing alternative
6. **Test with real screen readers** - Don't rely solely on automated tools
7. **Keep content structure logical** - Proper heading hierarchy (h1, h2, h3, etc.)
8. **Announce dynamic changes** - Use ARIA live regions for updates
9. **Avoid keyboard traps** - Ensure users can always navigate away
10. **Document accessibility features** - Keep this guide updated

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Contact

For accessibility concerns or questions, please file an issue in the project repository.
