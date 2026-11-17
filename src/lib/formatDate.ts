export function formatReleaseDate(iso?: string | null): string {
  if (!iso || typeof iso !== 'string') return '';
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return '';
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
