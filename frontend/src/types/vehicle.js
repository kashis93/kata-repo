/**
 * Vehicle Data Types & Constants in JavaScript
 */

/**
 * @typedef {('Coupe'|'Sedan'|'SUV'|'Convertible'|'Electric'|'Truck')} BodyType
 * @typedef {('Gasoline'|'Electric'|'Hybrid'|'Twin-Turbo V8')} FuelType
 * @typedef {('Automatic'|'Manual'|'PDK Dual-Clutch'|'Direct Drive')} TransmissionType
 */

/**
 * Sample Car Preset object structure for Quick Fill
 * @typedef {Object} SampleCarPreset
 * @property {string} make
 * @property {string} model
 * @property {string} imageUrl
 * @property {BodyType} bodyType
 * @property {FuelType} fuelType
 * @property {number} horsepower
 * @property {number} suggestedPrice
 */

/**
 * Vehicle Record object structure
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} make
 * @property {string} model
 * @property {number} year
 * @property {number} price
 * @property {number} quantity
 * @property {string} imageUrl
 * @property {BodyType} bodyType
 * @property {FuelType} fuelType
 * @property {TransmissionType} transmission
 * @property {number} mileage
 * @property {string} vin
 * @property {string} exteriorColor
 * @property {string} interiorColor
 * @property {number} horsepower
 * @property {string} topSpeed
 * @property {string[]} features
 * @property {string} description
 */

/**
 * Purchase Record object structure
 * @typedef {Object} PurchaseRecord
 * @property {string} id
 * @property {string} vehicleId
 * @property {string} vehicleName
 * @property {number} price
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {string} customerPhone
 * @property {string} timestamp
 */

/**
 * Filter State object structure
 * @typedef {Object} FilterState
 * @property {string} searchQuery
 * @property {string} make
 * @property {string} bodyType
 * @property {string} fuelType
 * @property {number} minPrice
 * @property {number} maxPrice
 * @property {boolean} inStockOnly
 * @property {('price-asc'|'price-desc'|'year-desc'|'power-desc'|'mileage-asc')} sortBy
 */
