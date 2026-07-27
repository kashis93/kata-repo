/**
 * Exports an array of vehicle objects to a CSV file download.
 * @param {Array} vehicles Array of vehicle objects to export
 * @param {string} filename Optional custom filename
 */
export const exportVehiclesToCSV = (vehicles, filename = 'AutoLot_Inventory.csv') => {
  if (!vehicles || vehicles.length === 0) {
    alert('No vehicle data available to export.');
    return;
  }

  const headers = [
    'ID',
    'Make',
    'Model',
    'Year',
    'Price (INR)',
    'Quantity',
    'Body Type',
    'Fuel Type',
    'Transmission',
    'Horsepower',
    'Top Speed',
    'Mileage',
    'VIN',
    'Exterior Color',
    'Interior Color'
  ];

  const rows = vehicles.map((v) => [
    v.id || '',
    `"${(v.make || '').replace(/"/g, '""')}"`,
    `"${(v.model || '').replace(/"/g, '""')}"`,
    v.year || '',
    v.price || 0,
    v.quantity ?? 1,
    `"${(v.bodyType || '').replace(/"/g, '""')}"`,
    `"${(v.fuelType || '').replace(/"/g, '""')}"`,
    `"${(v.transmission || '').replace(/"/g, '""')}"`,
    v.horsepower || 0,
    `"${(v.topSpeed || '').replace(/"/g, '""')}"`,
    v.mileage || 0,
    `"${(v.vin || '').replace(/"/g, '""')}"`,
    `"${(v.exteriorColor || '').replace(/"/g, '""')}"`,
    `"${(v.interiorColor || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
