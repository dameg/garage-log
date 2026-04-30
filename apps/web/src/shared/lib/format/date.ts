export function formatDate(value: string | null) {
  if (!value) return null;

  return new Date(value).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
