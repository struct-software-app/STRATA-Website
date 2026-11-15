import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-white text-zinc-900">
      <section className="bg-hero-glow py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold font-mono">404</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-4">
            Page not found
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed mb-8">
            The page or engineering calculation module you requested could not be found at this address.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="px-6 py-3 bg-zinc-900 text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors inline-flex items-center space-x-2 shadow-xs"
            >
              <span>Return to Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3 bg-white border border-zinc-200 text-zinc-900 text-xs font-medium rounded-xl hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              View Pricing & Bundles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
