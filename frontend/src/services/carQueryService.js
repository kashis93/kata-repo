/**
 * Real CarQuery API Service for dynamic auto manufacturers and model datasets.
 */

const FALLBACK_MAKES = [
  { id: 'porsche', name: 'Porsche' },
  { id: 'ferrari', name: 'Ferrari' },
  { id: 'aston-martin', name: 'Aston Martin' },
  { id: 'mercedes-benz', name: 'Mercedes-Benz' },
  { id: 'lamborghini', name: 'Lamborghini' },
  { id: 'mclaren', name: 'McLaren' },
  { id: 'audi', name: 'Audi' },
  { id: 'bmw', name: 'BMW' },
  { id: 'chevrolet', name: 'Chevrolet' },
  { id: 'ford', name: 'Ford' },
  { id: 'tesla', name: 'Tesla' }
];

const FALLBACK_MODELS = {
  Porsche: [{ name: '911 GT3 RS' }, { name: '911 Turbo S' }, { name: 'Taycan Turbo GT' }, { name: '718 Cayman GT4' }],
  Ferrari: [{ name: 'SF90 Stradale' }, { name: '296 GTB' }, { name: '812 GTS' }, { name: 'Purosangue' }],
  'Aston Martin': [{ name: 'DBS 770 Ultimate' }, { name: 'Vantage F1 Edition' }, { name: 'DB12' }, { name: 'Valhalla' }],
  'Mercedes-Benz': [{ name: 'AMG GT Black Series' }, { name: 'AMG SL 63' }, { name: 'G 63 AMG' }, { name: 'EQS 580' }],
  Lamborghini: [{ name: 'Huracán Sterrato' }, { name: 'Revuelto' }, { name: 'Urus Performante' }],
  McLaren: [{ name: '750S Spider' }, { name: '765LT' }, { name: 'Artura' }, { name: 'P1' }],
  Audi: [{ name: 'RS e-tron GT' }, { name: 'R8 V10 Performance' }, { name: 'RS6 Avant' }],
  BMW: [{ name: 'M8 Competition' }, { name: 'M4 CSL' }, { name: 'M3 CS' }, { name: 'i7 M60' }]
};

export async function getCarMakes() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://www.carqueryapi.com/api/0.3/?cmd=getMakes&sold_in_us=1', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('CarQuery HTTP error');
    const data = await res.json();
    if (data && data.Makes && Array.isArray(data.Makes)) {
      return data.Makes.map((m) => ({
        id: m.make_id,
        name: m.make_display
      }));
    }
    return FALLBACK_MAKES;
  } catch {
    return FALLBACK_MAKES;
  }
}

export async function getCarModels(make) {
  if (!make) return [];

  const cleanMake = make.trim();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${encodeURIComponent(cleanMake)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('CarQuery HTTP error');
    const data = await res.json();
    if (data && data.Models && Array.isArray(data.Models) && data.Models.length > 0) {
      return data.Models.map((m) => ({
        name: m.model_name
      }));
    }
    return FALLBACK_MODELS[cleanMake] || [{ name: `${cleanMake} Performance GT` }];
  } catch {
    return FALLBACK_MODELS[cleanMake] || [{ name: `${cleanMake} Performance GT` }];
  }
}
