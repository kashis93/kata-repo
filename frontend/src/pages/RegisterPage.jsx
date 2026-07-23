import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await register(email, password);
      setSuccessMsg('Account created successfully! Logging you in...');
      
      setTimeout(async () => {
        try {
          await login(email, password);
          window.location.hash = '#/';
        } catch (loginErr) {
          window.location.hash = '#/login';
        }
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
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
              Create Your Account
            </h2>
            <p className="mt-1 text-xs font-sans text-[#6B5E52]">
              Join AutoLot Gallery to save favorites, compare models, and reserve vehicles
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

            {successMsg && (
              <div className="p-3.5 bg-[#EAF2ED] border border-[#3F7A5B] text-[#3F7A5B] text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B5E52]">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
                  />
                </div>
              </div>

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
                    placeholder="e.g. eleanor@autolot.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
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
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B5E52]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="mt-5 text-center text-xs font-sans">
            <span className="text-[#6B5E52]">Already have an account? </span>
            <button
              onClick={() => (window.location.hash = '#/login')}
              className="font-bold text-[#8B5A2B] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
