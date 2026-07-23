import { getCachedImage, setCachedImage } from './imageCache';

/**
 * Real CDN Image Service using curated Unsplash high-res vehicle imagery with Imagin.studio backup.
 */

const VEHICLE_IMAGE_MAP = {
  // Porsche
  porsche_911: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
  porsche_cayenne: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  porsche_taycan: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
  
  // Ferrari & Lambo & Exotics
  ferrari_sf90: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
  ferrari_488: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
  lamborghini_huracan: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
  lamborghini_revuelto: 'https://images.unsplash.com/photo-1519245659613-d470731fb60a?auto=format&fit=crop&w=1200&q=80',
  mclaren_750s: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
  aston_dbs: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
  aston_db11: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',

  // Audi & BMW & Mercedes
  audi_rs6: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
  audi_rs: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
  bmw_m8: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
  bmw_m3: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
  mercedes_amg: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  land_rover: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',

  // Popular Brands (Toyota, Ford, Tesla, Chevrolet)
  toyota_camry: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
  toyota_supra: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
  ford_explorer: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  ford_mustang: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80',
  tesla_model: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  tesla_3: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  chevrolet_silverado: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
  chevrolet_corvette: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1200&q=80'
};

const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
];

export const getVehicleImage = (
  make = '',
  model = '',
  customUrl = '',
  angle = '01'
) => {
  if (customUrl && customUrl.trim().length > 0 && !customUrl.includes('imagin.studio')) {
    return customUrl.trim();
  }

  const cleanMake = make.toLowerCase().trim();
  const cleanModel = model.toLowerCase().trim();
  const cacheKey = `${cleanMake}_${cleanModel}_${angle}`;

  const cached = getCachedImage(cacheKey);
  if (cached) {
    return cached;
  }

  // Match against our high-res Unsplash vehicle library first
  for (const [key, image] of Object.entries(VEHICLE_IMAGE_MAP)) {
    const parts = key.split('_');
    const matchMake = parts[0];
    const matchModel = parts[1] || '';

    if (cleanMake.includes(matchMake) || cleanModel.includes(matchModel) || cleanModel.includes(matchMake)) {
      setCachedImage(cacheKey, image);
      return image;
    }
  }

  // Select a deterministic fallback image based on string hash
  const hash = (cleanMake + cleanModel).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackImage = DEFAULT_FALLBACK_IMAGES[hash % DEFAULT_FALLBACK_IMAGES.length];

  setCachedImage(cacheKey, fallbackImage);
  return fallbackImage;
};

