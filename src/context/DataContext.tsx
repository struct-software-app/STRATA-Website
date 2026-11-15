import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CATEGORIES, APPS, PRICING_PLANS, CategoryItem, AppItem } from '../data/apps';


export interface LiveAppItem extends AppItem {
  trailerUrl?: string;
  trailerThumbnail?: string;
  banner?: string;
  rating?: number;
  downloadUrl?: string;
  screenshots?: string[];
}

export interface BundleItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  banner: string;
  logo: string;
  programIds: string[];
  description: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  secondName?: string;
  email: string;
  birthdate?: string;
  avatar?: string;
  character?: any;
  role?: string;
}

export interface PurchaseItem {
  id: number;
  user_id: string;
  program_id?: string;
  bundle_id?: string;
  tokens_paid: number;
  purchased_at: string;
}

export interface HeroBannerItem {
  id: string;
  title: string;
  paragraph?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  sort_order?: number;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  annualPrice?: number;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  popular: boolean;
  highlight: boolean;
  badge?: string;
  sort_order?: number;
}

export interface PricingMatrixItem {
  id: number;
  feature: string;
  single?: string | boolean;
  bundle?: string | boolean;
  full?: string | boolean;
  values?: Record<string, string | boolean>;
  sort_order?: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order?: number;
}

interface DataContextType {
  categories: CategoryItem[];
  apps: LiveAppItem[];
  bundles: BundleItem[];
  heroBanners: HeroBannerItem[];
  pricingPlans: PricingPlanItem[];
  pricingMatrix: PricingMatrixItem[];
  faqs: FaqItem[];
  categoryLogos: Record<string, string>;

  appLogos: Record<string, string>;
  branding: {
    storeIcon: string;
    storeNameLogo: string;
    loginBanner: string;
    storeHeroBanner: string;
    loginIcon: string;
    loginNameLogo: string;
    storeLoadingPage: string;
  };
  websiteInfo: {
    version: string;
    build_shell: string;
    engines: string;
    license: string;
    description: string;
    about_title: string;
    about_description: string;
    mission_title: string;
    mission_subtitle: string;
    mission_box_title: string;
    mission_box_text: string;
    about_p1: string;
    about_p2: string;
    about_p3: string;
    stats_calculation_engines_label?: string;
    stats_calculation_engines_sub?: string;
    stats_civil_disciplines_label?: string;
    stats_civil_disciplines_sub?: string;
    stats_solver_latency_label?: string;
    stats_solver_latency_value?: string;
    stats_solver_latency_sub?: string;
    stats_cloud_dependency_label?: string;
    stats_cloud_dependency_value?: string;
    stats_cloud_dependency_sub?: string;
    support_email?: string;
    licensing_email?: string;
    support_phone?: string;
    company_legal_name?: string;
    office_address_line1?: string;
    office_address_line2?: string;
    default_trial_key_template?: string;
    copyright_text?: string;
    footer_tagline?: string;
    download_win_filename?: string;
    download_win_url?: string;
    download_win_size?: string;
    download_mac_filename?: string;
    download_mac_url?: string;
    download_mac_size?: string;
    download_linux_filename?: string;
    download_linux_url?: string;
    download_linux_size?: string;
  };

