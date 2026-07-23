// Memory-based caching service to store verified/successful imagin.studio image URLs
// and prevent redundant network fetches when re-rendering vehicle cards or grids.

const memoryImageCache = new Map<string, string>();

/**
 * Normalizes make and model into a unique cache key.
 */
export function getCacheKey(make: string, model: string): string {
  return `${make.trim().toLowerCase()}_${model.trim().toLowerCase()}`;
}

/**
 * Checks if an image URL exists in the memory cache.
 */
export function getCachedImage(make: string, model: string): string | undefined {
  const key = getCacheKey(make, model);
  return memoryImageCache.get(key);
}

/**
 * Stores a verified image URL in the memory cache.
 */
export function setCachedImage(make: string, model: string, url: string): void {
  if (!url) return;
  const key = getCacheKey(make, model);
  memoryImageCache.set(key, url);
}

/**
 * Clears the image cache if needed.
 */
export function clearImageCache(): void {
  memoryImageCache.clear();
}
