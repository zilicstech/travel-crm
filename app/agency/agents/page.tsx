'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialAgents } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, UserPlus, Search, X } from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');
// formatINR kept — used if needed later


interface AddAgentModalProps {
  onClose: () => void;
}

function AddAgentModal({ onClose }: AddAgentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    alert(`Agent "${name}" added successfully!`);
    onClose();
  };

  const initials = name.trim().split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Agent</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to onboard a new team member</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base flex-shrink-0">
              {initials || <UserPlus className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{name || 'Agent Name'}</p>
              <p className="text-xs text-slate-500">{email || 'email@agency.com'}</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={e => { setName(e.target.value); setErrors(ev => ({ ...ev, name: '' })); }}
              placeholder="e.g., Priya Sharma"
              className={`h-10 text-sm ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(ev => ({ ...ev, email: '' })); }}
              placeholder="e.g., priya@agency.com"
              className={`h-10 text-sm ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={phone}
              onChange={e => { setPhone(e.target.value); setErrors(ev => ({ ...ev, phone: '' })); }}
              placeholder="e.g., +91 98765 43210"
              className={`h-10 text-sm ${errors.phone ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-100 gap-3">
          <Button variant="ghost" onClick={onClose} className="h-9 px-4 text-sm font-semibold text-slate-600">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Add Agent
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AgencyAgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = initialAgents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showModal && <AddAgentModal onClose={() => setShowModal(false)} />}

      {/* Summary KPI */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-slate-900">{initialAgents.length} Agents</span>
        </div>
      </div>

      {/* Agents List */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-sm font-bold text-slate-900">All Agents</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search agents..."
                  className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-1.5" /> Add Agent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filtered.map(agent => (
              <div key={agent.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Name & contact */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{agent.email}</p>
                </div>

                {/* Action */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/agency/agents/${agent.id}`)}
                  className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Manage →
                </Button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-400">No agents found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
