export function formatDate(value: string | null) {
  if (!value) return '-';

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
