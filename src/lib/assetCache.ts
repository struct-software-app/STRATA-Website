import type { HeroBannerItem } from '../context/DataContext';

const ASSET_CACHE_KEY = 'strata.assets.v1';
const MAX_CACHE_CHARS = 200000;

export interface AssetBranding {
  storeIcon: string;
  storeNameLogo: string;
  loginBanner: string;
  storeHeroBanner: string;
  loginIcon: string;
  loginNameLogo: string;
  storeLoadingPage: string;
}

export interface AssetCacheData {
  branding: AssetBranding;
  categoryLogos: Record<string, string>;
  appLogos: Record<string, string>;
  heroBanners: HeroBannerItem[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function readAssetCache(): AssetCacheData | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(ASSET_CACHE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;

    const { branding, categoryLogos, appLogos, heroBanners } = parsed;
    if (!isRecord(branding) || !isRecord(categoryLogos) || !isRecord(appLogos) || !Array.isArray(heroBanners)) {
      return null;
    }

    return {
      branding: branding as unknown as AssetBranding,
      categoryLogos: categoryLogos as Record<string, string>,
      appLogos: appLogos as Record<string, string>,
      heroBanners: heroBanners as HeroBannerItem[],
    };
  } catch {
    return null;
  }
}

export function writeAssetCache(data: AssetCacheData): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const payload: AssetCacheData = {
      branding: data.branding,
      categoryLogos: data.categoryLogos,
      appLogos: data.appLogos,
      heroBanners: data.heroBanners,
    };
    const serialized = JSON.stringify(payload);
    if (serialized.length < MAX_CACHE_CHARS) {
      window.localStorage.setItem(ASSET_CACHE_KEY, serialized);
    }
  } catch {
    // Ignore storage unavailability or quota errors
  }
}
