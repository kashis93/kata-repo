/**
 * Utility to export vehicle dataset into downloadable CSV file format.
 */

export const exportVehiclesToCSV = (vehicles, filename = 'AutoLot_Inventory_Report.csv') => {
  if (!vehicles || vehicles.length === 0) {
    alert('No vehicle records to export.');
    return;
  }

  const headers = [
    'ID',
    'Make',
    'Model',
    'Year',
    'Price (USD)',
    'Quantity',
    'Body Type',
    'Fuel Type',
    'Transmission',
    'Horsepower',
    'Top Speed',
    'Mileage',
    'VIN',
    'Exterior Color',
    'Interior Color',
    'Features'
  ];

  const escapeCSVValue = (val) => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = vehicles.map((v) => [
    v.id,
    v.make,
    v.model,
    v.year,
    v.price,
    v.quantity,
    v.bodyType,
    v.fuelType,
    v.transmission,
    v.horsepower,
    v.topSpeed,
    v.mileage,
    v.vin,
    v.exteriorColor,
    v.interiorColor,
    (v.features || []).join('; ')
  ]);

  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    ...rows.map((row) => row.map(escapeCSVValue).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
