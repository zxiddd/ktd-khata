import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowRight, BookOpen, ShieldCheck, CheckCircle2, Phone, Building, User, Lock, Sparkles } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, signup } = useKhata();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482910');

  // Signup state
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || loginPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    // Generate simulated 6-digit OTP
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(mockCode);
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp && otp !== '123456' && otp !== '482910') {
      setError('Invalid OTP code. Please enter the verification code shown.');
      return;
    }

    login({
      phone: loginPhone,
      name: 'Shop Owner',
      shopName: 'ktd khata Store',
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setError('Please enter your Shop or Business Name');
      return;
    }
    if (!ownerName.trim()) {
      setError('Please enter the Owner Name');
      return;
    }
    if (!signupPhone.trim() || signupPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    signup({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: signupPhone.trim(),
    });
  };

  const handleQuickDemoLogin = () => {
    login({
      name: 'Owner',
      shopName: 'Kachhi Textiles',
      phone: '9876543210',
    });
  };

  return (
    <div className="min-h-screen bg-[#0e8354] flex flex-col justify-between items-center p-4 sm:p-6 select-none animate-in fade-in">
      {/* Top Branding */}
      <div className="w-full max-w-md pt-8 text-center text-white space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-emerald-200 shadow-md border border-white/20">
          <BookOpen className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">ktd khata</h1>
        <p className="text-xs text-emerald-100 font-medium max-w-xs mx-auto">
          Secure, offline-ready digital ledger & credit accounting for your business
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 my-6">
        {/* Toggle Login / Register */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setError('');
              setStep('PHONE');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'LOGIN'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Login with Mobile
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SIGNUP');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'SIGNUP'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Shop Register
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'LOGIN' && (
          <>
            {step === 'PHONE' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-[#0e8354]">
                    <div className="bg-slate-50 border-r border-slate-300 px-3 flex items-center space-x-1 text-slate-700 text-sm font-semibold">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 10-digit mobile"
                      className="w-full px-4 py-3 bg-white text-base text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get OTP Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Simulated SMS Alert */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#0e8354]" />
                    <span>OTP Sent to +91 {loginPhone}</span>
                  </div>
                  <div className="text-slate-600">
                    Use verification code:{' '}
                    <button
                      type="button"
                      onClick={() => setOtp(generatedOtp)}
                      className="font-mono font-bold text-[#0e8354] bg-emerald-100 px-1.5 py-0.5 rounded underline cursor-pointer"
                    >
                      {generatedOtp} (Click to auto-fill)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
                  >
                    Verify & Access Khata
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* SIGNUP FORM */}
        {mode === 'SIGNUP' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Shop / Business Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Kachhi Textiles, Metro Store"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Owner Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Zaid Uddin"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Owner Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={10}
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="10-digit mobile"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              Create Shop & Start Fresh Khata
            </button>
          </form>
        )}

        {/* 1-Click Fast Access */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="text-xs text-[#0e8354] hover:text-emerald-800 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Access (Single Click)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              // Trigger PWA install or instructions
              if ((window as any).deferredPWAEvent) {
                (window as any).deferredPWAEvent.prompt();
              } else {
                alert('To install on Android: Open in Chrome, tap three dots (⋮) and tap "Install app" or "Add to Home Screen"');
              }
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>📱 Install Android App (APK)</span>
          </button>
        </div>
      </div>

      {/* Footer Security Badges */}
      <div className="text-center text-xs text-emerald-100/80 flex items-center justify-center gap-2 pb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-200" />
        <span>100% Private • Cloud Auto-Backup • Encrypted Bahi Khata</span>
      </div>
    </div>
  );
};
