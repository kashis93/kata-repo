// Currency and formatting helper utilities for Indian Rupees (INR - ₹)

export function formatINR(price) {
  if (price === undefined || price === null || isNaN(price)) return '₹0';
  const num = Number(price);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  } catch (e) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
}

export function formatINRLakhCrore(price) {
  if (price === undefined || price === null || isNaN(price)) return '₹0';
  const num = Number(price);
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr.endsWith('.00') ? cr.slice(0, -3) : cr} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2);
    return `₹${lakh.endsWith('.00') ? lakh.slice(0, -3) : lakh} Lakh`;
  }
  return formatINR(num);
}
