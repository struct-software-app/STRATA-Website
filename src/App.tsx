import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DataProvider } from './context/DataContext';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CategoryPage } from './pages/CategoryPage';
import { AppDetailPage } from './pages/AppDetailPage';
import { PricingPage } from './pages/PricingPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { TrialPage } from './pages/TrialPage';
import { DownloadPage } from './pages/DownloadPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
          {/* Double Header */}
          <Header />

          {/* Dynamic Route Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/app/:appSlug" element={<AppDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/trial" element={<TrialPage />} />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
