import { UNSPLASH_ACCESS_KEY, CARIMAGES_API_KEY } from './config.js';

// Sample vehicle data
const vehicles = [
  {
    id: 1,
    name: "Porsche 911 Carrera",
    make: "Porsche",
    model: "911 Carrera",
    year: 2024,
    price: 128500,
    priceDisplay: "€128,500",
    vin: "WP0AA2A9XRS222222",
    bodyType: "Coupe",
    quantity: 3,
    horsepower: "473 HP",
    fuelType: "Gasoline",
    mileage: 12000,
    features: ["Leather Seats", "Sunroof", "Navigation", "Premium Sound"],
    badge: "New"
  },
  {
    id: 2,
    name: "Audi RS6 Avant",
    make: "Audi",
    model: "RS6 Avant",
    year: 2023,
    price: 119900,
    priceDisplay: "€119,900",
    vin: "WAUZZZF21PN123456",
    bodyType: "Wagon",
    quantity: 2,
    horsepower: "591 HP",
    fuelType: "Gasoline",
    mileage: 8500,
    features: ["Quattro AWD", "Panoramic Roof", "B&O Audio"],
    badge: "Featured"
  },
  {
    id: 3,
    name: "BMW M8 Competition",
    make: "BMW",
    model: "M8 Competition",
    year: 2024,
    price: 135000,
    priceDisplay: "€135,000",
    vin: "WBSAE0C08RCH12345",
    bodyType: "Coupe",
    quantity: 1,
    horsepower: "617 HP",
    fuelType: "Gasoline",
    mileage: 5200,
    features: ["Carbon Fiber", "M Sport Exhaust", "Heated Seats"],
    badge: null
  },
  {
    id: 4,
    name: "Land Rover Defender",
    make: "Land Rover",
    model: "Defender 110",
    year: 2023,
    price: 95000,
    priceDisplay: "€95,000",
    vin: "SALWA2BK6PA123456",
    bodyType: "SUV",
    quantity: 0,
    horsepower: "395 HP",
    fuelType: "Diesel",
    mileage: 15000,
    features: ["4WD", "Off-Road Package", "Roof Rack"],
    badge: "Sold"
  },
  {
    id: 5,
    name: "Aston Martin DB11",
    make: "Aston Martin",
    model: "DB11 V12",
    year: 2024,
    price: 189000,
    priceDisplay: "€189,000",
    vin: "SCFRMFAW8KGL12345",
    bodyType: "Coupe",
    quantity: 1,
    horsepower: "630 HP",
    fuelType: "Gasoline",
    mileage: 3000,
    features: ["Handcrafted Interior", "Premium Leather", "Carbon Ceramics"],
    badge: "Premium"
  },
  {
    id: 6,
    name: "Porsche Cayenne Turbo",
    make: "Porsche",
    model: "Cayenne Turbo",
    year: 2023,
    price: 142000,
    priceDisplay: "€142,000",
    vin: "WP1AF2AY9PDA12345",
    bodyType: "SUV",
    quantity: 2,
    horsepower: "541 HP",
    fuelType: "Gasoline",
    mileage: 9800,
    features: ["Air Suspension", "Sport Chrono", "Bose Audio"],
    badge: null
  },
  {
    id: 7,
    name: "Mercedes-AMG GT",
    make: "Mercedes-Benz",
    model: "AMG GT",
    year: 2024,
    price: 115500,
    priceDisplay: "€115,500",
    vin: "W1KXJ8HB4RA123456",
    bodyType: "Coupe",
    quantity: 4,
    horsepower: "523 HP",
    fuelType: "Gasoline",
    mileage: 4500,
    features: ["AMG Ride Control", "Burmester Sound", "Ambient Lighting"],
    badge: "New"
  },
  {
    id: 8,
    name: "Bentley Continental GT",
    make: "Bentley",
    model: "Continental GT",
    year: 2023,
    price: 210000,
    priceDisplay: "€210,000",
    vin: "SCBFB63E7PC123456",
    bodyType: "Coupe",
    quantity: 1,
    horsepower: "626 HP",
    fuelType: "Gasoline",
    mileage: 2100,
    features: ["Mulliner Package", "Massage Seats", "Naim Audio"],
    badge: "Exclusive"
  }
];

// State for saved and compared vehicles
const savedVehicles = new Set();
const comparedVehicles = new Set();

