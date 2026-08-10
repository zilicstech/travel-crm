'use client';

import React from 'react';
import { initialAgents, initialBookings, initialLeads, initialCustomers, initialClientInvoices } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, UserPlus, AlertTriangle, DollarSign, Target, ArrowRight, Calendar } from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

// Computed metrics
const totalRevenue = initialBookings.reduce((s, b) => s + b.sellingPrice, 0);
const totalProfit = initialBookings.reduce((s, b) => s + b.profit, 0);
const totalNetCost = initialBookings.reduce((s, b) => s + b.netCost, 0);
const activeClients = initialCustomers.filter(c => c.status === 'Customer').length;
const totalLeads = initialLeads.length;
const bookedLeads = initialLeads.filter(l => l.status === 'Booked').length;
const lostLeads = initialLeads.filter(l => l.status === 'Lost').length;
const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;
const pendingPayments = initialClientInvoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.totalWithGst - i.amountPaid), 0);
const overdueFollowUps = initialLeads.filter(l => l.followUpDate && new Date(l.followUpDate) < new Date() && l.status !== 'Booked' && l.status !== 'Lost').length;
const pendingBookings = initialBookings.filter(b => b.bookingStatus === 'Pending').length;
const confirmedBookings = initialBookings.filter(b => b.bookingStatus === 'Confirmed').length;

const monthlyRevenue = [
  { name: 'Jan', revenue: 280000 }, { name: 'Feb', revenue: 350000 }, { name: 'Mar', revenue: 420000 },
  { name: 'Apr', revenue: 380000 }, { name: 'May', revenue: 510000 }, { name: 'Jun', revenue: 620000 },
  { name: 'Jul', revenue: totalRevenue },
];

// Pipeline funnel data
const pipelineData = [
  { stage: 'New', count: initialLeads.filter(l => l.status === 'New').length, color: '#3b82f6' },
  { stage: 'Contacted', count: initialLeads.filter(l => l.status === 'Contacted').length, color: '#06b6d4' },
  { stage: 'Qualified', count: initialLeads.filter(l => l.status === 'Qualified').length, color: '#6366f1' },
  { stage: 'Proposal Sent', count: initialLeads.filter(l => l.status === 'Proposal Sent').length, color: '#a855f7' },
  { stage: 'Negotiating', count: initialLeads.filter(l => l.status === 'Negotiating').length, color: '#f59e0b' },
  { stage: 'Booked', count: initialLeads.filter(l => l.status === 'Booked').length, color: '#22c55e' },
  { stage: 'Lost', count: initialLeads.filter(l => l.status === 'Lost').length, color: '#94a3b8' },
];

export default function AgencyDashboard() {
  return (
    <div className="space-y-6">
      {/* Row 1: Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p><TrendingUp className="w-4 h-4 text-green-600" /></div>
          <p className="text-xl font-bold text-slate-900">{formatINR(totalRevenue)}</p>
          <p className="text-[10px] text-green-600 font-semibold mt-0.5">This month</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Profit</p><DollarSign className="w-4 h-4 text-emerald-600" /></div>
          <p className="text-xl font-bold text-emerald-700">{formatINR(totalProfit)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Margin: {((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p><Briefcase className="w-4 h-4 text-purple-600" /></div>
          <p className="text-xl font-bold text-slate-900">{initialBookings.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{confirmedBookings} confirmed · {pendingBookings} pending</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Clients</p><Users className="w-4 h-4 text-blue-600" /></div>
          <p className="text-xl font-bold text-slate-900">{activeClients}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{initialCustomers.length} total</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Conversion</p><Target className="w-4 h-4 text-amber-600" /></div>
          <p className="text-xl font-bold text-slate-900">{conversionRate}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{bookedLeads}/{totalLeads} leads</p>
        </CardContent></Card>
        <Card className={pendingPayments > 0 ? 'border-red-200 bg-red-50/30' : ''}><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payments</p><AlertTriangle className="w-4 h-4 text-red-500" /></div>
          <p className="text-xl font-bold text-red-700">{formatINR(pendingPayments)}</p>
          <p className="text-[10px] text-red-500 font-semibold mt-0.5">{overdueFollowUps} overdue follow-ups</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm font-bold text-slate-900">Monthly Revenue (₹)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{fill: '#64748b', fontSize: 11}} />
                  <Tooltip formatter={(v: any) => formatINR(Number(v))} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Pipeline Funnel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900">Lead Pipeline</CardTitle>
            <span className="text-xs text-slate-500 font-medium">{totalLeads} total</span>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {pipelineData.map(stage => (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600 w-24 flex-shrink-0 truncate">{stage.stage}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 relative overflow-hidden">
                  <div className="h-full rounded-full transition-all flex items-center px-2" style={{ width: `${Math.max(totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0, 8)}%`, backgroundColor: stage.color }}>
                    <span className="text-[10px] font-bold text-white">{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Snapshot */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900">Employee Performance Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                <th className="px-6 py-3">Employee</th>
                <th className="px-4 py-3">Dept</th>
                <th className="px-4 py-3 text-right">Leads</th>
                <th className="px-4 py-3 text-right">Bookings</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3 text-right">Conv %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialAgents.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">{a.name.split(' ').map(n=>n[0]).join('')}</div>
                      <span className="text-sm font-bold text-slate-900">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-medium">{a.department}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-700">{a.leadsAssigned}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{a.bookings}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{formatINR(a.revenueGenerated)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${a.conversionPercent >= 70 ? 'text-green-600' : a.conversionPercent >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{a.conversionPercent}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
