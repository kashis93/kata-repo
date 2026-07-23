const CACHE_PREFIX = 'autolot_img_cache_v3_';

export const getCachedImage = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (cached && (cached.includes('imagin.studio') || cached.includes('red_car'))) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return cached;
  } catch {
    return null;
  }
};

export const setCachedImage = (key, url) => {
  try {
    if (url && !url.includes('imagin.studio')) {
      localStorage.setItem(CACHE_PREFIX + key, url);
    }
  } catch (e) {
    console.warn('Failed to cache image URL in localStorage', e);
  }
};

