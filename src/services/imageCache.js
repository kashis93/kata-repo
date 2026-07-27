/**
 * Simple in-memory and LocalStorage image URL cache service
 */
const cache = new Map();

export const getCachedImage = (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  try {
    const item = localStorage.getItem(`autolot_img_cache_${key}`);
    if (item) {
      cache.set(key, item);
      return item;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const setCachedImage = (key, url) => {
  if (!key || !url) return;
  cache.set(key, url);
  try {
    localStorage.setItem(`autolot_img_cache_${key}`, url);
  } catch (e) {
    // Ignore storage errors
  }
};
