'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialClientInvoices as initialInvoices, getClientById } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Filter, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CURRENT_AGENT_ID = '1';

const STATUS_COLORS: Record<string, string> = {
  Paid: 'green',
  Partial: 'amber',
  Pending: 'red',
};

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgentsInvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = initialInvoices
    .filter(inv => inv.agentId === CURRENT_AGENT_ID)
    .filter(inv => statusFilter === 'All' || inv.status === statusFilter);

  const totalInvoiced = filtered.reduce((s, inv) => s + inv.totalWithGst, 0);
  const totalPaid = filtered.reduce((s, inv) => s + inv.amountPaid, 0);
  const totalPending = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Invoices</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} total invoices</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <span className="metric-label">Total Invoiced</span>
          <p className="metric-value">{formatINR(totalInvoiced)}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Paid</span>
          <p className="metric-value text-emerald-700">{formatINR(totalPaid)}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Outstanding</span>
          <p className="metric-value text-red-600">{formatINR(totalPending)}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 gap-4 flex-wrap">
          <CardTitle>My Invoices</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-36"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client</th>
                  <th>Dates</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Paid</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const client = getClientById(inv.clientId);
                  
                  return (
                    <tr key={inv.id}>
                      <td className="font-bold text-slate-900">{inv.id}</td>
                      <td>
                        <Link href={`/agents/clients/${inv.clientId}`} className="text-sm font-medium text-slate-900 hover:text-blue-600">
                          {client?.name || 'Unknown'}
                        </Link>
                      </td>
                      <td>
                        <div className="text-sm text-slate-900">Issue: {inv.date}</div>
                        <div className={`text-xs mt-0.5 ${new Date(inv.dueDate) < new Date() && inv.status !== 'Paid' ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                          Due: {inv.dueDate}
                        </div>
                      </td>
                      <td className="text-right text-sm font-bold text-slate-900">{formatINR(inv.totalWithGst)}</td>
                      <td className="text-right text-sm font-medium text-emerald-700">{formatINR(inv.amountPaid)}</td>
                      <td>
                        <Badge variant={STATUS_COLORS[inv.status] as any}>{inv.status}</Badge>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="xs" className="text-slate-500"><Download className="w-3.5 h-3.5" /></Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-sm text-slate-400">No invoices found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
