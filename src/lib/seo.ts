import { useEffect } from 'react';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  structuredData?: Record<string, unknown>;
}

const DEFAULT_CONFIG = {
  siteName: 'BCL 2025',
  siteUrl: 'https://bclclub.in',
  defaultTitle: 'BCL 2025 - Bellandur Cricket League',
  defaultDescription: 'Bellandur Cricket League 2025 - View live match schedules, team standings, player rosters, and tournament information.',
  defaultImage: 'https://bclclub.in/favicon.png',
  twitterHandle: '@bclclub',
  locale: 'en_IN',
};

/**
 * Custom hook to manage SEO meta tags dynamically
 */
export function useSEO(config: SEOConfig = {}) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      section,
    } = config;

    // Update title
    const fullTitle = title 
      ? `${title} | ${DEFAULT_CONFIG.siteName}`
      : DEFAULT_CONFIG.defaultTitle;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        const [attr, value] = selector.match(/\[(.*?)=['"]?(.*?)['"]?\]/)?.slice(1) || [];
        if (attr && value) {
          tag.setAttribute(attr, value);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Update basic meta tags
    if (description) {
      updateMetaTag('meta[name="description"]', description);
    }

    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }

    if (author) {
      updateMetaTag('meta[name="author"]', author);
    }

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', title || DEFAULT_CONFIG.defaultTitle);
    updateMetaTag('meta[property="og:description"]', description || DEFAULT_CONFIG.defaultDescription);
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:url"]', url || DEFAULT_CONFIG.siteUrl);
    updateMetaTag('meta[property="og:image"]', image || DEFAULT_CONFIG.defaultImage);
    updateMetaTag('meta[property="og:site_name"]', DEFAULT_CONFIG.siteName);
    updateMetaTag('meta[property="og:locale"]', DEFAULT_CONFIG.locale);

    if (publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', publishedTime);
    }

    if (modifiedTime) {
      updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
    }

    if (author) {
      updateMetaTag('meta[property="article:author"]', author);
    }

    if (section) {
      updateMetaTag('meta[property="article:section"]', section);
    }

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', title || DEFAULT_CONFIG.defaultTitle);
    updateMetaTag('meta[name="twitter:description"]', description || DEFAULT_CONFIG.defaultDescription);
    updateMetaTag('meta[name="twitter:image"]', image || DEFAULT_CONFIG.defaultImage);
    updateMetaTag('meta[name="twitter:url"]', url || DEFAULT_CONFIG.siteUrl);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || DEFAULT_CONFIG.siteUrl);
  }, [config]);
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': `${DEFAULT_CONFIG.siteUrl}${crumb.url}`,
    })),
  };
}

/**
 * Generate SportsEvent structured data for a match
 */
export function generateMatchSchema(match: {
  name: string;
  startDate: string;
  location: string;
  team1: string;
  team2: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    'name': match.name,
    'startDate': match.startDate,
    'eventStatus': 'https://schema.org/EventScheduled',
    'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
    'location': {
      '@type': 'Place',
      'name': match.location,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Bellandur',
        'addressRegion': 'Karnataka',
        'addressCountry': 'IN',
      },
    },
    'description': match.description || `Cricket match between ${match.team1} and ${match.team2}`,
    'competitor': [
      {
        '@type': 'SportsTeam',
        'name': match.team1,
      },
      {
        '@type': 'SportsTeam',
        'name': match.team2,
      },
    ],
    'organizer': {
      '@type': 'SportsOrganization',
      'name': 'Bellandur Cricket League',
      'url': DEFAULT_CONFIG.siteUrl,
    },
  };
}

/**
 * Generate SportsTeam structured data
 */
export function generateTeamSchema(team: {
  name: string;
  logo?: string;
  description?: string;
  players?: Array<{ name: string; role?: string }>;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    'name': team.name,
    'sport': 'Cricket',
    'memberOf': {
      '@type': 'SportsOrganization',
      'name': 'Bellandur Cricket League',
    },
  };

  if (team.logo) {
    schema.logo = team.logo;
  }

  if (team.description) {
    schema.description = team.description;
  }

  if (team.players && team.players.length > 0) {
    schema.athlete = team.players.map((player) => ({
      '@type': 'Person',
      'name': player.name,
      'roleName': player.role || 'Player',
    }));
  }

  return schema;
}

/**
 * Inject structured data into the page
 */
export function injectStructuredData(data: Record<string, unknown> | Array<Record<string, unknown>>, id = 'structured-data') {
  // Remove existing script if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create new script tag
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
}

/**
 * Hook to inject structured data
 */
export function useStructuredData(data: Record<string, unknown> | Array<Record<string, unknown>> | null, id = 'structured-data') {
  useEffect(() => {
    if (data) {
      injectStructuredData(data, id);
    }

    return () => {
      const script = document.getElementById(id);
      if (script) {
        script.remove();
      }
    };
  }, [data, id]);
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': DEFAULT_CONFIG.siteName,
    'url': DEFAULT_CONFIG.siteUrl,
    'description': DEFAULT_CONFIG.defaultDescription,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${DEFAULT_CONFIG.siteUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    'name': 'Bellandur Cricket League',
    'alternateName': 'BCL',
    'url': DEFAULT_CONFIG.siteUrl,
    'logo': DEFAULT_CONFIG.defaultImage,
    'description': 'Bellandur Cricket League is a local cricket tournament featuring teams competing in a professional league format.',
    'sport': 'Cricket',
    'foundingDate': '2025',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Bellandur',
      'addressRegion': 'Karnataka',
      'addressCountry': 'IN',
    },
  };
}
