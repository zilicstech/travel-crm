'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Building2, UserCheck, ShieldCheck, Mail, Key, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'agency' | 'agent' | 'platform'>('agency');
  const [email, setEmail] = useState('owner@globalexplorer.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'agency',
      title: 'Agency Owner / Manager',
      subtitle: 'Full access to agency profit margins, team roster & financial reports',
      icon: Building2,
      defaultEmail: 'owner@globalexplorer.com',
      redirect: '/agency/dashboard',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'agent',
      title: 'Travel Agent / Staff',
      subtitle: 'Lead management, proposal builder, visa checklist & client vault',
      icon: UserCheck,
      defaultEmail: 'liam@globalexplorer.com',
      redirect: '/agents/dashboard',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'platform',
      title: 'Platform Super Admin',
      subtitle: 'Cross-agency provisioning, multi-tenant system health & analytics',
      icon: ShieldCheck,
      defaultEmail: 'admin@travelos.com',
      redirect: '/platform/dashboard',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const handleRoleSelect = (roleId: 'agency' | 'agent' | 'platform') => {
    setSelectedRole(roleId);
    const target = roles.find(r => r.id === roleId);
    if (target) {
      setEmail(target.defaultEmail);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const currentRole = roles.find(r => r.id === selectedRole);
    setTimeout(() => {
      if (currentRole) {
        router.push(currentRole.redirect);
      } else {
        router.push('/agency/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Unified Single Login Portal
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Sign In to Your<br />
              <span className="text-blue-600">
                Enterprise Dashboard.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Log in to access your specific workspace dashboard instantly. Whether you manage agency financials, sales proposals, or platform administration.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Direct Dashboard Redirection', desc: 'Routes Agency Owners to /agency/dashboard, Agents to /agents/dashboard, and Platform Admins to /platform/dashboard.' },
                { title: 'Bank-Grade Security', desc: 'Encrypted document storage & ISO 27001 certified data protection.' },
                { title: 'Multi-Tenant Architecture', desc: 'Real-time sync across leads, proposals, visa checklists, and invoices.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6 text-left">
              
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Portal Single Sign-In</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    TravelOS CRM
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Select your account role to test workspace dashboard redirection.</p>
              </div>

              {/* Role Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select User Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleSelect(role.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[11px] font-bold leading-tight">{role.id === 'agency' ? 'Owner' : role.id === 'agent' ? 'Agent' : 'Admin'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role Subtitle */}
              {(() => {
                const activeRoleObj = roles.find(r => r.id === selectedRole);
                if (!activeRoleObj) return null;
                const Icon = activeRoleObj.icon;
                return (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeRoleObj.badgeColor} border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{activeRoleObj.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{activeRoleObj.subtitle}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" /> {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-blue-600 hover:underline cursor-pointer font-semibold">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating & Redirecting...' : <>Sign In to Dashboard <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {/* Direct Workspace Links */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-1">
                <p className="text-[11px] text-slate-400 font-semibold">Direct Dashboard Shortcuts:</p>
                <div className="flex items-center justify-center gap-3 text-xs font-bold">
                  <Link href="/agency/dashboard" className="text-blue-600 hover:underline">/agency/dashboard</Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/agents/dashboard" className="text-emerald-600 hover:underline">/agents/dashboard</Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/platform/dashboard" className="text-purple-600 hover:underline">/platform/dashboard</Link>
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
