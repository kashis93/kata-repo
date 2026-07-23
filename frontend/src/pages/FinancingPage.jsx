import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Euro, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Building2, 
  ArrowRight,
  HelpCircle,
  Car
} from 'lucide-react';

export const FinancingPage = () => {
  // Calculator state
  const [vehiclePrice, setVehiclePrice] = useState(128500);
  const [downPayment, setDownPayment] = useState(25000);
  const [tradeInValue, setTradeInValue] = useState(10000);
  const [termMonths, setTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(4.9);
  const [financeType, setFinanceType] = useState('loan'); // 'loan' or 'lease'

  // Pre-approval form state
  const [appForm, setAppForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employmentStatus: 'Employed',
    annualIncome: '120000',
    creditScore: '750+ (Excellent)',
    desiredModel: 'Porsche 911 Carrera S',
    tradeInDetails: ''
  });

  const [submittedApp, setSubmittedApp] = useState(false);

  // Math calculations
  const netFinanced = Math.max(0, vehiclePrice - downPayment - tradeInValue);

  const monthlyPayment = useMemo(() => {
    if (netFinanced <= 0) return 0;
    const r = interestRate / 100 / 12;
    const n = termMonths;

    if (financeType === 'lease') {
      // Lease calculation with estimated residual value (~45% at 36-60m)
      const residualFactor = 0.50 - (termMonths - 24) * 0.005;
      const residualValue = vehiclePrice * Math.max(0.30, residualFactor);
      const depreciation = (netFinanced - residualValue) / n;
      const financeCharge = (netFinanced + residualValue) * r;
      return Math.round(depreciation + financeCharge);
    } else {
      // Standard amortization formula
      if (r === 0) return Math.round(netFinanced / n);
      const payment = (netFinanced * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      return Math.round(payment);
    }
  }, [vehiclePrice, downPayment, tradeInValue, termMonths, interestRate, financeType, netFinanced]);

  const totalCost = useMemo(() => {
    return (monthlyPayment * termMonths) + downPayment;
  }, [monthlyPayment, termMonths, downPayment]);

  const totalInterest = useMemo(() => {
    return Math.max(0, totalCost - vehiclePrice + tradeInValue);
  }, [totalCost, vehiclePrice, tradeInValue]);

  const handleSubmitApp = (e) => {
    e.preventDefault();
    if (!appForm.firstName || !appForm.email || !appForm.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmittedApp(true);
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1F1813] text-[#F8F4EC] p-8 md:p-14 shadow-2xl border border-[#3A2E25]">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#C9A66B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5A2B]/30 border border-[#8B5A2B]/50 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Bespoke Financial Advisory</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight text-white">
            Tailored Capital Solutions for Luxury Acquisitions
          </h1>
          <p className="text-sm md:text-base text-[#D4C8B8] leading-relaxed">
            Customize low-APR auto loans, corporate lease agreements, or structured balloon payment plans with instant rate quotes and instant pre-approval.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center text-xs font-medium text-[#C9A66B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5A2B]" /> Competitive Rates from 2.9% APR
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5A2B]" /> No Early Repayment Penalties
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5A2B]" /> Corporate & Tax Advantage Leasing
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator & Summary Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5DCCF] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#F2EBE1] pb-4">
            <div>
              <h2 className="text-xl font-bold font-display text-[#1F1813]">Payment Estimator</h2>
              <p className="text-xs text-[#6B5E52]">Adjust terms to calculate real-time payment options</p>
            </div>
            
            {/* Toggle Loan / Lease */}
            <div className="bg-[#F8F4EC] border border-[#E5DCCF] p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFinanceType('loan')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  financeType === 'loan' ? 'bg-[#8B5A2B] text-white shadow-xs' : 'text-[#6B5E52] hover:text-[#1F1813]'
                }`}
              >
                Traditional Loan
              </button>
              <button
                type="button"
                onClick={() => setFinanceType('lease')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  financeType === 'lease' ? 'bg-[#8B5A2B] text-white shadow-xs' : 'text-[#6B5E52] hover:text-[#1F1813]'
                }`}
              >
                Bespoke Lease
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Vehicle Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-[#6B5E52] uppercase">Vehicle Price</span>
                <span className="font-bold font-display text-base text-[#8B5A2B]">€{vehiclePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="350000"
                step="2500"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-[#8B5A2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B5E52] mt-1">
                <span>€30,000</span>
                <span>€190,000</span>
                <span>€350,000</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-[#6B5E52] uppercase">Down Payment</span>
                <span className="font-bold font-display text-base text-[#1F1813]">€{downPayment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-[#8B5A2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B5E52] mt-1">
                <span>€0</span>
                <span>€50,000</span>
                <span>€100,000</span>
              </div>
            </div>

            {/* Trade-In Value */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-[#6B5E52] uppercase">Estimated Trade-In Allowance</span>
                <span className="font-bold font-display text-base text-[#1F1813]">€{tradeInValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80000"
                step="1000"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(Number(e.target.value))}
                className="w-full accent-[#8B5A2B] cursor-pointer"
              />
            </div>

            {/* Term Months Buttons */}
            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-2">
                Financing Term (Months)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[24, 36, 48, 60, 72].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTermMonths(m)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      termMonths === m
                        ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-xs'
                        : 'bg-[#F8F4EC] text-[#1F1813] border-[#E5DCCF] hover:border-[#8B5A2B]'
                    }`}
                  >
                    {m} mos
                  </button>
                ))}
              </div>
            </div>

            {/* APR Selector */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-[#6B5E52] uppercase">Annual Percentage Rate (APR)</span>
                <span className="font-bold text-[#8B5A2B] text-sm font-display">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="12.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#8B5A2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B5E52] mt-1">
                <span>2.5% Super Prime</span>
                <span>4.9% Standard</span>
                <span>12.0%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Summary Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#1F1813] text-[#F8F4EC] border border-[#3A2E25] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A66B]">
              Estimated Payment Result
            </span>
            <h3 className="text-2xl font-bold font-display text-white mt-1">
              Monthly Investment
            </h3>
          </div>

          <div className="bg-[#2A211A] border border-[#4A3B30] rounded-2xl p-6 text-center space-y-2">
            <div className="text-4xl md:text-5xl font-black font-display text-[#C9A66B]">
              €{monthlyPayment.toLocaleString()}
              <span className="text-xs font-normal text-[#D4C8B8]">/mo*</span>
            </div>
            <p className="text-[11px] text-[#A69888]">
              {financeType === 'lease' ? 'Estimated monthly lease payment before taxes' : 'Estimated monthly auto loan payment'}
            </p>
          </div>

          <div className="space-y-3 border-t border-[#3A2E25] pt-4 text-xs">
            <div className="flex justify-between text-[#D4C8B8]">
              <span>Vehicle Price:</span>
              <span className="font-bold text-white">€{vehiclePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#D4C8B8]">
              <span>Down Payment + Trade-In:</span>
              <span className="font-bold text-[#C9A66B]">-€{(downPayment + tradeInValue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#D4C8B8]">
              <span>Net Financed Principal:</span>
              <span className="font-bold text-white">€{netFinanced.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#D4C8B8]">
              <span>Term & Rate:</span>
              <span className="font-bold text-white">{termMonths} Months @ {interestRate}% APR</span>
            </div>
            <div className="flex justify-between text-[#D4C8B8] border-t border-[#3A2E25] pt-2">
              <span>Est. Total Interest Paid:</span>
              <span className="font-bold text-[#C9A66B]">€{totalInterest.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('preapproval-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#A66D3B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Apply for Fast Pre-Approval</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* Pre-approval Application Form */}
      <section id="preapproval-form" className="bg-white border border-[#E5DCCF] rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2EBE1] text-[#8B5A2B] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure 128-bit Encrypted Application</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-[#1F1813]">
            Instant Credit Pre-Approval Application
          </h2>
          <p className="text-xs md:text-sm text-[#6B5E52] mt-1">
            Applying takes less than 2 minutes and will not impact your credit score.
          </p>
        </div>

        {submittedApp ? (
          <div className="bg-[#EBF5EF] border border-[#3F7A5B] rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#3F7A5B] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#1F1813]">
              Application Submitted Successfully!
            </h3>
            <p className="text-xs text-[#6B5E52] max-w-md mx-auto">
              Congratulations <strong className="text-[#1F1813]">{appForm.firstName} {appForm.lastName}</strong>! Your soft pre-approval score of <strong className="text-[#3F7A5B]">{appForm.creditScore}</strong> qualifies for our Tier-1 Preferred APR rate of <strong className="text-[#8B5A2B]">{interestRate}%</strong>.
            </p>
            <p className="text-xs text-[#6B5E52]">
              A senior finance director will contact <span className="underline">{appForm.email}</span> within 20 minutes to finalize your terms.
            </p>
            <button
              type="button"
              onClick={() => setSubmittedApp(false)}
              className="px-6 py-2.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Modify Application Details
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitApp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={appForm.firstName}
                onChange={(e) => setAppForm({ ...appForm, firstName: e.target.value })}
                placeholder="e.g. Julian"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={appForm.lastName}
                onChange={(e) => setAppForm({ ...appForm, lastName: e.target.value })}
                placeholder="e.g. Sterling"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={appForm.email}
                onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                placeholder="julian@sterlingholdings.com"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={appForm.phone}
                onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                placeholder="+44 20 7946 0912"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Estimated Credit Score Tier
              </label>
              <select
                value={appForm.creditScore}
                onChange={(e) => setAppForm({ ...appForm, creditScore: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              >
                <option value="750+ (Excellent)">750+ Excellent (Tier 1 Prime)</option>
                <option value="700 - 749 (Good)">700 - 749 Good</option>
                <option value="650 - 699 (Fair)">650 - 699 Fair</option>
                <option value="Corporate Account">Corporate / Enterprise Entity</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Target Vehicle Model
              </label>
              <input
                type="text"
                value={appForm.desiredModel}
                onChange={(e) => setAppForm({ ...appForm, desiredModel: e.target.value })}
                placeholder="e.g. Audi RS6 Avant or BMW M8"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                Submit Pre-Approval Application
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};
