import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Download, 
  LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../context/DataContext';
import { bootstrapNewUser } from '../lib/accountBootstrap';
import { TRIAL_DAYS } from '../config';
import { Avatar } from '../components/Avatar';
import { WalletBalance } from '../components/WalletBalance';

export const GetStartedPage: React.FC = () => {
  const { user, profile, signOut, refreshUserData } = useData();
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign Up Form fields (matching public.users schema)
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    secondName: '',
    username: '',
    email: '',
    password: '',
    birthdate: '',
  });

  // Sign In Form fields
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            username: signUpData.username,
            firstName: signUpData.firstName,
            secondName: signUpData.secondName,
          },
        },
      });

      if (error) throw error;

      if (!data.session) {
        setSuccessMessage('Account created. Check your email to confirm your address, then sign in.');
        return;
      }

      if (data.user) {
        const { error: bootstrapError } = await bootstrapNewUser(supabase, data.user, {
          username: signUpData.username,
          firstName: signUpData.firstName,
          secondName: signUpData.secondName,
          birthdate: signUpData.birthdate || null,
        });

        if (bootstrapError) {
          setErrorMessage(bootstrapError);
          return;
        }

        await refreshUserData();
        setSuccessMessage('Account created successfully! Welcome to STRATA Engineering Suite.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) throw error;
      setSuccessMessage('Signed in successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header Banner */}
      <section className="bg-hero-glow py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Account Access</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-3">
            {user ? 'Your STRATA Account' : 'Get Started with STRATA'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            {user
              ? 'Manage your multidisciplinary licenses, token wallet, and local desktop workstations.'
              : 'Create your engineering profile or sign in to activate commercial licenses and sync offline seats.'}
          </p>
        </div>
      </section>

      {/* Main Authentication / Account Hub */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-xl mx-auto">
          {/* Active Logged-In State Dashboard */}
          {user ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                <div className="flex items-center space-x-3.5">
                  <Avatar size={48} />
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">
                      {profile?.firstName} {profile?.secondName}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono">@{profile?.username || user.email?.split('@')[0]}</p>
                  </div>
                </div>

                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Wallet Balance */}
              <div className="flex items-center justify-between">
                <WalletBalance size="lg" />

                <Link
                  to="/pricing"
                  className="px-3.5 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Top Up
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/download"
                  className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Desktop Suite</span>
                </Link>
                <Link
                  to="/trial"
                  className="w-full py-2.5 text-center text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl hover:bg-zinc-50 block"
                >
                  Generate {TRIAL_DAYS}-Day Free Evaluation License Key →
                </Link>
              </div>
            </div>
          ) : (
            /* Unauthenticated State: Sign Up / Sign In Form */
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-md">
              {/* Tabs Switcher */}
              <div className="flex border-b border-zinc-100 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'signup'
                      ? 'border-zinc-900 text-zinc-950 font-bold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'signin'
                      ? 'border-zinc-900 text-zinc-950 font-bold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Feedback Alerts */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* TAB 1: SIGN UP FORM */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-800 font-medium mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        placeholder="Alex"
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-800 font-medium mb-1">
                        Second Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpData.secondName}
                        onChange={(e) => setSignUpData({ ...signUpData, secondName: e.target.value })}
                        placeholder="Morgan"
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-medium mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpData.username}
                      onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                      placeholder="alex_engineer"
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="alex.morgan@consultancy.com"
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-medium mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-medium mb-1">
                      Birthdate (Optional)
                    </label>
                    <input
                      type="date"
                      value={signUpData.birthdate}
                      onChange={(e) => setSignUpData({ ...signUpData, birthdate: e.target.value })}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                    >
                      <span>{loading ? 'Creating Profile...' : 'Create STRATA Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-zinc-500">
                    Looking for evaluation only?{' '}
                    <Link to="/trial" className="font-semibold text-zinc-900 hover:underline">
                      Get {TRIAL_DAYS}-Day Free Trial Key
                    </Link>
                  </div>
                </form>
              )}

              {/* TAB 2: SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-zinc-800 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="engineer@consultancy.com"
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 font-medium mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                    >
                      <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-zinc-500">
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="font-semibold text-zinc-900 hover:underline"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
