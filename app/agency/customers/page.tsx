'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialCustomers } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, User, Phone, Mail, MapPin, Tag, ChevronRight, ChevronLeft, Plus } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type CustomerStatus = 'Customer' | 'Lead' | 'VIP' | 'Corporate';

interface NewCustomer {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  preferredAirline: string;
  preferredCabin: string;
  status: CustomerStatus;
  tags: string[];
  notes: string;
}

const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },
  { code: '+1',  label: 'US +1' },
  { code: '+44', label: 'GB +44' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
];

const PRESET_TAGS = ['VIP', 'Repeat', 'High Budget', 'Family', 'Honeymoon', 'Corporate', 'Senior', 'Solo'];

const EMPTY_CUSTOMER: NewCustomer = {
  name: '', countryCode: '+91', phone: '', email: '',
  dateOfBirth: '', gender: '',
  city: '', country: 'India', passportNumber: '', passportExpiry: '', nationality: 'Indian',
  preferredAirline: '', preferredCabin: 'Economy',
  status: 'Customer', tags: [], notes: '',
};

// ── Modal ──────────────────────────────────────────────────────────────────────

function AddCustomerModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (c: typeof initialCustomers[0]) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewCustomer>(EMPTY_CUSTOMER);
  const [tagInput, setTagInput] = useState('');

  const set = (field: keyof NewCustomer, val: string | string[]) =>
    setForm(f => ({ ...f, [field]: val }));

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const addCustomTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };

  const isStep1Valid = form.name.trim() && form.phone.trim() && form.email.trim();

  const handleSubmit = () => {
    const newCustomer = {
      id: `C${Date.now()}`,
      agentId: '1',
      name: form.name,
      email: form.email,
      phone: `${form.countryCode}${form.phone}`,
      status: form.status,
      tags: form.tags,
      pastBookings: [],
      documents: [],
      interactions: form.notes.trim()
        ? [{ id: `I${Date.now()}`, date: new Date().toISOString().split('T')[0], note: form.notes }]
        : [],
      familyMembers: [],
    };
    onAdd(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Customer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Step {step} of 3 — {
              step === 1 ? 'Personal Details' : step === 2 ? 'Travel Profile' : 'CRM Tags & Notes'
            }</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex px-6 pt-4 gap-1.5 flex-shrink-0">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <User className="w-3 h-3 inline mr-1" /> Full Name *
                </label>
                <Input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g., Rajesh Kumar" className="h-10 text-sm" autoFocus />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Phone className="w-3 h-3 inline mr-1" /> Mobile Number *
                </label>
                <div className="flex gap-2">
                  <select value={form.countryCode} onChange={e => set('countryCode', e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-2 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-blue-600 focus:outline-none flex-shrink-0">
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <Input value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter mobile number" className="h-10 text-sm flex-1" maxLength={15} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Mail className="w-3 h-3 inline mr-1" /> Email Address *
                </label>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="e.g., rajesh@email.com" className="h-10 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
                  <Input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} className="h-10 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)}
                    className="w-full h-10 text-sm border border-slate-200 rounded-lg px-3 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none text-slate-700">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" /> City
                  </label>
                  <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g., Mumbai" className="h-10 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country</label>
                  <Input value={form.country} onChange={e => set('country', e.target.value)} placeholder="e.g., India" className="h-10 text-sm" />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Travel Profile */}
          {step === 2 && (
            <>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs font-semibold text-blue-700">
                  Travel profile helps auto-fill visa applications and proposals for this customer.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nationality</label>
                <Input value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="e.g., Indian" className="h-10 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Passport Number</label>
                  <Input value={form.passportNumber} onChange={e => set('passportNumber', e.target.value.toUpperCase())}
                    placeholder="e.g., A1234567" className="h-10 text-sm font-mono tracking-wider" maxLength={9} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Passport Expiry</label>
                  <Input type="date" value={form.passportExpiry} onChange={e => set('passportExpiry', e.target.value)} className="h-10 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preferred Airline</label>
                  <Input value={form.preferredAirline} onChange={e => set('preferredAirline', e.target.value)} placeholder="e.g., Emirates" className="h-10 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preferred Cabin</label>
                  <select value={form.preferredCabin} onChange={e => set('preferredCabin', e.target.value)}
                    className="w-full h-10 text-sm border border-slate-200 rounded-lg px-3 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none text-slate-700">
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 3: CRM Tags & Notes */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['Customer', 'Lead', 'VIP', 'Corporate'] as CustomerStatus[]).map(s => (
                    <button key={s} onClick={() => set('status', s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        form.status === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Tag className="w-3 h-3 inline mr-1" /> Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all uppercase tracking-wider ${
                        form.tags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                      }`}>
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomTag()}
                    placeholder="Add custom tag..." className="h-9 text-sm flex-1" />
                  <Button size="sm" variant="outline" onClick={addCustomTag} disabled={!tagInput.trim()}
                    className="h-9 px-3 text-xs border-slate-200 disabled:opacity-40">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                        {tag}
                        <button onClick={() => toggleTag(tag)} className="text-blue-400 hover:text-blue-700 ml-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Initial Note (optional)</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="e.g., Referred by Sarah Jenkins. Interested in Europe trips."
                  className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white min-h-[90px] resize-none" />
              </div>

              {/* Summary preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</p>
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Phone', value: `${form.countryCode} ${form.phone}` },
                  { label: 'Email', value: form.email },
                  { label: 'Status', value: form.status },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="font-semibold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-slate-100 flex-shrink-0">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="h-9 px-4 text-sm font-semibold text-slate-600">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose} className="h-9 px-4 text-sm font-semibold text-slate-600">Cancel</Button>
          )}

          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !isStep1Valid}
              className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStep1Valid}
              className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50">
              Save Customer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AgencyCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const handleAddCustomer = (c: typeof initialCustomers[0]) => {
    setCustomers(prev => [c, ...prev]);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {showModal && (
        <AddCustomerModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddCustomer}
        />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <CardTitle className="text-sm font-bold text-slate-900 flex-shrink-0">Customer Directory</CardTitle>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="h-8 text-sm border border-slate-200 rounded-lg px-3 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none w-64 text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <Button size="sm" onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-shrink-0">
            + Add New Customer
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm text-slate-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      customer.status === 'Customer' ? 'bg-blue-100 text-blue-700' :
                      customer.status === 'VIP' ? 'bg-amber-100 text-amber-700' :
                      customer.status === 'Corporate' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/agency/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        Manage →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    {search ? `No customers matching "${search}"` : 'No customers yet. Add your first one!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
