'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Plane, CheckCircle2, ShieldCheck, ArrowRight, Building2, Send, Layers } from 'lucide-react';

export default function FlightModulePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 text-left">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold inline-flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-blue-600" /> GDS & Airline Flight Integration Module
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Manage Airline Bookings & PNRs in TravelOS CRM.
            </h1>
            <p className="text-base text-slate-600 max-w-3xl">
              Connect your agency's Amadeus, Sabre, and LCC flight inventory directly into TravelOS client proposals and GST invoicing.
            </p>
          </div>
        </div>

        {/* Module Highlights */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Live PNR Import</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Import GDS PNRs directly into client leads to auto-fill flight numbers, route timings, cabin class, and net supplier costs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Margin & Commission Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set custom agent markups or commissions per airline. Calculate exact net cost vs selling price before sharing proposals.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Automated E-Tickets & Invoices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate branded PDF e-tickets and GST invoices with your travel agency logo and WhatsApp sharing links.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Request Flight Module Demo & Pricing</h3>
              <p className="text-xs text-slate-400">Fill in your agency details to check CRM integration options.</p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs text-center">
                ✓ Thank you! Our technical specialist will reach out to discuss GDS connectors.
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-3 text-xs">
                <input type="text" required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                <input type="email" required placeholder="Work Email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                <input type="text" required placeholder="Agency Name & GDS Provider" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Inquire Flight Integration Pricing
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