// SVG Icons
const icons = {
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.5 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A2 2 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12"></path><path d="M4 14h12"></path><path d="M16 10V6l4 4v10"></path><circle cx="4" cy="12" r="2"></circle></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path><circle cx="12" cy="12" r="4"></circle></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h10v18"></path><path d="M4 8h10v13"></path><path d="M8 13l3-3-3-3"></path><path d="M4 18l3-3-3-3"></path></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg>`,
  shoppingBag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`
};

// Fetch single car image from CarImages API
async function fetchCarImageFromCarImages(make, model, year) {
  if (!CARIMAGES_API_KEY) return null;
  try {
    const response = await fetch(
      `https://www.carimagesapi.com/api/v1/images?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}&api_key=${CARIMAGES_API_KEY}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.images?.[0]?.url || null;
  } catch (error) {
    console.error(`Error fetching image for ${make} ${model} from CarImages:`, error);
    return null;
  }
}

// Fetch single car image from Unsplash
async function fetchCarImageFromUnsplash(query) {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') return null;
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.urls?.regular || null;
  } catch (error) {
    console.error(`Error fetching image for "${query}" from Unsplash:`, error);
    return null;
  }
}

// Fetch all car images with fallback chain: CarImages -> Unsplash -> Picsum
async function fetchCarImages() {
  const vehiclesWithImages = [];
  for (const vehicle of vehicles) {
    let imageUrl = null;

    imageUrl = await fetchCarImageFromCarImages(vehicle.make, vehicle.model, vehicle.year);

    if (!imageUrl) {
      imageUrl = await fetchCarImageFromUnsplash(`${vehicle.make} ${vehicle.model}`);
    }

    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/${vehicle.id}-${vehicle.make}-${vehicle.model}/800/600`;
    }

    vehiclesWithImages.push({ ...vehicle, image: imageUrl });
  }
  return vehiclesWithImages;
}

// Fetch hero image
async function fetchHeroImage() {
  const heroCarImg = document.getElementById('heroCar');
  if (!heroCarImg) return;

  let imageUrl = null;

  imageUrl = await fetchCarImageFromCarImages('Porsche', '911', 2024);

  if (!imageUrl) {
    imageUrl = await fetchCarImageFromUnsplash('luxury sports car porsche 911');
  }

  if (!imageUrl) {
    imageUrl = 'https://picsum.photos/seed/autolot-hero/1200/700';
  }

  heroCarImg.src = imageUrl;
}

