'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialLeads, Lead, getClientById } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, LeadStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddLeadModal } from '@/components/shared/AddLeadModal';
import { Select } from '@/components/ui/Select';
import { Plus, Search, ChevronRight, UserPlus } from 'lucide-react';

const CURRENT_AGENT_ID = '1';

export default function AgentsLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads.filter(l => l.assignedTo === CURRENT_AGENT_ID));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = leads.filter(lead => {
    const client = getClientById(lead.clientId);
    const matchSearch = (client?.name.toLowerCase().includes(search.toLowerCase())) || 
                        lead.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} total leads</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by client name or destination..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-40">
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Booked">Booked</option>
          <option value="Lost">Lost</option>
        </Select>
      </div>

      {/* Leads List */}
      {filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client / Destination</th>
                    <th>Travel Dates</th>
                    <th>Travellers</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => {
                    const client = getClientById(lead.clientId);
                    const totalTravellers = lead.travellers.length;
                    const confirmedTravellers = lead.travellers.filter(t => t.status === 'Confirmed').length;
                    
                    return (
                      <tr key={lead.id}>
                        <td>
                          <Link href={`/agents/leads/${lead.id}`} className="font-medium text-slate-900 hover:text-blue-600 transition-colors">
                            {client?.name || 'Unknown Client'}
                          </Link>
                          <div className="text-xs text-slate-500 mt-0.5">{lead.destination}</div>
                        </td>
                        <td>
                          <div className="text-sm text-slate-600">{lead.travelDateFrom}</div>
                          <div className="text-xs text-slate-400">to {lead.travelDateTo}</div>
                        </td>
                        <td>
                          {totalTravellers > 0 ? (
                            <div className="text-sm text-slate-600">
                              <span className="font-medium">{confirmedTravellers}</span> of {totalTravellers} confirmed
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">None yet</span>
                          )}
                        </td>
                        <td><LeadStatusBadge status={lead.status} /></td>
                        <td className="text-right">
                          <Link href={`/agents/leads/${lead.id}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={UserPlus}
            title="No leads found"
            description="Create your first lead or try adjusting your search filters."
            action={{ label: 'Add Lead', onClick: () => setShowAddModal(true) }}
          />
        </Card>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)}
        currentAgentId={CURRENT_AGENT_ID}
        onLeadCreated={(lead) => {
          setLeads([lead, ...leads]);
        }}
      />
    </div>
  );
}
