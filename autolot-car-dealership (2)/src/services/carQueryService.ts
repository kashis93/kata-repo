export interface CarMake {
  id: string;
  name: string;
}

export interface CarModel {
  name: string;
}

// Extensive local fallback catalog for fast instant autocompletion and offline reliability
const FALLBACK_MAKES: Record<string, string[]> = {
  Porsche: ['911', '718 Cayman', '718 Boxster', 'Taycan', 'Panamera', 'Macan', 'Cayenne'],
  BMW: ['M2', 'M3', 'M4', 'M5', 'M8', 'Z4', 'i4', 'i7', 'iX', 'X3 M', 'X5 M', 'X7'],
  'Mercedes-Benz': ['AMG GT', 'SL Roadster', 'C 63 AMG', 'E 63 AMG', 'S-Class', 'G-Class', 'EQS', 'GLE Coupe'],
  Audi: ['R8', 'RS e-tron GT', 'RS6 Avant', 'RS7', 'RS5', 'RSQ8', 'TT RS', 'S4'],
  Ferrari: ['SF90 Stradale', '296 GTB', 'F8 Tributo', '812 GTS', 'Roma', 'Purosangue', 'LaFerrari'],
  Lamborghini: ['Revuelto', 'Huracán', 'Aventador', 'Urus', 'Countach LPI 800-4'],
  McLaren: ['750S', '720S', 'Artura', 'GT', '765LT', 'P1', 'Senna'],
  Chevrolet: ['Corvette Stingray', 'Corvette Z06', 'Corvette E-Ray', 'Camaro ZL1', 'Tahoe', 'Suburban', 'Silverado'],
  Ford: ['Mustang Dark Horse', 'Mustang GT', 'Mustang Mach-E', 'F-150 Raptor', 'Bronco Raptor', 'GT'],
  Dodge: ['Challenger SRT Hellcat', 'Charger SRT Hellcat', 'Durango SRT'],
  Tesla: ['Model S Plaid', 'Model 3 Performance', 'Model X Plaid', 'Model Y', 'Cybertruck', 'Roadster'],
  AstonMartin: ['Vantage', 'DB12', 'DBS', 'DBX707', 'Valkyrie'],
  Bentley: ['Continental GT', 'Flying Spur', 'Bentayga'],
  RollsRoyce: ['Spectre', 'Ghost', 'Phantom', 'Cullinan'],
  Lexus: ['LFA', 'LC 500', 'RC F', 'IS 500', 'GX 550', 'LX 600'],
  Toyota: ['GR Supra', 'GR Corolla', 'GR86', 'Land Cruiser', '4Runner', 'Tacoma TRD Pro'],
  Honda: ['Civic Type R', 'NSX', 'Accord', 'CR-V', 'Pilot'],
  Nissan: ['GT-R', 'Z Nismo', 'Armada', '370Z'],
  Subaru: ['WRX STI', 'BRZ', 'Outback Wilderness'],
  Jeep: ['Wrangler Rubicon 392', 'Grand Cherokee Trackhawk', 'Gladiator'],
  AlfaRomeo: ['Giulia Quadrifoglio', 'Stelvio Quadrifoglio', 'Tonale'],
  Maserati: ['MC20', 'GranTurismo', 'Grecale', 'Ghibli Trofeo'],
  Bugatti: ['Chiron', 'Veyron', 'Tourbillon', 'Divo'],
  Koenigsegg: ['Jesko', 'Gemera', 'Regera'],
  Pagani: ['Utopia', 'Huayra', 'Zonda']
};

/**
 * Fetches vehicle makes from CarQuery API or returns fallback list
 */
export async function getCarMakes(): Promise<CarMake[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://www.carqueryapi.com/api/0.3/?cmd=getMakes', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.Makes) && data.Makes.length > 0) {
        return data.Makes.map((m: { make_id: string; make_display: string }) => ({
          id: m.make_id,
          name: m.make_display
        }));
      }
    }
  } catch {
    // Silent fallback to local offline dataset
  }

  return Object.keys(FALLBACK_MAKES).map(make => ({
    id: make.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name: make
  }));
}

/**
 * Fetches models for a selected make from CarQuery API or local fallback
 */
export async function getCarModels(makeName: string): Promise<CarModel[]> {
  if (!makeName) return [];

  const cleanMakeName = makeName.trim();
  const matchedKey = Object.keys(FALLBACK_MAKES).find(
    k => k.toLowerCase() === cleanMakeName.toLowerCase()
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${encodeURIComponent(cleanMakeName.toLowerCase())}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.Models) && data.Models.length > 0) {
        return data.Models.map((m: { model_name: string }) => ({
          name: m.model_name
        }));
      }
    }
  } catch {
    // Silent fallback
  }

  if (matchedKey && FALLBACK_MAKES[matchedKey]) {
    return FALLBACK_MAKES[matchedKey].map(model => ({ name: model }));
  }

  return [];
}
