import { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DataProvider } from './context/DataContext';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const AppDetailPage = lazy(() => import('./pages/AppDetailPage').then((m) => ({ default: m.AppDetailPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const AcademyPage = lazy(() => import('./pages/AcademyPage').then((m) => ({ default: m.AcademyPage })));
const AcademyWatchPage = lazy(() => import('./pages/AcademyWatchPage').then((m) => ({ default: m.AcademyWatchPage })));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then((m) => ({ default: m.GetStartedPage })));
const TrialPage = lazy(() => import('./pages/TrialPage').then((m) => ({ default: m.TrialPage })));
const DownloadPage = lazy(() => import('./pages/DownloadPage').then((m) => ({ default: m.DownloadPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
          <a
            href="#main-content"
            onClick={(e) => {
              e.preventDefault();
              const main = document.getElementById('main-content');
              if (main) {
                main.focus();
                main.scrollIntoView();
              }
            }}
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white focus:text-xs focus:font-semibold focus:rounded-lg focus:shadow-lg"
          >
            Skip to content
          </a>
          {/* Double Header */}
          <Header />

          {/* Dynamic Route Content */}
          <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
            <Suspense fallback={<div className="min-h-[50vh]" />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/category/:categorySlug" element={<CategoryPage />} />
                  <Route path="/app/:appSlug" element={<AppDetailPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/academy" element={<AcademyPage />} />
                  <Route path="/academy/:videoId" element={<AcademyWatchPage />} />
                  <Route path="/get-started" element={<GetStartedPage />} />
                  <Route path="/trial" element={<TrialPage />} />
                  <Route path="/download" element={<DownloadPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  {/* Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
