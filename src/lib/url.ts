export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (import.meta.env.DEV && (url.includes('localhost:') || url.includes('127.0.0.1:'))) {
    return url.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
  }
  return url;
}
