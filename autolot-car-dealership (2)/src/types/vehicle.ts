export type BodyType = 'Coupe' | 'Sedan' | 'SUV' | 'Convertible' | 'Electric' | 'Truck';
export type FuelType = 'Gasoline' | 'Electric' | 'Hybrid' | 'Twin-Turbo V8';
export type TransmissionType = 'Automatic' | 'Manual' | 'PDK Dual-Clutch' | 'Direct Drive';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
  imageUrl?: string;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: TransmissionType;
  mileage: number;
  vin: string;
  exteriorColor: string;
  interiorColor: string;
  horsepower: number;
  topSpeed: string;
  features: string[];
  description: string;
  featured?: boolean;
}

export interface FilterState {
  searchQuery: string;
  make: string;
  bodyType: string;
  fuelType: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc' | 'power-desc';
}

export interface PurchaseOrder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePrice: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: 'Financing' | 'Cash / Wire Transfer' | 'Crypto';
  timestamp: string;
  vin: string;
}

export interface SampleCarPreset {
  make: string;
  model: string;
  imageUrl: string;
  bodyType: BodyType;
  fuelType: FuelType;
  horsepower: number;
  suggestedPrice: number;
}
