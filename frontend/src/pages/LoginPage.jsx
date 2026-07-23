import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, ArrowRight, Shield, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const loggedUser = await login(email, password);
      if (loggedUser && loggedUser.role === 'admin') {
        window.location.hash = '#/admin';
      } else {
        window.location.hash = '#/';
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // Login with admin credentials
      const loggedUser = await login('admin@autolot.com', 'adminpassword');
      window.location.hash = '#/admin';
    } catch (err) {
      // Fallback if backend user doesn't exist yet, try login or notify
      setEmail('admin@autolot.com');
      setPassword('adminpassword');
      setErrorMsg('Direct admin credentials populated. Click Sign In or Register Admin account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F4EC] text-[#1F1813] font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-[#8B5A2B] text-white flex items-center justify-center shadow-md">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-[#1F1813]">
              Sign in to AutoLot
            </h2>
            <p className="mt-1 text-xs font-sans text-[#6B5E52]">
              Access certified luxury vehicle inventory & manage allocations
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl border border-[#E5DCCF] bg-white shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3.5 bg-[#FBEAE5] border border-[#B2543C] text-[#B2543C] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-sans uppercase font-bold text-[#6B5E52] block mb-1">
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
                    placeholder="admin@autolot.com or customer@autolot.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-sans uppercase font-bold text-[#6B5E52] block mb-1">
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
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to Backend...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Login Triggers */}
          <div className="mt-6 pt-5 border-t border-[#E5DCCF] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#6B5E52] block text-center">Quick Demo Access</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="py-2.5 px-3 bg-[#F6F0E6] hover:bg-[#F2EBE1] border border-[#E5DCCF] text-[#8B5A2B] font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEmail('customer@autolot.com');
                  setPassword('customerpassword');
                  try {
                    await login('customer@autolot.com', 'customerpassword');
                    window.location.hash = '#/';
                  } catch (e) {
                    setErrorMsg('Customer credentials populated. Click Sign In.');
                  }
                }}
                className="py-2.5 px-3 bg-[#F6F0E6] hover:bg-[#F2EBE1] border border-[#E5DCCF] text-[#1F1813] font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Car className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>Customer Login</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="mt-5 text-center text-xs font-sans">
            <span className="text-[#6B5E52]">Don't have an account? </span>
            <button
              onClick={() => (window.location.hash = '#/register')}
              className="font-bold text-[#8B5A2B] hover:underline cursor-pointer"
            >
              Sign up free
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
