'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialVisas, getClientById, getAgentById } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Filter, FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Approved: <CheckCircle2 className="w-3.5 h-3.5" />,
  'In Process': <Clock className="w-3.5 h-3.5" />,
  'Docs Pending': <AlertTriangle className="w-3.5 h-3.5" />,
  Rejected: <XCircle className="w-3.5 h-3.5" />,
};

const STATUS_COLORS: Record<string, string> = {
  Approved: 'green',
  'In Process': 'blue',
  'Docs Pending': 'amber',
  Rejected: 'red',
};

export default function AgencyVisaPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = initialVisas
    .filter(v => statusFilter === 'All' || v.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Visa Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} total applications</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" /> New Application
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <span className="metric-label">Approved</span>
          <p className="metric-value text-emerald-700">{initialVisas.filter(v => v.status === 'Approved').length}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">In Process</span>
          <p className="metric-value text-blue-600">{initialVisas.filter(v => v.status === 'In Process').length}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Docs Pending</span>
          <p className="metric-value text-amber-600">{initialVisas.filter(v => v.status === 'Docs Pending').length}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Rejected</span>
          <p className="metric-value text-red-600">{initialVisas.filter(v => v.status === 'Rejected').length}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 gap-4 flex-wrap">
          <CardTitle>All Visa Applications</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="All">All Statuses</option>
              <option value="Docs Pending">Docs Pending</option>
              <option value="In Process">In Process</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Client</th>
                  <th>Traveller</th>
                  <th>Agent</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(visa => {
                  const client = getClientById(visa.clientId);
                  const agent = getAgentById(visa.agentId);
                  
                  return (
                    <tr key={visa.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-900">{visa.country}</span>
                        </div>
                      </td>
                      <td>
                        <Link href={`/agency/clients/${visa.clientId}`} className="text-sm font-medium text-slate-900 hover:text-blue-600">
                          {client?.name || 'Unknown'}
                        </Link>
                      </td>
                      <td className="text-sm text-slate-700 font-medium">{visa.clientName}</td>
                      <td className="text-sm text-slate-600">{agent?.name || 'Unknown'}</td>
                      <td className="text-sm text-slate-600">{visa.applicationDate || 'Not Submitted'}</td>
                      <td>
                        <div className="inline-flex items-center gap-1.5">
                          <Badge variant={STATUS_COLORS[visa.status] as any}>
                            <span className="flex items-center gap-1">
                              {STATUS_ICONS[visa.status]} {visa.status}
                            </span>
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400">No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
