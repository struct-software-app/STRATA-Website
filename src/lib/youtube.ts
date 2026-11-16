const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

const STANDARD_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
]);

const NOCOOKIE_HOSTS = new Set([
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

const PATH_ID_PREFIXES = new Set(['embed', 'shorts', 'live', 'v']);

export function parseYouTubeId(url: string): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const segments = parsed.pathname.split('/').filter(Boolean);
  let candidate: string | null = null;

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    candidate = segments[0] ?? null;
  } else if (STANDARD_HOSTS.has(host)) {
    if (segments[0] === 'watch') {
      candidate = parsed.searchParams.get('v');
    } else if (segments[0] && PATH_ID_PREFIXES.has(segments[0])) {
      candidate = segments[1] ?? null;
    }
  } else if (NOCOOKIE_HOSTS.has(host)) {
    if (segments[0] === 'embed') {
      candidate = segments[1] ?? null;
    }
  } else {
    return null;
  }

  if (!candidate || !YOUTUBE_ID_RE.test(candidate)) {
    return null;
  }

  return candidate;
}

export function youtubeEmbedUrl(id: string, opts?: { autoplay?: boolean }): string {
  const safeId = encodeURIComponent(id);
  const autoplayParam = opts?.autoplay ? '&autoplay=1' : '';
  return `https://www.youtube-nocookie.com/embed/${safeId}?rel=0&modestbranding=1&playsinline=1${autoplayParam}`;
}

export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}
