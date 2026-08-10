'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialLeads, initialCustomers, Lead, LeadCategory, LeadStatus } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, ChevronRight, ChevronLeft, User, Search, Plus, Minus, Clock } from 'lucide-react';

const ALL_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Booked', 'Lost'];

const STATUS_COLORS: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-cyan-100 text-cyan-700',
  'Qualified': 'bg-indigo-100 text-indigo-700',
  'Proposal Sent': 'bg-purple-100 text-purple-700',
  'Negotiating': 'bg-orange-100 text-orange-700',
  'Booked': 'bg-green-100 text-green-700',
  'Lost': 'bg-slate-100 text-slate-500',
};

const CATEGORY_ICONS: Record<LeadCategory, string> = {
  'Holiday Package': '🏖',
  'Hotel': '🏨',
  'Flight': '✈️',
  'Visa': '🛂',
};

function isOverdue(dateString: string) {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

import { AddLeadModal } from '@/components/shared/AddLeadModal';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleAddLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const filteredLeads = statusFilter === 'All' ? leads : leads.filter(l => l.status === statusFilter);

  return (
    <div className="space-y-6">
      {showModal && <AddLeadModal onClose={() => setShowModal(false)} onAdd={handleAddLead} />}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle className="text-sm font-bold text-slate-900">My Leads</CardTitle>
            <div className="flex items-center gap-1 flex-wrap">
              {['All', ...ALL_STATUSES].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    statusFilter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button size="sm" onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-shrink-0">
            + Add New Lead
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Categories</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Follow-up</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const overdue = isOverdue(lead.followUpDate) && lead.status !== 'Booked' && lead.status !== 'Lost';
                return (
                  <tr key={lead.id} className={`transition-colors hover:bg-slate-50 ${overdue ? 'bg-red-50/40' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{lead.countryCode} {lead.phone}</p>
                      {overdue && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full uppercase tracking-wider">
                          Follow-up Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{lead.destination}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {lead.categories.map(cat => (
                          <span key={cat} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                            {CATEGORY_ICONS[cat]} {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{lead.budget}</td>
                    <td className={`px-6 py-4 text-xs font-medium ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                      {lead.followUpDate || '–'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm"
                        onClick={() => router.push(`/agents/leads/${lead.id}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        Manage →
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">No leads found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
