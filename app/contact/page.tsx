'use client';

import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function PublicContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agencyName: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 text-left">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold inline-flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" /> TravelOS Sales & Support
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Get in Touch with Our CRM Experts
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Have questions about TravelOS features, agency onboarding, custom integrations, or pricing plans? Send us an inquiry below.
            </p>
          </div>
        </div>

        {/* Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-lg space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">CRM Pricing & Demo Inquiry</h3>
                <p className="text-xs text-slate-500 mt-1">Fill out the form below and our sales engineering team will reach out to you shortly.</p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-base text-emerald-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Message Sent Successfully!
                  </div>
                  <p>Thank you for inquiring. An Enterprise Account Specialist has been assigned to your request and will contact you via email / phone.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Davis"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Work Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@globalexplorer.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Agency Name & Team Size</label>
                      <input
                        type="text"
                        value={formData.agencyName}
                        onChange={e => setFormData({ ...formData, agencyName: e.target.value })}
                        placeholder="Global Explorer Travels (6 Agents)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">How can we help your agency? *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your agency setup, monthly leads volume, or specific CRM requirements..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    Submit Pricing Request <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Support Hotline & Offices */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" /> Sales Hotlines
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Toll-Free Sales:</span>
                    <span className="text-slate-900 font-bold">+91 1800 572 9000</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">WhatsApp Support:</span>
                    <span className="text-emerald-700 font-bold">+91 98765 00000</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Email Desk:</span>
                    <span className="text-blue-600 font-bold">sales@travelos.com</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Corporate Headquarters
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <h5 className="font-bold text-slate-900">Mumbai HQ (India)</h5>
                    <p className="mt-0.5">Level 12, Express Towers, Nariman Point, Mumbai 400021</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <h5 className="font-bold text-slate-900">Singapore Office</h5>
                    <p className="mt-0.5">Marina One East Tower, 7 Straits View, Singapore 018936</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
