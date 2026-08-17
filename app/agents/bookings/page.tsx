'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialBookings, getClientById } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, BookingStatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Plane, Hotel, Package, FileText, Filter } from 'lucide-react';

const CURRENT_AGENT_ID = '1';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Flight: <Plane className="w-3.5 h-3.5" />,
  Hotel: <Hotel className="w-3.5 h-3.5" />,
  Package: <Package className="w-3.5 h-3.5" />,
  Visa: <FileText className="w-3.5 h-3.5" />,
};

const PAYMENT_COLORS: Record<string, string> = {
  Paid: 'green',
  Partial: 'amber',
  Pending: 'red',
  Refunded: 'slate',
};

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgentsBookingsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = initialBookings
    .filter(b => b.agentId === CURRENT_AGENT_ID)
    .filter(b => typeFilter === 'All' || b.type === typeFilter)
    .filter(b => statusFilter === 'All' || b.bookingStatus === statusFilter);

  const totalSelling = filtered.reduce((s, b) => s + b.sellingPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} total bookings</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <span className="metric-label">Total Bookings</span>
          <p className="metric-value">{filtered.length}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Sales</span>
          <p className="metric-value">{formatINR(totalSelling)}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Pending</span>
          <p className="metric-value text-amber-600">{filtered.filter(b => b.bookingStatus === 'Pending').length}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 gap-4 flex-wrap">
          <CardTitle>My Bookings</CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-32"
              >
                <option value="All">All Types</option>
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Package">Package</option>
                <option value="Visa">Visa</option>
              </Select>

              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-36"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID / Client</th>
                  <th>Type & Supplier</th>
                  <th>Destination & Dates</th>
                  <th className="text-right">Selling Price</th>
                  <th>Status & Payment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const client = getClientById(b.clientId);
                  return (
                    <tr key={b.id} className={b.bookingStatus === 'Cancelled' ? 'opacity-60' : ''}>
                      <td>
                        <div className="font-bold text-slate-900">{b.id}</div>
                        <Link href={`/agents/clients/${b.clientId}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                          {client?.name || 'Unknown Client'}
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                          {TYPE_ICONS[b.type]} {b.type}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{b.supplier}</div>
                      </td>
                      <td>
                        <div className="text-sm font-medium text-slate-900">{b.destination}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {b.journeyDate} {b.returnDate ? `— ${b.returnDate}` : ''}
                        </div>
                      </td>
                      <td className="text-right text-sm font-bold text-slate-900">{formatINR(b.sellingPrice)}</td>
                      <td>
                        <div className="flex flex-col items-start gap-1">
                          <BookingStatusBadge status={b.bookingStatus} />
                          <Badge variant={PAYMENT_COLORS[b.paymentStatus] as any}>{b.paymentStatus}</Badge>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-400">No bookings found for this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
