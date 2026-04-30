export function formatCost(value: number | null) {
  if (value == null) return '-';

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
