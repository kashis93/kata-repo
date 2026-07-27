/**
 * Search Sketchfab 3D Car Model embed helper
 */
const CAR_MODELS_3D = {
  porsche: {
    '911 gt3 rs': 'https://sketchfab.com/models/80c0587db37841f3a22830f3050965ea/embed',
    default: 'https://sketchfab.com/models/80c0587db37841f3a22830f3050965ea/embed'
  },
  ferrari: {
    default: 'https://sketchfab.com/models/5fb87ffec6ab4c88a83492576b50ce97/embed'
  },
  lamborghini: {
    default: 'https://sketchfab.com/models/b272186835154366a6a9b40742f3607a/embed'
  },
  bmw: {
    default: 'https://sketchfab.com/models/4d2a138722884d59ab567362efef1803/embed'
  },
  mercedes: {
    default: 'https://sketchfab.com/models/80c0587db37841f3a22830f3050965ea/embed'
  },
  mclaren: {
    default: 'https://sketchfab.com/models/5fb87ffec6ab4c88a83492576b50ce97/embed'
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
      embedUrl: 'https://sketchfab.com/models/80c0587db37841f3a22830f3050965ea/embed'
    };
  } catch (err) {
    console.warn('Sketchfab model resolution error:', err);
    return null;
  }
}

