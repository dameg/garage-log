export function formatCost(value: number | null) {
  if (value == null) return null;

  return value.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
