import { Vehicle } from '../types/vehicle';

export function exportVehiclesToCSV(vehicles: Vehicle[], filename = 'autolot_inventory_report.csv') {
  if (!vehicles || vehicles.length === 0) {
    alert('No vehicles available to export.');
    return;
  }

  const headers = [
    'Vehicle ID',
    'Make',
    'Model',
    'Year',
    'MSRP ($)',
    'Quantity',
    'Body Type',
    'Fuel Type',
    'Transmission',
    'Horsepower (HP)',
    'Top Speed',
    'Mileage (mi)',
    'VIN',
    'Exterior Color',
    'Interior Color',
    'Features'
  ];

  const escapeCSV = (val: string | number) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = vehicles.map((v) => [
    escapeCSV(v.id),
    escapeCSV(v.make),
    escapeCSV(v.model),
    v.year,
    v.price,
    v.quantity,
    escapeCSV(v.bodyType),
    escapeCSV(v.fuelType),
    escapeCSV(v.transmission),
    v.horsepower,
    escapeCSV(v.topSpeed),
    v.mileage,
    escapeCSV(v.vin),
    escapeCSV(v.exteriorColor),
    escapeCSV(v.interiorColor),
    escapeCSV((v.features || []).join('; '))
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
