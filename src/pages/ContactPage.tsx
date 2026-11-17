import React, { useState } from 'react';
import { Mail, MapPin, Phone, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabaseClient';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });
  const { categories, websiteInfo, user } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    if (honeypot.trim() !== '') {
      setSubmitted(true);
      return;
    }

    setSending(true);
    setSendError(false);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: trimmedName.slice(0, 100),
        email: trimmedEmail,
        category: formData.category,
        subject: formData.subject.trim().slice(0, 150),
        message: trimmedMessage.slice(0, 5000),
        user_id: user?.id ?? null,
      });

      if (error) {
        setSendError(true);
        return;
      }

      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Direct Page Header */}
      <section className="pt-8 pb-4 px-4 md:px-8 bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            Contact
          </h1>
        </div>
      </section>

      {/* Main 2-Column Contact Section */}
      <section className="py-10 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-8 shadow-md">
            <div className="border-b border-zinc-100 pb-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Direct Inquiry Channel
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                Send a Technical Inquiry
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950">Inquiry Transmitted</h3>
                <p className="text-sm text-zinc-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your message has been logged in our engineering support queue. A staff engineer will respond within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSendError(false);
                      setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 bg-zinc-900 text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only"
                />

                {sendError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      We could not send your message right now. Please email {websiteInfo.support_email || 'support@stratasuite.com'} instead.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-zinc-900 font-medium mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Engineer / Firm Name"
                      className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-zinc-900 font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="engineer@firm.com"
                      className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Inquiry Category */}
                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Discipline / Subject Area *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  >
                    <option value="general">General Support & Licensing</option>
                    <option value="enterprise">Enterprise / Multi-Seat Quotation</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} Discipline Calculation Verification
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. ACI 318 Section Capacity Verification Inquiry"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-zinc-900 font-medium mb-1.5">
                    Engineering Message / Technical Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    maxLength={5000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify project context, calculation requirements, or requested features..."
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                  >
                    <span>{sending ? 'Sending…' : 'Transmit Message'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white space-y-6 shadow-2xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                Engineering Headquarters
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-zinc-900 text-white mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">Official Communications</div>
                    <div className="font-semibold text-zinc-900 text-sm">{websiteInfo.support_email || 'support@stratasuite.com'}</div>
                    <div className="text-zinc-500 text-[11px]">{websiteInfo.licensing_email || 'licensing@stratasuite.com'}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-zinc-900 text-white mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">Office Address</div>
                    <div className="font-semibold text-zinc-900">{websiteInfo.company_legal_name || 'STRATA Engineering Software Inc.'}</div>
                    <div className="text-zinc-600">{websiteInfo.office_address_line1 || '100 Engineering Plaza, Suite 400'}</div>
                    <div className="text-zinc-600">{websiteInfo.office_address_line2 || 'San Francisco, CA 94105, USA'}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-zinc-900 text-white mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">Engineering Desk</div>
                    <div className="font-semibold text-zinc-900">{websiteInfo.support_phone || '+1 (800) 555-STRATA [7872]'}</div>
                    <div className="text-zinc-500 text-[11px]">Mon-Fri: 08:00 - 18:00 EST</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response SLA Notice */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50 space-y-2 text-xs">
              <div className="font-semibold text-zinc-900 uppercase flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-zinc-900" />
                <span>Engineer-to-Engineer SLA</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                Inquiries are reviewed by licensed civil, structural, and environmental engineers to ensure technical calculation precision and direct answers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
