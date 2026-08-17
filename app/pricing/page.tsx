'use client';

import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Send, Users, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Growth Plan');
  const [submitted, setSubmitted] = useState(false);

  const plans = [
    {
      name: 'Starter Plan',
      desc: 'Ideal for independent travel consultants and boutique agencies.',
      price: '₹2,499',
      period: '/ month',
      seats: 'Up to 3 Agents',
      badge: 'Boutique Agencies',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      features: [
        'Up to 250 Active Client Vaults',
        'Unlimited Itemized Proposals',
        'Basic Visa Progress Checklists',
        'GST Invoice Generation',
        'Standard Email Support',
      ]
    },
    {
      name: 'Growth Plan',
      desc: 'Built for growing travel agencies looking to scale bookings.',
      price: '₹5,999',
      period: '/ month',
      seats: 'Up to 10 Agents',
      popular: true,
      badge: 'Most Popular for Agencies',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      features: [
        'Unlimited Client & Member Vaults',
        'Passport 6-Month Expiry Auto-Alerts',
        'Proposal Builder with Margin Accounting',
        'Per-Traveller Visa Progress Tracker',
        'Agency Owner Dashboard (/agency)',
        'Agent Workspace (/agents)',
        'Priority Phone & WhatsApp Support',
      ]
    },
    {
      name: 'Enterprise Plan',
      desc: 'Custom CRM setup for large DMCs, franchises, and enterprise tour operators.',
      price: 'Custom Quote',
      period: 'Billed Annually',
      seats: 'Unlimited Agents & DMCs',
      badge: 'DMCs & Large Agencies',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      features: [
        'Multi-Branch & Tenant Management',
        'Custom GDS & Inventory API Connectors',
        'Dedicated Account Manager & Training',
        'Custom Roles & Audit Logs',
        '99.99% Guaranteed SLA Uptime',
        'White-Label Client Proposals',
      ]
    }
  ];

  const handleInquire = (planName: string) => {
    setSelectedPlan(planName);
    setInquiryModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 text-left">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" /> Transparent B2B SaaS CRM Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Simple, Predictable CRM Plans for Travel Companies.
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Empower your agency owners, sales consultants, and visa operations with TravelOS enterprise software.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`bg-white rounded-3xl p-8 border transition-all shadow-lg flex flex-col justify-between space-y-8 relative ${
                  plan.popular ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Recommended Choice
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-3">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.desc}</p>
                  </div>

                  <div className="py-4 border-y border-slate-100">
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-semibold ml-1">{plan.period}</span>
                    <p className="text-xs font-bold text-blue-600 mt-1">{plan.seats}</p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Included CRM Capabilities:</span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleInquire(plan.name)}
                  className={`w-full h-12 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Inquire Pricing & Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Pricing Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 text-left relative shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">CRM Pricing Inquiry</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedPlan}</h3>
              </div>
              <button onClick={() => { setInquiryModalOpen(false); setSubmitted(false); }} className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1">✕</button>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inquiry Submitted!
                </div>
                <p>Our sales engineer will contact you via email / phone within 15 minutes with complete pricing details.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="John Davis" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email Address *</label>
                  <input type="email" required placeholder="john@globalexplorer.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agency Name & Team Size *</label>
                  <input type="text" required placeholder="Global Explorer Travels (5 Agents)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number / WhatsApp *</label>
                  <input type="text" required placeholder="+91 98765 43210" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-2">
                  <Send className="w-4 h-4" /> Send Pricing Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
