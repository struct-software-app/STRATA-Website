import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Download, Key, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabaseClient';
import { TRIAL_DAYS, TRIAL_SEATS } from '../config';

// License-key validation happens in the desktop app / licensing service, outside this repository.
const TRIAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateTrialKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => TRIAL_ALPHABET[b & 31]).join('');
  return `STRATA-TRIAL-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}-${chars.slice(12, 16)}`;
}

export const TrialPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    discipline: 'all',
  });
  const { categories, apps, websiteInfo, user } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    if (!trimmedName || !trimmedEmail) return;

    const generatedKey = generateTrialKey();
    setSending(true);
    setSendError(false);

    try {
      const { error } = await supabase.from('trial_requests').insert({
        full_name: trimmedName.slice(0, 100),
        email: trimmedEmail,
        company: formData.company.trim().slice(0, 150),
        discipline: formData.discipline,
        license_key: generatedKey,
        user_id: user?.id ?? null,
      });

      if (error) {
        setSendError(true);
        return;
      }

      setLicenseKey(generatedKey);
      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-zinc-200 bg-hero-glow py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">{TRIAL_DAYS}-Day Free Evaluation</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-3">
            Start Your {TRIAL_DAYS}-Day Free Trial
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Generate an instant offline evaluation key for all {apps.length} desktop engineering calculation engines. No payment or credit card required.
          </p>
        </div>
      </section>

      {/* Main Trial Form */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-xl mx-auto">
          {submitted && licenseKey ? (
            <div className="border border-zinc-200 rounded-2xl bg-white p-8 shadow-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Evaluation License Generated
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. An offline trial activation token has been generated for <strong>{formData.email}</strong>.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-left space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-semibold">
                  <span>Trial License Key</span>
                  <span className="text-green-600 font-bold">{TRIAL_DAYS}-Day Active</span>
                </div>
                <div className="text-zinc-900 font-bold select-all bg-white p-3 rounded-lg border border-dashed border-zinc-300 flex items-center justify-between">
                  <span>{licenseKey}</span>
                  <Key className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-[11px] text-zinc-500 pt-1">Valid for {TRIAL_DAYS} days on {TRIAL_SEATS} desktop workstations. 100% offline.</div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/download"
                  className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Desktop Installer</span>
                </Link>
                <Link
                  to="/get-started"
                  className="w-full py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 block"
                >
                  Create permanent STRATA account →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-md">
              <div className="border-b border-zinc-100 pb-4 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                  Instant Access Evaluation
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Request Trial Key
                </h2>
              </div>

              {sendError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    We could not generate your trial key right now. Please email {websiteInfo.support_email || 'support@stratasuite.com'} instead.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Engineer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dr. Alex Morgan, P.E."
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Engineering Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex.morgan@consultancy.com"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Company / Consultancy
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Infrastructure Engineering Group"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Primary Discipline of Interest
                  </label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  >
                    <option value="all">Full Suite (All {categories.length} Disciplines - {apps.length} Tools)</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.appsCount} Tools)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                  >
                    <span>{sending ? 'Generating…' : 'Generate Instant Trial Key'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-zinc-500 text-center pt-1">
                  100% free evaluation. No credit card required.
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
