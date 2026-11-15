import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Globe, 
  ChevronDown, 
  Menu, 
  X, 
  Download, 
  ArrowRight,
  Boxes,
  Settings,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { AccountSettingsModal } from './AccountSettingsModal';
import { AssetImage } from './AssetImage';
import { Avatar } from './Avatar';
import { WalletBalance } from './WalletBalance';
import { searchApps } from '../lib/searchApps';
import { formatUsd, tokensToUsd } from '../lib/pricing';
import { ENABLE_LANGUAGE_SWITCHER, SEARCH_BAR_WIDTH_PX } from '../config';
import { isDesktopApp } from '../lib/env';

export const Header: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

  // Profile menu & settings modal state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'profile' | 'purchases'>('profile');

  // Search state & refs
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { 
    categories, 
    apps, 
    categoryLogos, 
    appLogos, 
    branding, 
    loading,
    user, 
    profile, 
    signOut 
  } = useData();

  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setActiveCategory(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) {
        setActiveCategory(null);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(target) &&
        !searchButtonRef.current?.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener (Cmd/Ctrl + K or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setActiveCategory(null);
        setIsLangOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'AR', name: 'العربية (Arabic)' },
    { code: 'TR', name: 'Türkçe (Turkish)' },
    { code: 'FR', name: 'Français (French)' },
    { code: 'DE', name: 'Deutsch (German)' },
  ];

  const filteredApps = searchApps(apps, searchQuery, 8);

  const handleSelectApp = (slug: string) => {
    navigate(`/app/${slug}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="relative z-50 w-full bg-white select-none border-b border-zinc-200 shadow-2xs">
        {/* ========================================================================= */}
        {/* HEADER BAR 1 (Top Bar: ~64px, Solid White Background)                     */}
        {/* ========================================================================= */}
        <div className="h-16 px-6 md:px-8 border-b border-zinc-100 bg-white">
          <div className="max-w-7xl h-full mx-auto flex items-center justify-between">
            {/* Left: Brand Logo & Wordmark */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2.5 group transition-opacity hover:opacity-90">
                {!loading && !branding.storeIcon && !branding.storeNameLogo ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-sm">
                      S
                    </div>
                    <span className="font-bold text-lg tracking-tight text-black">
                      STRATA
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2.5">
                    {(loading || branding.storeIcon) && (
                      <AssetImage src={branding.storeIcon} alt="Store Icon" className="w-8 h-8 shrink-0" />
                    )}
                    {(loading || branding.storeNameLogo) && (
                      <AssetImage
                        src={branding.storeNameLogo}
                        alt="STRATA"
                        className="h-6 w-28 shrink-0"
                        position="left center"
                      />
                    )}
                  </div>
                )}
              </Link>

              {/* Center-Left Nav Links */}
              <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === '/' 
                      ? 'text-zinc-900 bg-zinc-100 font-semibold' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === '/about' 
                      ? 'text-zinc-900 bg-zinc-100 font-semibold' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/pricing"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === '/pricing' 
                      ? 'text-zinc-900 bg-zinc-100 font-semibold' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  Plans & Pricing
                </Link>
                <Link
                  to="/contact"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === '/contact' 
                      ? 'text-zinc-900 bg-zinc-100 font-semibold' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Right: Search + Lang Switcher + Profile/Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Compact search bar trigger to open search dropdown */}
              <button
                type="button"
                ref={searchButtonRef}
                onClick={() => setIsSearchOpen((prev) => !prev)}
                style={{ width: SEARCH_BAR_WIDTH_PX }}
                className="hidden lg:flex h-8 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors items-center justify-end gap-2 px-2.5 shrink-0"
                title="Search (Ctrl+K)"
                aria-label="Search"
                aria-expanded={isSearchOpen}
              >
                <span className="text-xs font-medium text-black">Search</span>
                <Search className="w-4 h-4 text-black shrink-0" />
              </button>

              {/* Language Switcher */}
              {ENABLE_LANGUAGE_SWITCHER && (
                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                    aria-label="Change language"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-semibold">{selectedLang}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  {isLangOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLang(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-zinc-50 ${
                            selectedLang === lang.code ? 'font-semibold text-zinc-900 bg-zinc-50' : 'text-zinc-600'
                          }`}
                        >
                          <span>{lang.name}</span>
                          {selectedLang === lang.code && (
                            <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================================================================= */}
              {/* AUTH & USER PROFILE SECTION                                       */}
              {/* ================================================================= */}
              {user ? (
                /* LOGGED IN: Profile with Trial and Download Buttons */
                <div className="flex items-center space-x-2">
                  <Link
                    to="/trial"
                    className="hidden sm:inline-flex h-8 px-3 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors shadow-2xs items-center justify-center"
                  >
                    Trial
                  </Link>
                  {!isDesktopApp && (
                    <Link
                      to="/download"
                      className="hidden sm:inline-flex h-8 px-4 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors items-center space-x-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Link>
                  )}

                  {/* Profile & Wallet Dropdown Trigger */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="rounded-full hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      title="Account menu"
                      aria-label="Account menu"
                      aria-haspopup="true"
                      aria-expanded={isProfileMenuOpen}
                    >
                      <Avatar size={32} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {/* User Header */}
                        <div className="flex items-center gap-3">
                          <Avatar size={64} />
                          <div className="min-w-0 flex-1">
                            {profile?.firstName ? (
                              <>
                                <div className="font-bold text-sm text-zinc-950 truncate">
                                  {`${profile.firstName} ${profile.secondName || ''}`.trim()}
                                </div>
                                <div className="text-xs text-zinc-500 font-mono truncate">
                                  @{profile?.username || user.email?.split('@')[0]}
                                </div>
                              </>
                            ) : (
                              <div className="font-bold text-sm text-zinc-950 font-mono truncate">
                                @{profile?.username || user.email?.split('@')[0]}
                              </div>
                            )}
                          </div>
                        </div>

                        {user.email && (
                          <div className="mt-3 text-xs text-zinc-500 break-all">
                            {user.email}
                          </div>
                        )}

                        <div className="mt-4">
                          <WalletBalance size="md" />
                        </div>

                        {/* Actions */}
                        <div className="border-t border-zinc-100 mt-4 pt-2 space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsModalTab('profile');
                              setIsSettingsModalOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Account Settings & Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSettingsModalTab('purchases');
                              setIsSettingsModalOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Purchase History</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              signOut();
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* NOT LOGGED IN: Get Started + Trial + Download Full Button */
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/get-started"
                    className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors shadow-2xs"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/trial"
                    className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors shadow-2xs"
                  >
                    Trial
                  </Link>
                  {!isDesktopApp && (
                    <Link
                      to="/download"
                      className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-md"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Inline Search Dropdown Panel (Lowered and extended below Header Bar 1) */}
        {isSearchOpen && (
          <div
            ref={searchPanelRef}
            className="absolute top-16 left-0 right-0 bg-white border-b border-zinc-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="max-w-4xl mx-auto px-6 py-5">
              <div className="flex items-center border border-zinc-300 rounded-xl px-4 py-2.5 bg-zinc-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-950/10 focus-within:border-zinc-950 transition-all">
                <Search className="w-5 h-5 text-zinc-400 mr-2.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredApps.length > 0) {
                      e.preventDefault();
                      handleSelectApp(filteredApps[0].slug);
                    }
                  }}
                  placeholder={`Search all ${apps.length} engineering tools, codes, or formulas...`}
                  className="w-full bg-transparent text-sm focus:outline-none text-zinc-900 placeholder:text-zinc-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-zinc-400 hover:text-zinc-700"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Results List */}
              <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-zinc-100">
                {filteredApps.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    No engineering tools found
                  </div>
                ) : (
                  filteredApps.map((app) => {
                    const logoUrl = appLogos[app.id] || appLogos[app.slug];
                    return (
                      <div
                        key={app.id}
                        onClick={() => handleSelectApp(app.slug)}
                        className="flex items-center justify-between py-3 px-2 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <AssetImage
                            src={logoUrl}
                            alt={app.name}
                            className="w-7 h-7 shrink-0"
                            fallback={<Boxes className="w-7 h-7 text-black" />}
                          />
                          <div>
                            <span className="text-xs font-semibold text-black">{app.name}</span>
                            <span className="text-[10px] text-black ml-2.5 font-mono">{app.categoryName}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
              {/* ========================================================================= */}
        {/* HEADER BAR 2 (Category Bar: Fully aligned, uniform hover across all)      */}
        {/* ========================================================================= */}
        <div 
          className="hidden lg:block px-6 md:px-8 bg-zinc-50 border-b border-zinc-200 text-xs font-medium text-zinc-700 relative"
          ref={megaMenuRef}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-start">
            {/* -ml-3 ensures the text of Construction starts exactly at the left edge matching the logo */}
            <div className="flex items-center space-x-1 -ml-3 py-1">
              {categories.map((category) => {
                const isActive = activeCategory === category.slug;
                const isCurrentCategoryPage = location.pathname === `/category/${category.slug}`;

                return (
                  <div key={category.slug} className="relative">
                    <button
                      onClick={() => setActiveCategory(category.slug)}
                      onMouseEnter={() => setActiveCategory(category.slug)}
                      aria-haspopup="true"
                      aria-expanded={isActive}
                      className={`h-9 px-3 flex items-center space-x-1.5 text-xs font-medium rounded-md transition-all ${
                        isActive || isCurrentCategoryPage
                          ? 'bg-white text-zinc-950 font-semibold shadow-2xs border border-zinc-200'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                      }`}
                    >
                      <span className="whitespace-nowrap uppercase tracking-wider text-[11px] font-semibold">{category.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isActive ? 'rotate-180' : 'opacity-60'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MEGA MENU FLYOUT PANEL (100% Solid Opaque White Background)               */}
          {/* ========================================================================= */}
          {activeCategory && (
            <div 
              className="absolute left-0 right-0 top-full bg-white border-b border-zinc-200 shadow-2xl z-50 animate-in fade-in-50 duration-100 px-4 md:px-8"
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className="max-w-7xl mx-auto py-8 bg-white">
                {(() => {
                  const cat = categories.find((c) => c.slug === activeCategory);
                  if (!cat) return null;
                  const categoryApps = apps.filter((app) => app.categorySlug === cat.slug);
                  const catLogoUrl = categoryLogos[cat.slug];

                  return (
                    <div className="grid grid-cols-12 gap-8 items-start bg-white">
                      {/* Left: Discipline Overview */}
                      <div className="col-span-4 border-r border-zinc-100 pr-8 flex flex-col justify-between h-full bg-white">
                        <div>
                          <div className="flex items-center space-x-3 mb-3">
                            <AssetImage
                              src={catLogoUrl}
                              alt={cat.name}
                              className="w-9 h-9 shrink-0"
                              fallback={<Boxes className="w-9 h-9 text-black" />}
                            />
                            <h3 className="text-xl font-bold text-black tracking-tight">
                              {cat.name} Suite
                            </h3>
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                            {cat.detailedDescription}
                          </p>
                        </div>

                        <div className="pt-4">
                          <Link
                            to={`/category/${cat.slug}`}
                            onClick={() => setActiveCategory(null)}
                            className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                          >
                            <span>Explore all {cat.name} engines</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Right: Apps List */}
                      <div className="col-span-8 grid grid-cols-1 gap-2 bg-white">
                        <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1 flex justify-between">
                          <span>Included Engineering Engines</span>
                          <span>Select tool</span>
                        </div>

                        {categoryApps.map((app) => {
                          const appLogoUrl = appLogos[app.id] || appLogos[app.slug];

                          return (
                            <Link
                              key={app.id}
                              to={`/app/${app.slug}`}
                              onClick={() => setActiveCategory(null)}
                              className="group p-3 rounded-xl border border-zinc-200/70 hover:border-zinc-300 bg-white hover:bg-zinc-50 transition-all flex items-center justify-between"
                            >
                              <div className="flex items-start space-x-3">
                                <AssetImage
                                  src={appLogoUrl}
                                  alt={app.name}
                                  className="w-9 h-9 shrink-0"
                                  fallback={<Boxes className="w-9 h-9 text-black" />}
                                />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-sm text-black">
                                      {app.name}
                                    </span>
                                    {app.isPopular && (
                                      <span className="text-[10px] font-medium text-black">
                                        Core
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                                    {app.shortDescription}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 shrink-0 ml-4">
                                <div className="text-right">
                                  <div className="text-xs font-semibold text-black">{formatUsd(tokensToUsd(app.price))}</div>
                                  <div className="text-[10px] text-black font-mono">v{app.version}</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MOBILE NAVIGATION DRAWER                                                  */}
        {/* ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white border-b border-zinc-200 overflow-y-auto z-50 p-4">
            {/* Mobile Search Bar inside navigation drawer */}
            <div className="mb-5">
              <div className="flex items-center border border-zinc-300 rounded-xl px-3 py-2.5 bg-zinc-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-950/10 focus-within:border-zinc-950 transition-all">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredApps.length > 0) {
                      e.preventDefault();
                      handleSelectApp(filteredApps[0].slug);
                    }
                  }}
                  placeholder={`Search ${apps.length} engineering tools...`}
                  className="w-full bg-transparent text-xs focus:outline-none text-zinc-900 placeholder:text-zinc-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-zinc-400 hover:text-zinc-700"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Search Results list */}
              {searchQuery.trim() && (
                <div className="mt-2 bg-zinc-50 border border-zinc-200 rounded-xl p-2 max-h-48 overflow-y-auto divide-y divide-zinc-200/60 shadow-2xs">
                  {filteredApps.length === 0 ? (
                    <div className="py-3 text-center text-zinc-500 text-[11px]">
                      No tools found
                    </div>
                  ) : (
                    filteredApps.map((app) => (
                      <Link
                        key={app.id}
                        to={`/app/${app.slug}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-100/80 rounded transition-colors"
                      >
                        <span className="text-xs font-semibold text-black">{app.name}</span>
                        <span className="text-[10px] text-black font-mono">{app.categoryName}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Mobile Nav Links */}
            <div className="space-y-1 mb-6 border-b border-zinc-100 pb-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-zinc-900 hover:bg-zinc-100"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-zinc-900 hover:bg-zinc-100"
              >
                About
              </Link>
              <Link
                to="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-zinc-900 hover:bg-zinc-100"
              >
                Plans & Pricing
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-zinc-900 hover:bg-zinc-100"
              >
                Contact
              </Link>
            </div>

            {/* Mobile CTAs */}
            <div className={`grid ${isDesktopApp ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mb-6 border-b border-zinc-100 pb-4`}>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setSettingsModalTab('profile');
                    setIsSettingsModalOpen(true);
                  }}
                  className="p-2 text-center text-xs font-medium border border-zinc-200 rounded-lg text-zinc-900 hover:bg-zinc-50 flex items-center justify-center space-x-1.5"
                  aria-label="Account Settings"
                >
                  <Avatar size={24} />
                </button>
              ) : (
                <Link
                  to="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-center text-xs font-medium border border-zinc-200 rounded-lg text-zinc-900 hover:bg-zinc-50 flex items-center justify-center space-x-1.5"
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/trial"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-center text-xs font-medium border border-zinc-200 rounded-lg text-zinc-900 hover:bg-zinc-50"
              >
                Trial
              </Link>
              {!isDesktopApp && (
                <Link
                  to="/download"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-center text-xs font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 flex items-center justify-center space-x-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Link>
              )}
            </div>

            {user && (
              <div className="space-y-1 mb-6 border-b border-zinc-100 pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setSettingsModalTab('purchases');
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-zinc-900 hover:bg-zinc-100 flex items-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4 text-zinc-500" />
                  <span>Purchase History</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {/* Mobile Disciplines Accordion */}
            <div className="mb-4">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-400 px-3 mb-2">
                Engineering Disciplines
              </div>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isExpanded = mobileExpandedCategory === cat.slug;
                  const categoryApps = apps.filter((app) => app.categorySlug === cat.slug);
                  const catLogoUrl = categoryLogos[cat.slug];

                  return (
                    <div key={cat.slug} className="border border-zinc-200 rounded-xl overflow-hidden mb-1.5 bg-white">
                      <button
                        onClick={() => setMobileExpandedCategory(isExpanded ? null : cat.slug)}
                        className="w-full px-3.5 py-2.5 text-left text-sm font-semibold flex items-center justify-between bg-zinc-50/50"
                      >
                        <div className="flex items-center space-x-2.5">
                          <AssetImage
                            src={catLogoUrl}
                            alt={cat.name}
                            className="w-6 h-6 shrink-0"
                            fallback={<Boxes className="w-6 h-6 text-black" />}
                          />
                          <span className="text-black">{cat.name}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 bg-white space-y-1 border-t border-zinc-100">
                          <Link
                            to={`/category/${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:text-black border-b border-zinc-100 mb-1"
                          >
                            View {cat.name} Category Overview →
                          </Link>
                          {categoryApps.map((app) => {
                            const appLogoUrl = appLogos[app.id] || appLogos[app.slug];
                            return (
                              <Link
                                key={app.id}
                                to={`/app/${app.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-zinc-50 rounded-lg text-xs flex items-center space-x-2.5 transition-colors"
                              >
                                <AssetImage
                                  src={appLogoUrl}
                                  alt={app.name}
                                  className="w-7 h-7 shrink-0"
                                  fallback={<Boxes className="w-7 h-7 text-black" />}
                                />
                                <div>
                                  <div className="font-medium text-black">{app.name}</div>
                                  <div className="text-zinc-500 text-[11px] line-clamp-1">{app.shortDescription}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Account Settings & Purchases Modal */}
      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsModalTab}
      />
    </>
  );
};
