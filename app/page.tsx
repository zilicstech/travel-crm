'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { 
  Plane, Building2, UserCheck, ShieldCheck, ArrowRight, CheckCircle2, 
  Users, BarChart3, Shield, Zap, Clock, Sparkles, ChevronRight, 
  HelpCircle, CreditCard, Send, Lock, Award, Globe, FileText
} from 'lucide-react';

export default function EnterpriseSaaSPage() {
  const [activeTab, setActiveTab] = useState<'vault' | 'proposals' | 'visa' | 'analytics'>('vault');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is TravelOS and who is it designed for?',
      a: 'TravelOS is a dedicated enterprise B2B SaaS CRM software platform engineered specifically for travel agencies, tour operators, and destination management companies (DMCs). It replaces fragmented spreadsheets with unified client vaults, proposal builders, visa checklists, and invoicing.'
    },
    {
      q: 'How does TravelOS track individual travellers inside a client group?',
      a: 'Unlike generic CRMs, TravelOS allows you to record every individual traveller within a client group or corporate entity. It tracks date of birth, passport numbers, passport expiry dates (with automatic 6-month expiry flags before trip departure), and per-traveller visa checklist statuses.'
    },
    {
      q: 'How do role-based workspaces work at /login?',
      a: 'TravelOS features a single login portal (/login) that routes users according to their permission role: Agency Owners access financial reports and team rosters at /agency, Travel Agents manage leads and proposals at /agents, and Super Admins manage multi-tenant provisioning at /platform.'
    },
    {
      q: 'How can I request pricing for my travel agency?',
      a: 'You can submit an inquiry through our "Inquire Pricing" form on this page or visit /pricing to request a customized quote based on your agency team size and requirements.'
    }
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      <main className="flex-1 text-left">
        
        {/* ========================================================================= */}
        {/* LIGHT ENTERPRISE HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
            
            {/* Tagline & Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Enterprise Travel Agency CRM Platform
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                The Operating System for<br />
                <span className="text-blue-600">Modern Travel Agencies.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Streamline client management, itemized itinerary proposals, per-traveller visa checklists, and agency billing — all from one powerful enterprise SaaS platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => { setInquiryModalOpen(true); setInquirySubmitted(false); }}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Building2 className="w-4 h-4" /> Schedule Demo & Request Pricing
                </button>
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="h-12 px-8 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 w-full">
                    Agency Login (/login) <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Interactive SaaS CRM Module Showcase Card */}
            <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 space-y-6">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
                {[
                  { id: 'vault', label: 'Client & Traveller Vault', icon: Users },
                  { id: 'proposals', label: 'Proposal & Margin Engine', icon: FileText },
                  { id: 'visa', label: 'Per-Traveller Visa Tracker', icon: ShieldCheck },
                  { id: 'analytics', label: 'Agency Owner Analytics', icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Module Preview Area */}
              {activeTab === 'vault' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">Module Demo</span>
                      <h3 className="text-lg font-bold text-slate-900">Ajay Sharma Family & Friends Group (Client C1)</h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                      4 Travellers Active
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">Ajay Sharma (Self)</p>
                        <p className="text-[11px] text-slate-500">Passport: L9876543 (Exp: 2032)</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">OK</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">Sanya Sharma (Spouse)</p>
                        <p className="text-[11px] text-slate-500">Passport: M1234567 (Exp: Mar 2027)</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded">6-Mo Warning</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'proposals' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">Proposal Builder</span>
                      <h3 className="text-lg font-bold text-slate-900">Bangkok & Phuket 7-Day Package (Lead L1)</h3>
                    </div>
                    <span className="text-base font-black text-blue-600">Margin: ₹34,000</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                      <span>IndiGo Mumbai – Bangkok Return Flight</span>
                      <span className="font-bold text-slate-900">Net: ₹45,000 | Selling: ₹52,000</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                      <span>Anantara Riverside Bangkok (7 Nights)</span>
                      <span className="font-bold text-slate-900">Net: ₹1,20,000 | Selling: ₹1,45,000</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visa' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">Visa Tracking Vault</span>
                      <h3 className="text-lg font-bold text-slate-900">Japan Tourist Visa (Case V1 - Elena Rodriguez)</h3>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">In Progress</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200">✓ Passport Collected</div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200">✓ Photos Verified</div>
                    <div className="p-2.5 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200">⏳ Embassy Form Pending</div>
                    <div className="p-2.5 bg-slate-100 text-slate-500 font-bold rounded-xl border border-slate-200">Appointment Scheduled</div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">Agency Owner Dashboard</span>
                      <h3 className="text-lg font-bold text-slate-900">Global Explorer Travels Revenue KPI</h3>
                    </div>
                    <span className="text-xl font-black text-emerald-600">₹4,85,000 / mo</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-center">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block">Total Bookings</span>
                      <span className="text-lg font-bold text-slate-900 mt-0.5 block">14 Confirmed</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block">Avg Conversion</span>
                      <span className="text-lg font-bold text-emerald-600 mt-0.5 block">78% Rate</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block">Outstanding Invoices</span>
                      <span className="text-lg font-bold text-amber-600 mt-0.5 block">₹1,21,100</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PRICING TIERS SUMMARY */}
        {/* ========================================================================= */}
        <section className="py-20 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Predictable Agency SaaS Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Plans Tailored for Travel Companies of Any Size
              </h2>
              <p className="text-sm text-slate-600">
                Choose a plan for your team size. Inquire today for custom pricing quotes and onboarding assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Starter Plan', price: '₹2,499', period: '/ mo', seats: 'Up to 3 Agents', desc: 'Ideal for independent travel consultants and boutique agencies.', features: ['Up to 250 Client Vaults', 'Proposal Builder', 'GST Invoices'] },
                { name: 'Growth Plan', price: '₹5,999', period: '/ mo', seats: 'Up to 10 Agents', desc: 'Built for growing travel agencies looking to scale bookings.', popular: true, features: ['Unlimited Client & Member Vaults', 'Passport 6-Mo Expiry Alerts', 'Visa Checklist Tracker', 'Owner & Agent Dashboards'] },
                { name: 'Enterprise Plan', price: 'Custom Quote', period: 'Annual', seats: 'Unlimited Agents & DMCs', desc: 'Custom CRM setup for large DMCs and multi-branch agencies.', features: ['Multi-Branch Tenant Controls', 'Custom GDS & Inventory API', 'Dedicated Account Manager', '99.99% SLA Uptime'] },
              ].map((p, idx) => (
                <div key={idx} className={`bg-white rounded-3xl p-8 border transition-all shadow-md flex flex-col justify-between space-y-6 ${p.popular ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200'}`}>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.desc}</p>
                    <div className="py-2 border-y border-slate-100">
                      <span className="text-2xl font-black text-slate-900">{p.price}</span>
                      <span className="text-xs text-slate-500 ml-1">{p.period}</span>
                      <p className="text-xs font-bold text-blue-600 mt-0.5">{p.seats}</p>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/pricing">
                    <button className="w-full h-11 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors">
                      Inquire Pricing & Features →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SAAS MODULES GRID */}
        {/* ========================================================================= */}
        <section id="modules" className="py-20 border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Enterprise Modules</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything You Need to Run Your Travel Business
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Users, title: 'Client & Traveller Vault', desc: 'Track main accounts and every individual member. Passport 6-month expiry warning prevents booking issues.' },
                { icon: FileText, title: 'Itemized Proposal Engine', desc: 'Combine flights, hotels, transfers & visa fees into a shareable link with net cost & profit margin calculations.' },
                { icon: ShieldCheck, title: 'Per-Traveller Visa Tracker', desc: 'Monitor document collection, embassy submissions, appointments, and approvals per traveller.' },
                { icon: BarChart3, title: 'Revenue & KPI Analytics', desc: 'Real-time dashboard for monthly revenues, agent leaderboards, conversion funnels, and pending invoices.' },
                { icon: CreditCard, title: 'GST Invoicing & Accounting', desc: 'Generate professional GST invoices for clients and track supplier payables across bookings.' },
                { icon: Zap, title: 'Unified Single Login Portal', desc: 'Single sign-in at /login automatically routes Agency Owners to /agency, Agents to /agents, and Admins to /platform.' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INQUIRE PRICING & DEMO FORM */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-6 shadow-2xl">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Schedule a Personalized Demo</span>
                <h2 className="text-3xl font-extrabold text-white">Inquire CRM Pricing & Setup</h2>
                <p className="text-xs text-slate-400">Fill in your details below and our sales engineering team will get back to you within 15 minutes.</p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-base font-bold text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Request Submitted Successfully!
                  </div>
                  <p>Our travel software specialist will contact you with custom pricing quotes and demo access.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Your Full Name *</label>
                      <input type="text" required placeholder="John Davis" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Work Email Address *</label>
                      <input type="email" required placeholder="john@globalexplorer.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Phone / WhatsApp *</label>
                      <input type="text" required placeholder="+91 98765 43210" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Agency Name & Team Size *</label>
                      <input type="text" required placeholder="Global Explorer Travels (8 Agents)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                    </div>
                  </div>

                  <button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                    Submit Pricing Request <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SEO FAQ ACCORDION */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">CRM FAQs</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-lg font-black text-slate-400">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Inquiry Modal Popup */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 text-left relative shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Schedule Agency Demo</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Request Pricing & Trial Access</h3>
              </div>
              <button onClick={() => setInquiryModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1">✕</button>
            </div>

            {inquirySubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inquiry Submitted!
                </div>
                <p>Our sales team will contact you shortly with customized pricing details.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="John Davis" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email Address *</label>
                  <input type="email" required placeholder="john@globalexplorer.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agency Name & Phone *</label>
                  <input type="text" required placeholder="Global Explorer Travels (+91 98765 43210)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900" />
                </div>
                <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-2">
                  <Send className="w-4 h-4" /> Send Request
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
