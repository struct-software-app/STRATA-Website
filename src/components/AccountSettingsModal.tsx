import React, { useState } from 'react';
import { X, User, ShoppingBag, Coins, Check, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'purchases';
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  const { profile, walletTokens, purchases, apps, bundles, branding, updateProfile, formatTokens } = useData();
  const [activeTab, setActiveTab] = useState<'profile' | 'purchases'>(initialTab);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    secondName: profile?.secondName || '',
    username: profile?.username || '',
    birthdate: profile?.birthdate || '',
    avatar: profile?.avatar || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await updateProfile(formData);
    setSaving(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to save changes.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in zoom-in-98 duration-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {profile?.firstName ? profile.firstName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-950">
                {profile?.firstName ? `${profile.firstName} ${profile?.secondName || ''}` : 'Account Settings'}
              </h3>
              <p className="text-xs text-zinc-500 font-mono">@{profile?.username || profile?.email?.split('@')[0]}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-100 px-6 bg-zinc-50/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'profile'
                ? 'border-zinc-900 text-zinc-950 font-bold bg-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'purchases'
                ? 'border-zinc-900 text-zinc-950 font-bold bg-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Purchase History ({purchases.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-800 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-zinc-800 font-medium mb-1">Second Name</label>
                  <input
                    type="text"
                    value={formData.secondName}
                    onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-800 font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-800 font-medium mb-1">Birthdate</label>
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                  className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              {/* Token balance overview */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  {branding.storeIcon ? (
                    <img src={branding.storeIcon} alt="Tokens" className="w-5 h-5 object-contain" />
                  ) : (
                    <Coins className="w-5 h-5 text-zinc-700" />
                  )}
                  <span className="font-semibold text-zinc-800">Current Token Balance</span>
                </div>
                <span className="font-bold font-mono text-zinc-950 text-sm">{formatTokens(walletTokens)} Tokens</span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PURCHASE HISTORY */}
          {activeTab === 'purchases' && (
            <div className="space-y-3 text-xs">
              {purchases.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30 text-zinc-800" />
                  <p className="font-semibold text-zinc-900 text-sm">No purchases recorded yet</p>
                  <p className="text-xs text-zinc-500 mt-1">Browse the catalog to unlock perpetual licenses using tokens.</p>
                </div>
              ) : (
                purchases.map((purchase) => {
                  let title = 'Purchased Engine';
                  let subtitle = 'Single Tool License';

                  if (purchase.program_id) {
                    const matched = apps.find((a) => a.id === purchase.program_id || a.slug === purchase.program_id);
                    if (matched) {
                      title = matched.name;
                      subtitle = `${matched.categoryName} Engine`;
                    }
                  } else if (purchase.bundle_id) {
                    const matched = bundles.find((b) => b.id === purchase.bundle_id);
                    if (matched) {
                      title = `${matched.name} Suite`;
                      subtitle = `Discipline Bundle (${matched.programIds.length} Tools)`;
                    }
                  }

                  return (
                    <div
                      key={purchase.id}
                      className="p-3.5 border border-zinc-200 rounded-xl flex items-center justify-between hover:bg-zinc-50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-zinc-900">{title}</div>
                        <div className="text-zinc-500 text-[11px]">{subtitle}</div>
                        <div className="text-zinc-400 text-[10px] font-mono">
                          {new Date(purchase.purchased_at).toLocaleDateString()} at {new Date(purchase.purchased_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {branding.storeIcon && (
                          <img src={branding.storeIcon} alt="Tokens" className="w-4 h-4 object-contain" />
                        )}
                        <span className="font-bold font-mono text-zinc-900 text-xs">
                          {purchase.tokens_paid} Tokens
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
