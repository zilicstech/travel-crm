'use client';

import React, { useState } from 'react';
import { initialBookings, initialCustomers } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plane, Hotel, Package, FileText, Filter } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Flight: <Plane className="w-3 h-3" />,
  Hotel: <Hotel className="w-3 h-3" />,
  Package: <Package className="w-3 h-3" />,
  Visa: <FileText className="w-3 h-3" />,
};

const TYPE_COLORS: Record<string, string> = {
  Flight: 'bg-blue-50 text-blue-700',
  Hotel: 'bg-purple-50 text-purple-700',
  Package: 'bg-emerald-50 text-emerald-700',
  Visa: 'bg-amber-50 text-amber-700',
};

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-blue-100 text-blue-700',
};

const PAYMENT_COLORS: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Partial: 'bg-amber-100 text-amber-700',
  Pending: 'bg-red-100 text-red-700',
  Refunded: 'bg-slate-100 text-slate-600',
};

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgencyBookingsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = initialBookings
    .filter(b => typeFilter === 'All' || b.type === typeFilter)
    .filter(b => statusFilter === 'All' || b.bookingStatus === statusFilter);

  const totalSelling = filtered.reduce((s, b) => s + b.sellingPrice, 0);
  const totalProfit = filtered.reduce((s, b) => s + b.profit, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p><p className="text-2xl font-bold text-slate-900 mt-1">{filtered.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p><p className="text-2xl font-bold text-slate-900 mt-1">{formatINR(totalSelling)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Profit</p><p className="text-2xl font-bold text-green-700 mt-1">{formatINR(totalProfit)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p><p className="text-2xl font-bold text-amber-600 mt-1">{filtered.filter(b => b.bookingStatus === 'Pending').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 gap-4 flex-wrap">
          <CardTitle className="text-sm font-bold text-slate-900">All Bookings</CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="h-8 px-2.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Package">Package</option>
                <option value="Visa">Visa</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-8 px-2.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">PNR</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Journey</th>
                <th className="px-4 py-3 text-right">Net Cost</th>
                <th className="px-4 py-3 text-right">Selling</th>
                <th className="px-4 py-3 text-right">Profit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => {
                const customer = initialCustomers.find(c => c.id === b.customerId);
                return (
                  <tr key={b.id} className={`hover:bg-slate-50 transition-colors ${b.bookingStatus === 'Cancelled' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-bold text-sm text-slate-900">{b.id}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[b.type]}`}>
                        {TYPE_ICONS[b.type]} {b.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">{customer?.name || '–'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{b.destination}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{b.pnr || '–'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{b.supplier}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{b.journeyDate}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">{formatINR(b.netCost)}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{formatINR(b.sellingPrice)}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-green-700">{formatINR(b.profit)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[b.bookingStatus]}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${PAYMENT_COLORS[b.paymentStatus]}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="px-6 py-12 text-center text-sm text-slate-400">No bookings found for this filter.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