  loading: boolean;
  user: any | null;
  profile: UserProfile | null;
  walletTokens: number;
  purchases: PurchaseItem[];
  isOwned: (programIdOrBundleId: string) => boolean;
  purchaseItem: (programId?: string, bundleId?: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  formatTokens: (tokens: number) => string;
  getAppBySlug: (slug: string) => LiveAppItem | undefined;
  getCategoryBySlug: (slug: string) => CategoryItem | undefined;
  getBundleByCategoryId: (categoryIdOrSlug: string) => BundleItem | undefined;
}

const defaultBranding = {
  storeIcon: '',
  storeNameLogo: '',
  loginBanner: '',
  storeHeroBanner: '',
  loginIcon: '',
  loginNameLogo: '',
  storeLoadingPage: '',
};

const defaultWebsiteInfo = {
  version: '2.4.0-PRO',
  build_shell: 'Electron x64',
  engines: '35 Verified',
  license: 'Commercial ASD/LRFD',
  description: 'A formal, standalone suite of 35 engineering calculation engines spanning 7 civil disciplines. Engineered for rigorous design office verification, infrastructure modeling, and 100% offline desktop productivity.',
  about_title: 'Engineered for Civil Rigor',
  about_description: 'STRATA was founded with a singular purpose: to deliver uncompromising, deterministic software tools that civil engineering practitioners can rely on for critical infrastructure calculations.',
  mission_title: 'Our Core Mission',
  mission_subtitle: 'Replacing Opaque Black Boxes With Transparent Code',
  mission_box_title: 'Principle 01: Verifiability',
  mission_box_text: 'Every output equation generated by STRATA provides step-by-step intermediate formulations and explicit clause citations from governing standards.',
  about_p1: 'In modern civil and structural engineering consultancies, teams often struggle between two extremes: complex multi-thousand-dollar finite element packages with steep learning curves, and fragile, unverified in-house Excel spreadsheets prone to calculation errors and broken macros.',
  about_p2: 'STRATA bridges this gap by providing an integrated catalog of 35 dedicated desktop calculation engines. Each tool is developed to execute focused design checks—such as footing punching shear, slope stability slice methods, open channel Manning flows, or asphalt pavement ESAL sizing—in seconds, without cloud lock-in.',
  about_p3: 'All calculation logic is strictly audited against international engineering standards (ACI, AISC, Eurocode, AASHTO, ASTM, EPA, and AWWA).',
  support_email: 'support@stratasuite.com',
  licensing_email: 'licensing@stratasuite.com',
  support_phone: '+1 (800) 555-STRATA [7872]',
  company_legal_name: 'STRATA Engineering Software Inc.',
  office_address_line1: '100 Engineering Plaza, Suite 400',
  office_address_line2: 'San Francisco, CA 94105, USA',
  default_trial_key_template: 'STRATA-TRIAL-35TOOLS-X749-8821-EVAL',
  copyright_text: 'STRATA Technologies Inc. All rights reserved.',
  footer_tagline: 'Deterministic Computation Standard',
  download_win_filename: 'STRATA_Suite_Setup_v2.4.0.exe',
  download_win_url: '',
  download_win_size: '142 MB',
  download_mac_filename: 'STRATA_Suite_v2.4.0.dmg',
  download_mac_url: '',
  download_mac_size: '158 MB',
  download_linux_filename: 'STRATA_Suite_v2.4.0.AppImage',
  download_linux_url: '',
  download_linux_size: '136 MB',
};

export const formatTokenNumber = (num: number): string => {
  if (!num && num !== 0) return '0';
  if (num >= 1_000_000) {
    const val = (num / 1_000_000).toFixed(1);
    return `${val.endsWith('.0') ? val.slice(0, -2) : val}M`;
  }
  if (num >= 1_000) {
    const val = (num / 1_000).toFixed(1);
    return `${val.endsWith('.0') ? val.slice(0, -2) : val}K`;
  }
  return num.toLocaleString();
};

const DataContext = createContext<DataContextType>({

  categories: CATEGORIES,
  apps: APPS,
  bundles: [],
  heroBanners: [],
  pricingPlans: PRICING_PLANS as any,
  pricingMatrix: [],
  faqs: [],
  categoryLogos: {},

  appLogos: {},

  branding: defaultBranding,
  websiteInfo: defaultWebsiteInfo,
  loading: true,
  user: null,
  profile: null,
  walletTokens: 0,
  purchases: [],
  isOwned: () => false,
  purchaseItem: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
  signOut: async () => {},
  refreshUserData: async () => {},
  formatTokens: formatTokenNumber,
  getAppBySlug: (slug: string) => APPS.find((a) => a.slug === slug),
  getCategoryBySlug: (slug: string) => CATEGORIES.find((c) => c.slug === slug),
  getBundleByCategoryId: () => undefined,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [apps, setApps] = useState<LiveAppItem[]>(APPS);
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBannerItem[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlanItem[]>(PRICING_PLANS as any);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [categoryLogos, setCategoryLogos] = useState<Record<string, string>>({});
  const [appLogos, setAppLogos] = useState<Record<string, string>>({});
  const [branding, setBranding] = useState(defaultBranding);
  const [websiteInfo, setWebsiteInfo] = useState(defaultWebsiteInfo);
  const [loading, setLoading] = useState(true);

  // User auth state
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [walletTokens, setWalletTokens] = useState<number>(0);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);

  // Update browser tab title and dynamic favicon
  useEffect(() => {
    document.title = 'Strata ENG';
    if (branding.storeIcon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = branding.storeIcon;
    }
  }, [branding.storeIcon]);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [profileRes, walletRes, purchasesRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_wallets').select('tokens').eq('user_id', userId).maybeSingle(),
        supabase.from('purchases').select('*').eq('user_id', userId),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data as UserProfile);
      }
      if (walletRes.data) {
        setWalletTokens(walletRes.data.tokens || 0);
      }
      if (purchasesRes.data) {
        setPurchases(purchasesRes.data as PurchaseItem[]);
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  // Listen to Auth State changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setWalletTokens(0);
        setPurchases([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const [pricingMatrix, setPricingMatrix] = useState<PricingMatrixItem[]>([
    { id: 1, feature: 'Number of Applications Included', single: '1 Tool', bundle: '5 Tools (1 Discipline)', full: 'All 35 Tools (7 Disciplines)', sort_order: 1 },
    { id: 2, feature: '100% Offline Desktop Mode', single: true, bundle: true, full: true, sort_order: 2 },
    { id: 3, feature: 'Supported Operating Systems', single: 'Windows / macOS / Linux', bundle: 'Windows / macOS / Linux', full: 'Windows / macOS / Linux', sort_order: 3 },
    { id: 4, feature: 'Workstation Activations / Seats', single: '1 Workstation', bundle: '3 Workstations', full: '10 Workstations (Floating)', sort_order: 4 },
    { id: 5, feature: 'PDF/A Calculation Submittal Export', single: true, bundle: true, full: true, sort_order: 5 },
    { id: 6, feature: 'Excel / CSV Full Math Log Export', single: true, bundle: true, full: true, sort_order: 6 },
    { id: 7, feature: 'CAD DXF & LandXML Geometry Output', single: 'Selected Tools', bundle: true, full: true, sort_order: 7 },
    { id: 8, feature: 'Custom Engineering Firm Letterhead', single: false, bundle: true, full: true, sort_order: 8 },
    { id: 9, feature: 'Continuous International Code Updates', single: '1 Year', bundle: 'All Active', full: 'Lifetime / Continuous', sort_order: 9 },
    { id: 10, feature: 'Technical Engineering Support', single: 'Standard (48h)', bundle: 'Priority (12h)', full: 'Dedicated Engineering SLA (2h)', sort_order: 10 },
    { id: 11, feature: 'API & Command-Line Automation Interface', single: false, bundle: false, full: true, sort_order: 11 },
  ]);

  // Main catalog fetching
  useEffect(() => {
    async function fetchAllData() {
      try {
        const [catRes, progRes, brandRes, bundleRes, webRes, bannerRes, planRes, matrixRes, faqRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('programs').select('*'),
          supabase.from('store_branding').select('key, value'),
          supabase.from('bundles').select('*'),
          supabase.from('website').select('*').eq('id', 1).maybeSingle(),
          supabase.from('hero_banners').select('*').order('sort_order', { ascending: true }),
          supabase.from('pricing_plans').select('*').order('sort_order', { ascending: true }),
          supabase.from('pricing_matrix').select('*').order('sort_order', { ascending: true }),
          supabase.from('faqs').select('*').order('sort_order', { ascending: true })
        ]);

        if (faqRes.data && faqRes.data.length > 0) {
          setFaqs(faqRes.data as FaqItem[]);
        }

        if (bannerRes.data && bannerRes.data.length > 0) {
          setHeroBanners(bannerRes.data as HeroBannerItem[]);
        }

        if (planRes.data && planRes.data.length > 0) {
          const livePlans: PricingPlanItem[] = planRes.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug || p.id,
            price: parseFloat(p.price) || 0,
            annualPrice: p.annualPrice ? parseFloat(p.annualPrice) : undefined,
            period: p.period || 'per month',
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features : [],
            ctaText: p.ctaText || 'Get Started',
            popular: Boolean(p.popular),
            highlight: Boolean(p.highlight),
            badge: p.badge || '',
            sort_order: p.sort_order || 0
          }));
          setPricingPlans(livePlans);
        }

        if (matrixRes.data && matrixRes.data.length > 0) {
          const parseVal = (v: any) => {
            if (v === 'true') return true;
            if (v === 'false') return false;
            return v;
          };
          const liveMatrix: PricingMatrixItem[] = matrixRes.data.map((m: any) => {
            const vals: Record<string, any> = {};
            if (m.values && typeof m.values === 'object') {
              Object.keys(m.values).forEach((k) => {
                vals[k] = parseVal(m.values[k]);
              });
            }
            return {
              id: m.id,
              feature: m.feature,
              single: parseVal(m.single),
              bundle: parseVal(m.bundle),
              full: parseVal(m.full),
              values: vals,
              sort_order: m.sort_order || 0
            };
          });
          setPricingMatrix(liveMatrix);
        }



        // 0. Process Website Info

        if (webRes.data) {
          setWebsiteInfo({
            ...defaultWebsiteInfo,
            ...webRes.data
          });
        }

        // 1. Process Branding
        const brandMap = { ...defaultBranding };
        if (brandRes.data) {
          brandRes.data.forEach((row: { key: string; value: string }) => {
            if (row.key in brandMap) {
              (brandMap as any)[row.key] = row.value;
            }
          });
          setBranding(brandMap);
        }

        // 2. Process Categories & Category Logos
        const catLogosMap: Record<string, string> = {};
        if (catRes.data && catRes.data.length > 0) {
          const liveCats = CATEGORIES.map((staticCat) => {
            const match = catRes.data?.find(
              (c: any) =>
                c.id === staticCat.slug ||
                c.name?.toLowerCase() === staticCat.name.toLowerCase() ||
                (c.id === 'construction-management' && staticCat.slug === 'construction')
            );
            if (match) {
              if (match.icon) {
                catLogosMap[staticCat.slug] = match.icon;
                catLogosMap[match.id] = match.icon;
              }
              return {
                ...staticCat,
                name: match.name || staticCat.name,
                shortDescription: match.description || staticCat.shortDescription,
                detailedDescription: match.description || staticCat.detailedDescription,
              };
            }
            return staticCat;
          });
          setCategories(liveCats);
          setCategoryLogos(catLogosMap);
        }


        // 3. Process Programs / Apps & App Logos
        const appLogosMap: Record<string, string> = {};
        if (progRes.data && progRes.data.length > 0) {
          // Map existing static apps with matching Supabase rows
          const staticAppSlugs = new Set<string>();
          const liveApps = APPS.map((staticApp) => {
            const match = progRes.data?.find(
              (p: any) =>
                p.id === staticApp.slug ||
                p.id === staticApp.id ||
                p.name?.toLowerCase() === staticApp.name.toLowerCase()
            );
            if (match) {
              staticAppSlugs.add(match.id);
              if (match.slug) staticAppSlugs.add(match.slug);
              if (match.logo) {
                appLogosMap[staticApp.id] = match.logo;
                appLogosMap[staticApp.slug] = match.logo;
                appLogosMap[match.id] = match.logo;
              }
              return {
                ...staticApp,
                name: match.name || staticApp.name,
                version: match.version || staticApp.version,
                price: typeof match.price === 'number' ? match.price : staticApp.price,
                monthlyPrice: typeof match.price === 'number' ? Math.round(match.price * 0.1) : staticApp.monthlyPrice,
                shortDescription: match.description || staticApp.shortDescription,
                fullDescription: match.description || staticApp.fullDescription,
                trailerUrl: match.trailerUrl || '',
                trailerThumbnail: match.trailerThumbnail || '',
                banner: match.banner || '',
                rating: match.rating || 5,
                downloadUrl: match.downloadUrl || '',
                screenshots: Array.isArray(match.screenshots) ? match.screenshots : [],
                features: Array.isArray(match.features) && match.features.length > 0 ? match.features : staticApp.features,
                standards: Array.isArray(match.standards) && match.standards.length > 0 ? match.standards : staticApp.standards,
                techSpecs: match.techSpecs && typeof match.techSpecs === 'object' ? match.techSpecs : (staticApp as any).techSpecs,
              };
            }
            return staticApp;
          });

          // Append newly created apps from Supabase SQL that aren't in static APPS array
          progRes.data.forEach((p: any) => {
            const matchesStatic = APPS.some(
              (s) => s.id === p.id || s.slug === p.id || s.name.toLowerCase() === p.name?.toLowerCase()
            );
            if (!matchesStatic) {
              const matchedCat = catRes.data?.find((c: any) => c.id === p.categoryId) || { name: 'Engineering', id: 'general' };
              const slugStr = p.id || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              if (p.logo) {
                appLogosMap[p.id] = p.logo;
                appLogosMap[slugStr] = p.logo;
              }
              liveApps.push({
                id: p.id,
                name: p.name,
                slug: slugStr,
                categorySlug: p.categoryId || 'general',
                categoryName: matchedCat.name || 'Engineering',
                shortDescription: p.description || '',
                fullDescription: p.description || '',

                standards: Array.isArray(p.standards) ? p.standards : [],
                features: Array.isArray(p.features) ? p.features : [],
                specs: [],
                techSpecs: p.techSpecs || {},
                price: parseFloat(p.price) || 0,
                monthlyPrice: Math.round((parseFloat(p.price) || 0) * 0.1),
                iconName: 'Boxes',
                version: '1.0.0',
                banner: p.banner || '',
                trailerUrl: p.trailerUrl || '',
                trailerThumbnail: p.trailerThumbnail || '',
                downloadUrl: p.downloadUrl || '',
                screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
              } as any);
            }
          });

          setApps(liveApps);
          setAppLogos(appLogosMap);
        }


        // 4. Process Bundles
        if (bundleRes.data && bundleRes.data.length > 0) {
          const liveBundles: BundleItem[] = bundleRes.data.map((b: any) => ({
            id: b.id,
            categoryId: b.categoryId || '',
            name: b.name || '',
            price: typeof b.price === 'number' ? b.price : 99.99,
            banner: b.banner || '',
            logo: b.logo || '',
            programIds: Array.isArray(b.programIds) ? b.programIds : [],
            description: b.description || 'Complete discipline bundle license.',
          }));
          setBundles(liveBundles);
        }
      } catch (err) {
        console.error('Error fetching live data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  const isOwned = useCallback(
    (id: string) => {
      if (!user || purchases.length === 0) return false;
      const direct = purchases.some((p) => p.program_id === id || p.bundle_id === id);
      if (direct) return true;

      // Check if user owns a bundle containing this program
      const matchingBundle = bundles.find((b) => b.programIds.includes(id));
      if (matchingBundle && purchases.some((p) => p.bundle_id === matchingBundle.id)) {
        return true;
      }

      return false;
    },
    [user, purchases, bundles]
  );

  const purchaseItem = useCallback(
    async (programId?: string, bundleId?: string) => {
      if (!user) {
        return { success: false, error: 'Please sign in or create an account to purchase.' };
      }

      try {
        const { error } = await supabase.rpc('purchase_app', {
          p_program_id: programId || null,
          p_bundle_id: bundleId || null,
        });

        if (error) {
          // If RPC fails (e.g. not created yet), perform client-side fallback
          if (error.message.includes('insufficient') || error.message.includes('Insufficient')) {
            return { success: false, error: 'Insufficient tokens in your wallet. Please top up.' };
          }
          if (error.message.includes('Already owned')) {
            return { success: false, error: 'You already own this license.' };
          }

          // Fallback direct insert
          let price = 0;
          if (programId) {
            const prog = apps.find((a) => a.id === programId || a.slug === programId);
            price = prog?.price || 29.99;
          } else if (bundleId) {
            const bun = bundles.find((b) => b.id === bundleId);
            price = bun?.price || 99.99;
          }

          if (walletTokens < price) {
            return { success: false, error: `Insufficient tokens: need ${price}, have ${walletTokens}` };
          }

          // Deduct tokens
          await supabase.from('user_wallets').update({ tokens: walletTokens - price }).eq('user_id', user.id);
          // Insert purchase
          await supabase.from('purchases').insert({
            user_id: user.id,
            program_id: programId || null,
            bundle_id: bundleId || null,
            tokens_paid: price,
          });

          await refreshUserData();
          return { success: true };
        }

        await refreshUserData();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Purchase transaction failed.' };
      }
    },
    [user, walletTokens, apps, bundles, refreshUserData]
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) return { success: false, error: 'Not authenticated.' };
      try {
        const { error } = await supabase
          .from('users')
          .update(data)
          .eq('id', user.id);

        if (error) throw error;
        await refreshUserData();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update profile.' };
      }
    },
    [user, refreshUserData]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setWalletTokens(0);
    setPurchases([]);
  }, []);

  const getAppBySlug = useMemo(
    () => (slug: string) => apps.find((a) => a.slug === slug || a.id === slug),
    [apps]
  );

  const getCategoryBySlug = useMemo(
    () => (slug: string) => categories.find((c) => c.slug === slug),
    [categories]
  );

  const getBundleByCategoryId = useMemo(
    () => (categoryIdOrSlug: string) => {
      const target = categoryIdOrSlug.toLowerCase();
      return bundles.find((b) => {
        const catId = (b.categoryId || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        const bId = (b.id || '').toLowerCase();
        return (
          catId === target ||
          bName === target ||
          bId.includes(target) ||
          (target === 'construction' && (catId === 'construction' || bId.includes('construction'))) ||
          (target === 'water-resources' && (catId === 'water-resources' || bId.includes('water')))
        );
      });
    },
    [bundles]
  );

  return (
    <DataContext.Provider
      value={{
        categories,
        apps,
        bundles,
        heroBanners,
        pricingPlans,
        pricingMatrix,
        faqs,
        categoryLogos,

        appLogos,


        branding,
        websiteInfo,
        loading,
        user,
        profile,
        walletTokens,
        purchases,
        isOwned,
        purchaseItem,
        updateProfile,
        signOut,
        refreshUserData,
        formatTokens: formatTokenNumber,
        getAppBySlug,
        getCategoryBySlug,
        getBundleByCategoryId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export const useLogos = () => {
  const { categoryLogos, appLogos, loading } = useContext(DataContext);
  return { categoryLogos, appLogos, loading };
};
