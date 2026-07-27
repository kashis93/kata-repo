import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await login(email, password);
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        window.location.hash = '#/';
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  const handleAdminQuickLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await login('admin@autolotgallery.com', 'admin123');
      setSuccessMsg('Authenticated as Administrator!');
      setTimeout(() => {
        window.location.hash = '#/admin';
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Quick admin login failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F8F4EC] text-[#1F1813] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-[#8B5A2B] text-white flex items-center justify-center shadow-md">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-[#1F1813]">
              Welcome Back
            </h2>
            <p className="mt-1 text-xs font-sans text-[#6B5E52]">
              Sign in to your AutoLot Gallery account to access saved vehicles and management tools
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl border border-[#E5DCCF] bg-white shadow-xl space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3.5 bg-[#FBEAE5] border border-[#B2543C] text-[#B2543C] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-[#EAF2ED] border border-[#3F7A5B] text-[#3F7A5B] text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B5E52]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@autolot.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B5E52]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E5DCCF] text-center space-y-4">
            <button
              onClick={handleAdminQuickLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#F6F0E6] hover:bg-[#F2EBE1] border border-[#E5DCCF] text-[#8B5A2B] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#8B5A2B]" />
              <span>Demo Quick Admin Sign In</span>
            </button>

            <p className="text-xs text-[#6B5E52]">
              Don't have an account?{' '}
              <a
                href="#/register"
                className="text-[#8B5A2B] hover:underline font-bold"
              >
                Register here
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
