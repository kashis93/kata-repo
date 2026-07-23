import { Vehicle, PurchaseOrder } from '../types/vehicle';
import { INITIAL_VEHICLES } from '../data/initialVehicles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const LOCAL_STORAGE_KEY = 'autolot_vehicles_v2';
const PURCHASES_STORAGE_KEY = 'autolot_purchases_v2';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('autolot_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};

export const api = {
  getVehicles: async (): Promise<Vehicle[]> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/vehicles`);
      if (response.ok) {
        const backendList = await response.json();
        if (backendList && backendList.length > 0) {
          return backendList.map((bv: any) => {
            const match = INITIAL_VEHICLES.find(
              (v) => v.make.toLowerCase() === bv.make.toLowerCase() && v.model.toLowerCase() === bv.model.toLowerCase()
            );
            return {
              ...(match || INITIAL_VEHICLES[0]),
              id: String(bv.id),
              make: bv.make,
              model: bv.model,
              price: Number(bv.price),
              quantity: Number(bv.quantity),
              bodyType: bv.category || match?.bodyType || 'Sedan'
            };
          });
        }
      }
    } catch {
      // Backend offline fallback
    }

    // Local storage / Initial Vehicles fallback
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
        return INITIAL_VEHICLES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_VEHICLES;
    }
  },

  addVehicle: async (vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        body: JSON.stringify({
          make: vehicleData.make,
          model: vehicleData.model,
          category: vehicleData.bodyType || 'Sedan',
          price: Number(vehicleData.price),
          quantity: Number(vehicleData.quantity)
        })
      });
      if (response.ok) {
        const created = await response.json();
        const fullVehicle: Vehicle = {
          ...vehicleData,
          id: String(created.id),
          make: created.make,
          model: created.model,
          price: Number(created.price),
          quantity: Number(created.quantity)
        };
        return fullVehicle;
      }
    } catch {
      // Backend offline
    }

    // Local fallback
    const current = await api.getVehicles();
    const newId = `veh-${Date.now().toString(36)}`;
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: newId,
      vin: vehicleData.vin || `1FA6P${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    const updated = [newVehicle, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newVehicle;
  },

  updateVehicle: async (vehicle: Vehicle): Promise<Vehicle> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${vehicle.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          make: vehicle.make,
          model: vehicle.model,
          category: vehicle.bodyType || 'Sedan',
          price: Number(vehicle.price),
          quantity: Number(vehicle.quantity)
        })
      });
      if (response.ok) {
        return vehicle;
      }
    } catch {
      // Backend offline
    }

    const current = await api.getVehicles();
    const updated = current.map((v) => (v.id === vehicle.id ? vehicle : v));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return vehicle;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE'
      });
    } catch {
      // Backend offline
    }

    const current = await api.getVehicles();
    const updated = current.filter((v) => v.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  purchaseVehicle: async (
    id: string,
    buyer: { name: string; email: string; phone: string; paymentMethod: 'Financing' | 'Cash / Wire Transfer' | 'Crypto' }
  ): Promise<{ success: boolean; message: string; order?: PurchaseOrder }> => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/vehicles/${id}/purchase?quantity=1`, {
        method: 'POST'
      });
    } catch {
      // Backend offline
    }

    const current = await api.getVehicles();
    const vehicle = current.find((v) => v.id === id);

    if (!vehicle) {
      return { success: false, message: 'Vehicle not found in inventory.' };
    }

    if (vehicle.quantity <= 0) {
      return { success: false, message: 'This vehicle is currently out of stock.' };
    }

    // Decrement quantity locally
    const updatedVehicle = { ...vehicle, quantity: vehicle.quantity - 1 };
    const updatedVehicles = current.map((v) => (v.id === id ? updatedVehicle : v));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedVehicles));

    const order: PurchaseOrder = {
      id: `ord-${Date.now().toString(36)}`,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehiclePrice: vehicle.price,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      paymentMethod: buyer.paymentMethod,
      timestamp: new Date().toISOString(),
      vin: vehicle.vin
    };

    try {
      const existingPurchases: PurchaseOrder[] = JSON.parse(localStorage.getItem(PURCHASES_STORAGE_KEY) || '[]');
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify([order, ...existingPurchases]));
    } catch {
      // Ignore
    }

    return {
      success: true,
      message: `Congratulations! Your purchase reservation for ${vehicle.year} ${vehicle.make} ${vehicle.model} has been confirmed.`,
      order
    };
  },

  getPurchases: (): PurchaseOrder[] => {
    try {
      return JSON.parse(localStorage.getItem(PURCHASES_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  resetVehicles: async (): Promise<Vehicle[]> => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
    return INITIAL_VEHICLES;
  }
};
