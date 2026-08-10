'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialLeads, initialAgents } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-cyan-100 text-cyan-700',
  Qualified: 'bg-indigo-100 text-indigo-700',
  'Proposal Sent': 'bg-purple-100 text-purple-700',
  Negotiating: 'bg-orange-100 text-orange-700',
  Booked: 'bg-green-100 text-green-700',
  Lost: 'bg-slate-100 text-slate-500',
};

const PRIORITY_COLORS: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-100 text-slate-500',
};

const ALL_STATUSES = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Booked', 'Lost'];

import { AddLeadModal } from '@/components/shared/AddLeadModal';

export default function AgencyLeadsPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [leads, setLeads] = useState(initialLeads);
  const [showModal, setShowModal] = useState(false);

  const filtered = leads.filter(l => statusFilter === 'All' || l.status === statusFilter);

  const handleAddLead = (lead: any) => {
    setLeads(prev => [lead, ...prev]);
  };

  return (
    <div className="space-y-5">
      {showModal && <AddLeadModal onClose={() => setShowModal(false)} onAdd={handleAddLead} />}

      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-sm font-bold text-slate-900">All Leads</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="sm" onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-shrink-0">
                + Add New Lead
              </Button>
            </div>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  statusFilter === s
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s}
                {s !== 'All' && (
                  <span className="ml-1 opacity-60">
                    {leads.filter(l => l.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                <th className="px-6 py-3">Customer</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Categories</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(lead => {
                const agent = initialAgents.find(a => a.id === lead.assignedTo);
                const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== 'Booked' && lead.status !== 'Lost';
                return (
                  <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-3">
                      <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.countryCode} {lead.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.destination}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {lead.categories.map(cat => (
                          <span key={cat} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {agent ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[9px] flex-shrink-0">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-medium text-slate-700">{agent.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-xs font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                      {lead.followUpDate || '–'}
                      {isOverdue && (
                        <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-full">OVERDUE</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${PRIORITY_COLORS[lead.priority]}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/agency/leads/${lead.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          Manage →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">
                    {statusFilter !== 'All' ? 'No leads match your filters.' : 'No leads yet.'}
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
