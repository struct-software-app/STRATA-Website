import type { UserProfile } from '../context/DataContext';
import { resolveAssetUrl } from './url';

const CHARACTER_IMAGE_KEYS = [
  'image',
  'imageUrl',
  'image_url',
  'url',
  'src',
  'avatar',
  'picture',
] as const;

function pickString(record: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const val = record[key];
    if (typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  }
  return '';
}

function extractCharacterImage(character: unknown): string {
  if (!character) return '';

  if (typeof character === 'string') {
    const trimmed = character.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('{')) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return pickString(parsed as Record<string, unknown>, CHARACTER_IMAGE_KEYS);
        }
      } catch {
        return '';
      }
      return '';
    }
    return trimmed;
  }

  if (typeof character === 'object' && !Array.isArray(character)) {
    return pickString(character as Record<string, unknown>, CHARACTER_IMAGE_KEYS);
  }

  return '';
}

export function getProfileAvatar(profile?: UserProfile | null, user?: any): string {
  if (profile) {
    const rawProfile = profile as unknown as Record<string, unknown>;
    const direct = pickString(rawProfile, ['avatar', 'avatar_url', 'avatarUrl', 'picture']);
    if (direct) return resolveAssetUrl(direct);

    const charImg = extractCharacterImage(rawProfile.character);
    if (charImg) return resolveAssetUrl(charImg);
  }

  const meta = user?.user_metadata;
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    const metaImg = pickString(meta as Record<string, unknown>, ['avatar_url', 'picture']);
    if (metaImg) return resolveAssetUrl(metaImg);
  }

  return '';
}

export function getInitials(profile?: UserProfile | null, user?: any): string {
  const first = typeof profile?.firstName === 'string' ? profile.firstName.trim() : '';
  const second = typeof profile?.secondName === 'string' ? profile.secondName.trim() : '';
  if (first) {
    return `${first[0]}${second ? second[0] : ''}`.toUpperCase();
  }

  const handle =
    (typeof profile?.username === 'string' ? profile.username.trim() : '') ||
    (typeof profile?.email === 'string' ? profile.email.trim() : '') ||
    (typeof user?.email === 'string' ? user.email.trim() : '');
  if (handle) {
    return handle.slice(0, 2).toUpperCase();
  }

  return 'ST';
}
