import { getCachedImage, setCachedImage } from './imageCache';

/**
 * Generates an imagin.studio CDN image URL for a given vehicle make and model.
 * Uses a default public customer key 'hrfwsdesign' or fallback CDN patterns.
 */
export function getImaginStudioUrl(make: string, model: string): string {
  const cleanMake = encodeURIComponent(make.trim().toLowerCase());
  // Extract primary model family word (e.g. "911 GT3 RS" -> "911", "M4 Competition" -> "m4")
  const firstModelWord = model.trim().split(' ')[0] || model;
  const cleanModel = encodeURIComponent(firstModelWord.toLowerCase());

  return `https://cdn.imagin.studio/getImage?customer=hrfwsdesign&make=${cleanMake}&modelFamily=${cleanModel}&angle=01&zoomType=fullscreen&width=1200`;
}

/**
 * Returns the best image URL for a vehicle.
 * Checks memory cache first, then explicit custom imageUrl, then imagin.studio CDN.
 */
export function getVehicleImage(make: string, model: string, customImageUrl?: string): string {
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return customImageUrl.trim();
  }

  const cached = getCachedImage(make, model);
  if (cached) {
    return cached;
  }

  const generatedUrl = getImaginStudioUrl(make, model);
  setCachedImage(make, model, generatedUrl);
  return generatedUrl;
}

/**
 * Pre-caches a verified image URL into the memory cache.
 */
export function setCachedVehicleImage(make: string, model: string, url: string): void {
  setCachedImage(make, model, url);
}
