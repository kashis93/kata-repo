import { INITIAL_VEHICLES } from '../data/initialVehicles';
import { getVehicleImage } from './carImageService.js';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const CUSTOM_SPECS_KEY = 'autolot_custom_specs_v1';
const PURCHASES_KEY = 'autolot_purchases_v1';

// Helper to get custom specs dictionary
const getCustomSpecs = () => {
  try {
    const data = localStorage.getItem(CUSTOM_SPECS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

// Helper to save custom specs dictionary
const saveCustomSpecs = (specs) => {
  try {
    localStorage.setItem(CUSTOM_SPECS_KEY, JSON.stringify(specs));
  } catch (e) {
    console.error('Failed to save custom specs', e);
  }
};

// Mapper: Merges backend vehicle with rich assets
const mapBackendVehicleToFrontend = (backendVehicle) => {
  const customSpecs = getCustomSpecs();
  const custom = customSpecs[backendVehicle.id];

  const realImgUrl = getVehicleImage(
    backendVehicle.make,
    backendVehicle.model,
    custom?.imageUrl
  );

  if (custom) {
    return {
      ...custom,
      id: backendVehicle.id,
      make: backendVehicle.make,
      model: backendVehicle.model,
      price: Number(backendVehicle.price),
      quantity: backendVehicle.quantity,
      imageUrl: realImgUrl,
      bodyType: backendVehicle.category || custom.bodyType || 'Sedan'
    };
  }

  // Find match in INITIAL_VEHICLES by make and model
  const match = INITIAL_VEHICLES.find(
    (v) =>
      v.make.toLowerCase() === backendVehicle.make.toLowerCase() &&
      v.model.toLowerCase() === backendVehicle.model.toLowerCase()
  );

  if (match) {
    return {
      ...match,
      id: backendVehicle.id,
      make: backendVehicle.make,
      model: backendVehicle.model,
      price: Number(backendVehicle.price),
      quantity: backendVehicle.quantity,
      imageUrl: realImgUrl,
      bodyType: backendVehicle.category || match.bodyType || 'Sedan'
    };
  }

  // Generate realistic default details for completely new/unrecognized cars
  const bodyType = backendVehicle.category || 'Sedan';
  const fuelType = bodyType === 'Electric' ? 'Electric' : 'Gasoline';
  const generated = {
    id: backendVehicle.id,
    make: backendVehicle.make,
    model: backendVehicle.model,
    year: 2025,
    price: Number(backendVehicle.price),
    quantity: backendVehicle.quantity,
    imageUrl: realImgUrl,
    bodyType: bodyType,
    fuelType: fuelType,
    transmission: bodyType === 'Electric' ? 'Direct Drive' : 'Automatic',
    mileage: 15,
    vin: `WP0AB2A9${Math.floor(100000 + Math.random() * 900000)}`,
    exteriorColor: 'Obsidian Black Metallic',
    interiorColor: 'Nappa Black Leather',
    horsepower: bodyType === 'Electric' ? 480 : 310,
    topSpeed: '155 mph',
    features: ['Premium Comfort Package', 'Connected Drive', 'Surround Cameras', 'Driver Assistance'],
    description: `A elegant, state-of-the-art ${backendVehicle.make} ${backendVehicle.model} displaying exceptional craftsmanship and luxury.`
  };

  // Save the generated specs so they persist next time
  const specs = getCustomSpecs();
  specs[backendVehicle.id] = generated;
  saveCustomSpecs(specs);

  return generated;
};

// Helper for fetching with token
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('autolot_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    // Session expired
    localStorage.removeItem('autolot_token');
    window.location.hash = '#/login';
  }
  return response;
};

export const api = {
  getVehicles: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/vehicles`);
      if (!response.ok) throw new Error('Failed to fetch vehicles from backend');
      const backendList = await response.json();
      const mappedBackend = backendList.map(mapBackendVehicleToFrontend);

      // Merge backend items with initial vehicles to display a full fleet of 12+ products
      const backendKeys = new Set(mappedBackend.map(b => `${b.make}_${b.model}`.toLowerCase()));
      const extraVehicles = INITIAL_VEHICLES.filter(v => !backendKeys.has(`${v.make}_${v.model}`.toLowerCase()));

      return [...mappedBackend, ...extraVehicles];
    } catch (e) {
      console.warn('Backend API offline/unreachable, using curated initial fleet fallback:', e.message);
      return INITIAL_VEHICLES;
    }
  },

  addVehicle: async (vehicleData) => {
    const payload = {
      make: vehicleData.make,
      model: vehicleData.model,
      category: vehicleData.bodyType || 'Sedan',
      price: Number(vehicleData.price),
      quantity: Number(vehicleData.quantity)
    };

    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to add vehicle to backend database');
    }

    const created = await response.json();

    // Store custom visual specs locally
    const customSpecs = getCustomSpecs();
    customSpecs[created.id] = {
      id: created.id,
      make: created.make,
      model: created.model,
      year: vehicleData.year || 2025,
      price: Number(created.price),
      quantity: created.quantity,
      imageUrl: vehicleData.imageUrl || '',
      bodyType: vehicleData.bodyType || 'Sedan',
      fuelType: vehicleData.fuelType || 'Gasoline',
      transmission: vehicleData.transmission || 'Automatic',
      mileage: vehicleData.mileage || 15,
      vin: vehicleData.vin || `WP0AB2A9${Math.floor(100000 + Math.random() * 900000)}`,
      exteriorColor: vehicleData.exteriorColor || 'Obsidian Black Metallic',
      interiorColor: vehicleData.interiorColor || 'Nappa Black Leather',
      horsepower: vehicleData.horsepower || 300,
      topSpeed: vehicleData.topSpeed || '155 mph',
      features: vehicleData.features || [],
      description: vehicleData.description || `A premium ${created.make} ${created.model} in pristine condition.`
    };
    saveCustomSpecs(customSpecs);

    return mapBackendVehicleToFrontend(created);
  },

  updateVehicle: async (updatedVehicle) => {
    const payload = {
      make: updatedVehicle.make,
      model: updatedVehicle.model,
      category: updatedVehicle.bodyType || 'Sedan',
      price: Number(updatedVehicle.price),
      quantity: Number(updatedVehicle.quantity)
    };

    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${updatedVehicle.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to update vehicle on backend database');
    }

    const updated = await response.json();

    // Update custom visual specs locally
    const customSpecs = getCustomSpecs();
    customSpecs[updated.id] = {
      ...(customSpecs[updated.id] || {}),
      make: updated.make,
      model: updated.model,
      year: updatedVehicle.year || 2025,
      price: Number(updated.price),
      quantity: updated.quantity,
      imageUrl: updatedVehicle.imageUrl || '',
      bodyType: updatedVehicle.bodyType || 'Sedan',
      fuelType: updatedVehicle.fuelType || 'Gasoline',
      transmission: updatedVehicle.transmission || 'Automatic',
      mileage: updatedVehicle.mileage || 15,
      vin: updatedVehicle.vin || `WP0AB2A9${Math.floor(100000 + Math.random() * 900000)}`,
      exteriorColor: updatedVehicle.exteriorColor || 'Obsidian Black Metallic',
      interiorColor: updatedVehicle.interiorColor || 'Nappa Black Leather',
      horsepower: updatedVehicle.horsepower || 300,
      topSpeed: updatedVehicle.topSpeed || '155 mph',
      features: updatedVehicle.features || [],
      description: updatedVehicle.description || `A premium ${updated.make} ${updated.model} in pristine condition.`
    };
    saveCustomSpecs(customSpecs);

    return mapBackendVehicleToFrontend(updated);
  },

  deleteVehicle: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to delete vehicle from backend database');
    }

    // Clean up local custom specs
    const customSpecs = getCustomSpecs();
    delete customSpecs[id];
    saveCustomSpecs(customSpecs);
  },

  recordPurchase: async (vehicleId, customerName, customerEmail, customerPhone) => {
    let vehicleName = 'Luxury Vehicle';
    let price = 100000;

    try {
      // 1. Send the purchase order to backend to decrement quantity
      const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${vehicleId}/purchase?quantity=1`, {
        method: 'POST'
      });

      if (response.ok) {
        const updatedVehicle = await response.json();
        vehicleName = `${updatedVehicle.make} ${updatedVehicle.model}`;
        price = Number(updatedVehicle.price);
      }
    } catch (e) {
      console.warn('Backend purchase call skipped/fallback:', e);
    }

    // 2. Save the customer order detail locally for the Orders Log
    const purchase = {
      id: `ord_${Date.now()}`,
      vehicleId,
      vehicleName,
      price,
      customerName,
      customerEmail,
      customerPhone,
      timestamp: new Date().toISOString()
    };

    const purchases = api.getPurchases();
    purchases.unshift(purchase);
    try {
      localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
    } catch (e) {
      console.error('Failed to save purchase history', e);
    }

    return purchase;
  },

  getPurchases: () => {
    try {
      const data = localStorage.getItem(PURCHASES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  resetVehicles: () => {
    // No-op or fetch vehicles, because backend fleet is managed on database side.
    console.log('Database fleet reset must be initiated via scripts.seed_db');
  }
};
