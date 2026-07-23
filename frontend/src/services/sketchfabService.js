/**
 * Real Sketchfab Data API Service for live 3D Car Model Embeds
 */

const FALLBACK_SKETCHFAB_MODELS = {
  porsche_911: {
    uid: '64e831737e6f47728e8d8ee346857997',
    name: 'Porsche 911 GT3 RS',
    user: { username: 'One3D', profileUrl: 'https://sketchfab.com/One3D' },
    embedUrl: 'https://sketchfab.com/models/64e831737e6f47728e8d8ee346857997/embed?autostart=1&cardboard=0&camera=0&ui_controls=1&ui_infos=0&ui_watermark=0',
    viewerUrl: 'https://sketchfab.com/3d-models/porsche-911-gt3-rs-64e831737e6f47728e8d8ee346857997',
    license: { label: 'CC Attribution' }
  },
  ferrari_sf90: {
    uid: '4a0f44bdff124d36b8aef46eef13a967',
    name: 'Ferrari SF90 Stradale',
    user: { username: 'Aleksey.Nesterov', profileUrl: 'https://sketchfab.com/Aleksey.Nesterov' },
    embedUrl: 'https://sketchfab.com/models/4a0f44bdff124d36b8aef46eef13a967/embed?autostart=1&cardboard=0&camera=0&ui_controls=1&ui_infos=0&ui_watermark=0',
    viewerUrl: 'https://sketchfab.com/3d-models/ferrari-sf90-stradale-4a0f44bdff124d36b8aef46eef13a967',
    license: { label: 'CC Attribution' }
  },
  lamborghini_huracan: {
    uid: '0ed633a69a9e4d1d916ea0ddf3be8f45',
    name: 'Lamborghini Huracan EVO',
    user: { username: 'alex.k3D', profileUrl: 'https://sketchfab.com/alex.k3D' },
    embedUrl: 'https://sketchfab.com/models/0ed633a69a9e4d1d916ea0ddf3be8f45/embed?autostart=1&cardboard=0&camera=0&ui_controls=1&ui_infos=0&ui_watermark=0',
    viewerUrl: 'https://sketchfab.com/3d-models/lamborghini-huracan-0ed633a69a9e4d1d916ea0ddf3be8f45',
    license: { label: 'CC Attribution' }
  }
};

export async function searchSketchfabCarModel(make, model) {
  const cleanMake = make.toLowerCase().trim();
  const cleanModel = model.toLowerCase().trim();
  const key = `${cleanMake}_${cleanModel.split(' ')[0]}`;

  if (FALLBACK_SKETCHFAB_MODELS[key]) {
    return FALLBACK_SKETCHFAB_MODELS[key];
  }

  try {
    const q = encodeURIComponent(`${make} ${model}`);
    const res = await fetch(`https://api.sketchfab.com/v3/search?q=${q}&type=models&downloadable=false`);
    if (!res.ok) throw new Error('Sketchfab API error');

    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      const bestMatch = data.results[0];
      return {
        uid: bestMatch.uid,
        name: bestMatch.name,
        user: {
          username: bestMatch.user.username,
          profileUrl: bestMatch.user.profileUrl || `https://sketchfab.com/${bestMatch.user.username}`
        },
        embedUrl: `https://sketchfab.com/models/${bestMatch.uid}/embed?autostart=1&cardboard=0&camera=0&ui_controls=1&ui_infos=0&ui_watermark=0`,
        viewerUrl: bestMatch.viewerUrl || `https://sketchfab.com/3d-models/${bestMatch.uid}`,
        license: bestMatch.license ? { label: bestMatch.license.label } : undefined
      };
    }
  } catch (err) {
    console.warn(`[SketchfabService] Live search error for ${make} ${model}:`, err);
  }

  // Fallback match check
  for (const [fKey, modelObj] of Object.entries(FALLBACK_SKETCHFAB_MODELS)) {
    const [fMake] = fKey.split('_');
    if (cleanMake.includes(fMake)) {
      return modelObj;
    }
  }

  return null;
}