// Render single vehicle card
function renderVehicleCard(vehicle) {
  const isSaved = savedVehicles.has(vehicle.id);
  const isCompared = comparedVehicles.has(vehicle.id);
  const isOutOfStock = vehicle.quantity === 0;

  return `
    <div class="vehicle-card" data-vehicle-id="${vehicle.id}">
      <div class="vehicle-media" onclick="openVehicleDetails(${vehicle.id})">
        <div class="vehicle-media-loading" id="loading-${vehicle.id}">
          <div class="vehicle-media-loading-icon">
            ${icons.car}
          </div>
          <span class="vehicle-media-loading-text">Loading High-Res Image...</span>
        </div>

        <img 
          src="${vehicle.image}" 
          alt="${vehicle.name}" 
          loading="lazy" 
          onload="document.getElementById('loading-${vehicle.id}').style.display='none'; this.style.opacity='1';"
          onerror="handleImageError(${vehicle.id})"
          style="opacity: 0; transition: opacity 0.3s ease;"
        />

        <div class="vehicle-top-right-actions">
          <button 
            class="vehicle-action-btn vehicle-action-btn-save ${isSaved ? 'active' : ''}" 
            onclick="event.stopPropagation(); toggleSave(${vehicle.id})"
            title="${isSaved ? 'Remove from Favorites' : 'Save to Favorites'}"
          >
            ${icons.heart}
          </button>
          <button 
            class="vehicle-action-btn vehicle-action-btn-compare ${isCompared ? 'active' : ''}" 
            onclick="event.stopPropagation(); toggleCompare(${vehicle.id})"
            title="${isCompared ? 'Remove from Comparison' : 'Add to Compare'}"
          >
            ${icons.compare}
          </button>
        </div>

        <div class="vehicle-top-left-badges">
          <span class="vehicle-badge ${isOutOfStock ? 'vehicle-badge-sold' : 'vehicle-badge-in-stock'}">
            ${isOutOfStock ? icons.alert : icons.check}
            ${isOutOfStock ? 'SOLD OUT' : `${vehicle.quantity} IN STOCK`}
          </span>
          <span class="vehicle-badge vehicle-badge-body-type">
            ${vehicle.bodyType}
          </span>
        </div>

        <button 
          class="vehicle-3d-btn" 
          onclick="event.stopPropagation(); inspect3D(${vehicle.id})"
        >
          ${icons.eye}
          <span>View Details</span>
        </button>
      </div>

      <div class="vehicle-body">
        <div>
          <div class="vehicle-header-make-year">
            <span class="vehicle-make">${vehicle.make}</span>
            <span class="vehicle-year">${vehicle.year} MODEL</span>
          </div>

          <h3 class="vehicle-name" onclick="openVehicleDetails(${vehicle.id})">
            ${vehicle.model}
          </h3>

          <div class="vehicle-pricing-box">
            <div>
              <span class="vehicle-price-label">Total MSRP</span>
              <span class="vehicle-price">${vehicle.priceDisplay}</span>
            </div>
            <div>
              <span class="vehicle-finance-label">Est. Finance</span>
              <span class="vehicle-finance-price">€${Math.round(vehicle.price / 60).toLocaleString()}/mo*</span>
            </div>
          </div>

          <div class="vehicle-spec-grid">
            <div class="vehicle-spec-item">
              ${icons.zap}
              <span class="vehicle-spec-text">${vehicle.horsepower}</span>
            </div>
            <div class="vehicle-spec-item">
              ${icons.fuel}
              <span class="vehicle-spec-text">${vehicle.fuelType}</span>
            </div>
            <div class="vehicle-spec-item">
              ${icons.gauge}
              <span class="vehicle-spec-text">${vehicle.mileage.toLocaleString()} mi</span>
            </div>
          </div>

          ${vehicle.features && vehicle.features.length > 0 ? `
            <div class="vehicle-features">
              ${vehicle.features.slice(0, 2).map(feature => `<span class="vehicle-feature-tag">${feature}</span>`).join('')}
              ${vehicle.features.length > 2 ? `<span class="vehicle-features-more">+${vehicle.features.length - 2} more</span>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="vehicle-bottom-actions">
          <button 
            class="vehicle-reserve-btn ${isOutOfStock ? 'vehicle-reserve-btn-disabled' : 'vehicle-reserve-btn-active'}"
            onclick="purchaseVehicle(${vehicle.id})"
            ${isOutOfStock ? 'disabled' : ''}
          >
            ${icons.shoppingBag}
            <span class="vehicle-reserve-btn-text">${isOutOfStock ? 'SOLD OUT' : 'RESERVE VEHICLE'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render vehicles to grid
async function renderVehicles() {
  const grid = document.getElementById('vehicleGrid');
  if (!grid) return;

  grid.innerHTML = '<p style="text-align:center; padding: 2rem;">Loading inventory...</p>';

  const vehiclesWithImages = await fetchCarImages();

  grid.innerHTML = vehiclesWithImages.map(renderVehicleCard).join('');
}

// Mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

// Toggle save vehicle
window.toggleSave = function(vehicleId) {
  if (savedVehicles.has(vehicleId)) {
    savedVehicles.delete(vehicleId);
  } else {
    savedVehicles.add(vehicleId);
  }
  renderVehicles();
};

// Toggle compare vehicle
window.toggleCompare = function(vehicleId) {
  if (comparedVehicles.has(vehicleId)) {
    comparedVehicles.delete(vehicleId);
  } else {
    comparedVehicles.add(vehicleId);
  }
  renderVehicles();
};

// Open vehicle details
window.openVehicleDetails = function(vehicleId) {
  console.log('Open details for vehicle:', vehicleId);
};

// Inspect 3D
window.inspect3D = function(vehicleId) {
  console.log('Open 3D inspection for vehicle:', vehicleId);
};

// Purchase vehicle
window.purchaseVehicle = function(vehicleId) {
  console.log('Purchase vehicle:', vehicleId);
};

// Handle image error
window.handleImageError = function(vehicleId) {
  const loadingDiv = document.getElementById(`loading-${vehicleId}`);
  const vehicle = vehicles.find(v => v.id === vehicleId);
  if (loadingDiv && vehicle) {
    loadingDiv.innerHTML = `
      <div class="vehicle-media-fallback-icon" style="margin-bottom: 0.5rem;">
        ${icons.car}
      </div>
      <span class="vehicle-media-fallback-title">AutoLot Visual Archive</span>
      <span class="vehicle-media-fallback-subtitle">${vehicle.make} ${vehicle.model}</span>
    `;
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchHeroImage();
  renderVehicles();
  setupMobileMenu();
});
