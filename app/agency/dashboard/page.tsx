'use client';

import React from 'react';
import Link from 'next/link';
import { initialAgents, initialBookings, initialLeads, initialClients, initialClientInvoices, getClientById } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LeadStatusBadge } from '@/components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Briefcase, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

// Computed metrics
const totalRevenue = initialBookings.reduce((s, b) => s + b.sellingPrice, 0);
const totalProfit = initialBookings.reduce((s, b) => s + b.profit, 0);
const totalLeads = initialLeads.length;
const bookedLeads = initialLeads.filter(l => l.status === 'Booked').length;
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

const pipelineData = [
  { stage: 'New', count: initialLeads.filter(l => l.status === 'New').length, color: '#3b82f6' },
  { stage: 'Contacted', count: initialLeads.filter(l => l.status === 'Contacted').length, color: '#06b6d4' },
  { stage: 'Qualified', count: initialLeads.filter(l => l.status === 'Qualified').length, color: '#6366f1' },
  { stage: 'Proposal', count: initialLeads.filter(l => l.status === 'Proposal Sent').length, color: '#8b5cf6' },
  { stage: 'Negotiating', count: initialLeads.filter(l => l.status === 'Negotiating').length, color: '#f59e0b' },
  { stage: 'Booked', count: initialLeads.filter(l => l.status === 'Booked').length, color: '#059669' },
  { stage: 'Lost', count: initialLeads.filter(l => l.status === 'Lost').length, color: '#94a3b8' },
];

export default function AgencyDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Agency Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of your agency performance & revenues</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="metric-value">{formatINR(totalRevenue)}</p>
          <p className="metric-subtitle">This month</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Gross Profit</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="metric-value text-emerald-700">{formatINR(totalProfit)}</p>
          <p className="metric-subtitle">Margin: {((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Total Bookings</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <p className="metric-value">{initialBookings.length}</p>
          <p className="metric-subtitle">{confirmedBookings} confirmed · {pendingBookings} pending</p>
        </div>
        <div className="metric-card" style={{ borderColor: pendingPayments > 0 ? '#fca5a5' : undefined }}>
          <div className="flex items-center justify-between">
            <span className="metric-label">Pending Payments</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="metric-value text-red-600">{formatINR(pendingPayments)}</p>
          <p className="metric-subtitle text-red-500">{overdueFollowUps} overdue follow-ups</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip formatter={(v: any) => formatINR(Number(v))} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lead Pipeline</CardTitle>
              <Link href="/agency/leads" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipelineData.map(item => (
                <div key={item.stage} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-slate-500 font-medium text-right">{item.stage}</div>
                  <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-500"
                      style={{ width: `${Math.max((item.count / Math.max(totalLeads, 1)) * 100, item.count > 0 ? 8 : 0)}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="w-6 text-xs font-semibold text-slate-700 text-right">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Conversion Rate</span>
              <span className="text-sm font-bold text-slate-900">{conversionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Link href="/agency/leads" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {initialLeads.slice(0, 5).map(lead => {
                const client = getClientById(lead.clientId);
                const confirmed = lead.travellers.filter(t => t.status === 'Confirmed').length;
                const total = lead.travellers.length;
                return (
                  <Link key={lead.id} href={`/agency/leads/${lead.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors -mx-1 group">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {client?.name || 'Unknown'} → {lead.destination}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {total > 0 ? `${confirmed} of ${total} confirmed` : 'No travellers'} · {lead.source}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agent Performance</CardTitle>
              <Link href="/agency/agents" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Conv %</th>
                  <th className="text-right">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {initialAgents.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td className="font-medium">{a.name}</td>
                    <td className="text-right text-emerald-700 font-medium">{formatINR(a.revenueGenerated)}</td>
                    <td className="text-right font-semibold">{a.conversionPercent}%</td>
                    <td className="text-right">{a.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
