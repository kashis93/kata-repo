export interface SketchfabModel {
  uid: string;
  name: string;
  user: {
    username: string;
    profileUrl: string;
  };
  license?: {
    label: string;
  };
  embedUrl: string;
  viewerUrl: string;
}

// In-memory cache for search results to prevent duplicate API requests
const sketchfabCache = new Map<string, SketchfabModel | null>();

/**
 * Searches Sketchfab Data API for 3D car models matching a given make and model.
 * Returns the best matching model metadata or null if no result found.
 */
export async function searchSketchfabCarModel(
  make: string,
  modelName: string
): Promise<SketchfabModel | null> {
  const cleanMake = make.trim();
  // Take first 2 words of model name to keep query broad and high-yield
  const cleanModel = modelName.trim().split(' ').slice(0, 2).join(' ');
  const cacheKey = `${cleanMake.toLowerCase()}_${cleanModel.toLowerCase()}`;

  if (sketchfabCache.has(cacheKey)) {
    return sketchfabCache.get(cacheKey) || null;
  }

  // List of fallback search queries from specific to general
  const searchQueries = [
    `${cleanMake} ${cleanModel} car`,
    `${cleanMake} ${cleanModel}`,
    `${cleanMake} car`
  ];

  for (const query of searchQueries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const endpoint = `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(query)}&categories=cars-vehicles&sort_by=-likeCount`;

      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          // Select first valid result
          const topResult = data.results[0];
          const resultModel: SketchfabModel = {
            uid: topResult.uid,
            name: topResult.name || `${cleanMake} ${cleanModel}`,
            user: {
              username: topResult.user?.username || 'Sketchfab Creator',
              profileUrl: topResult.user?.profileUrl || `https://sketchfab.com/${topResult.user?.username || ''}`
            },
            license: topResult.license ? { label: topResult.license.label || 'Standard' } : undefined,
            embedUrl: `https://sketchfab.com/models/${topResult.uid}/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_theme=dark`,
            viewerUrl: topResult.viewerUrl || `https://sketchfab.com/3d-models/${topResult.uid}`
          };

          sketchfabCache.set(cacheKey, resultModel);
          return resultModel;
        }
      }
    } catch {
      // Continue to next query attempt
    }
  }

  sketchfabCache.set(cacheKey, null);
  return null;
}
