'use client';

import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Hotel, CheckCircle2, ShieldCheck, Building2, Send, Layers } from 'lucide-react';

export default function HotelModulePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 text-left">
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold inline-flex items-center gap-1.5">
              <Hotel className="w-4 h-4 text-blue-600" /> Direct Hotel Contracting & Inventory Module
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Manage Hotel Vouchers & DMC Contracts.
            </h1>
            <p className="text-base text-slate-600 max-w-3xl">
              Organize direct hotel contracts, room meal inclusions, net rates, and voucher generation for your agency clients.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Hotel className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Hotel Voucher Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate branded hotel check-in vouchers with custom room categories, meal plans (CP/MAP/AP), and cancellation policies.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Direct DMC Contracting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Store net rates from local DMCs in Thailand, Dubai, Bali, and Europe to quickly construct multi-hotel proposals.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Payable & Receivables Sync</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track supplier payment due dates alongside client invoice payments to ensure zero cash flow bottlenecks.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Request Hotel Module Demo & Pricing</h3>
              <p className="text-xs text-slate-400">Fill in your details for custom CRM setup & pricing quotes.</p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs text-center">
                ✓ Request Received! Our product team will contact you.
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-3 text-xs">
                <input type="text" required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                <input type="email" required placeholder="Work Email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                <input type="text" required placeholder="Agency Name & City" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Inquire Hotel Module Pricing
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
