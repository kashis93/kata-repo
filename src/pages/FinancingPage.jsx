import React, { useState } from 'react';
import { DollarSign, Calculator, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const FinancingPage = () => {
  const [vehiclePrice, setVehiclePrice] = useState(15000000);
  const [downPayment, setDownPayment] = useState(3000000);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(8.5);

  const loanAmount = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = monthlyRate > 0 && loanTermMonths > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
    : loanAmount / (loanTermMonths || 1);

  return (
    <div className="py-8 space-y-10 font-sans animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-[#F6F0E6] border border-[#E5DCCF] text-xs font-bold font-mono text-[#8B5A2B] uppercase tracking-wider">
          TAILORED FINANCIAL STRUCTURES
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#1F1813]">
          Luxury Vehicle Financing & Leasing
        </h1>
        <p className="text-xs text-[#6B5E52] leading-relaxed">
          Custom lease arrangements, low-rate luxury financing, flexible balloon options, and discreet private client portfolio advisory.
        </p>
      </div>

      {/* Calculator & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Calculator Box */}
        <div className="lg:col-span-7 bg-white border border-[#E5DCCF] rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E5DCCF] pb-4">
            <div className="p-2.5 rounded-2xl bg-[#F8F4EC] text-[#8B5A2B]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#1F1813]">Payment Estimator</h3>
              <p className="text-xs text-[#6B5E52]">Adjust variables to calculate estimated monthly investment</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#1F1813] mb-1">
                <span>Vehicle Acquisition Cost</span>
                <span className="text-[#8B5A2B] font-display">{formatINR(vehiclePrice)}</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="50000000"
                step="500000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-[#8B5A2B]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1F1813] mb-1">
                <span>Down Payment / Trade-in Value</span>
                <span className="text-[#8B5A2B] font-display">{formatINR(downPayment)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={vehiclePrice * 0.8}
                step="250000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-[#8B5A2B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">Term Length</label>
                <select
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] font-bold"
                >
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                  <option value={72}>72 Months (6 Years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">Estimated APR (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="3"
                  max="18"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#8B5A2B] uppercase tracking-wider block">
              ESTIMATED MONTHLY INSTALLMENT
            </span>

            <div className="text-4xl font-bold font-display text-[#1F1813]">
              {formatINR(Math.round(monthlyPayment))} <span className="text-xs text-[#6B5E52] font-normal">/ month</span>
            </div>

            <div className="p-4 bg-white border border-[#E5DCCF] rounded-2xl space-y-2 text-xs font-sans text-[#1F1813]">
              <div className="flex justify-between py-1 border-b border-[#E5DCCF]">
                <span className="text-[#6B5E52]">Principal Financed:</span>
                <span className="font-bold">{formatINR(loanAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5DCCF]">
                <span className="text-[#6B5E52]">Total Term:</span>
                <span className="font-bold">{loanTermMonths} Months</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B5E52]">Annual Interest Rate:</span>
                <span className="font-bold">{interestRate}%</span>
              </div>
            </div>
          </div>

          <a
            href="#/contact"
            className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
          >
            <FileText className="w-4 h-4" />
            <span>Apply for Pre-Approval</span>
          </a>
        </div>

      </div>

    </div>
  );
};
