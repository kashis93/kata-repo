/**
 * Search Sketchfab 3D Car Model embed helper
 */
const CAR_MODELS_3D = {
  porsche: {
    '911 gt3 rs': 'https://sketchfab.com/models/e7456db69e124f1cb9d0685718a3ddaa/embed',
    default: 'https://sketchfab.com/models/e7456db69e124f1cb9d0685718a3ddaa/embed'
  },
  ferrari: {
    default: 'https://sketchfab.com/models/50c8227b6131498b9a10ebfae903a429/embed'
  },
  lamborghini: {
    default: 'https://sketchfab.com/models/ceaa26227db04392a2a074ec60beec81/embed'
  }
};

export async function searchSketchfabCarModel(make, model) {
  try {
    const makeKey = (make || '').toLowerCase();
    const modelKey = (model || '').toLowerCase();

    if (CAR_MODELS_3D[makeKey]) {
      const url = CAR_MODELS_3D[makeKey][modelKey] || CAR_MODELS_3D[makeKey].default;
      return {
        name: `${make} ${model} 3D CAD Mesh`,
        embedUrl: url
      };
    }

    // Default fallback interactive car embed
    return {
      name: `${make} ${model} 3D Model`,
      embedUrl: 'https://sketchfab.com/models/e7456db69e124f1cb9d0685718a3ddaa/embed'
    };
  } catch (err) {
    console.warn('Sketchfab model resolution error:', err);
    return null;
  }
}
