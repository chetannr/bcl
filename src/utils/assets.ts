/**
 * Utility function to get asset paths that work correctly with Vite's base path.
 * 
 * In development, base path is '/bcl/'
 * On GitHub Pages, base path is '/bcl/' (or repo name)
 * 
 * This function ensures assets load correctly regardless of the base path.
 * 
 * @param path - Asset path (e.g., '/assets/player-template.png' or full URL)
 * @returns Asset path with base URL prepended if it's a local relative path
 * 
 * @example
 * getAssetPath('/assets/player-template.png') // Returns '/bcl/assets/player-template.png' in production
 * getAssetPath('https://example.com/image.jpg') // Returns 'https://example.com/image.jpg' (unchanged)
 */
export function getAssetPath(path: string): string {
  // If it's already an absolute URL (http/https) or data URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // If it's a relative path starting with '/', prepend base path
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Vite's BASE_URL already includes trailing slash (e.g., '/bcl/')
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

