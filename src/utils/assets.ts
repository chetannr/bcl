/**
 * Utility function to get asset paths that work correctly with Vite's base path.
 * 
 * In development, base path is '/bcl/'
 * On GitHub Pages, base path is '/bcl/' (or repo name)
 * 
 * This function ensures assets load correctly regardless of the base path.
 * 
 * @param path - Asset path starting with '/' (e.g., '/assets/player-template.png')
 * @returns Asset path with base URL prepended
 * 
 * @example
 * getAssetPath('/assets/player-template.png') // Returns '/bcl/assets/player-template.png' in production
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Vite's BASE_URL already includes trailing slash (e.g., '/bcl/')
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

