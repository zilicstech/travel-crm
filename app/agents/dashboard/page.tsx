'use client';

import React from 'react';
import Link from 'next/link';
import { initialAgents, initialBookings, initialLeads, initialClients, getClientById } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, LeadStatusBadge } from '@/components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, UserPlus, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

const CURRENT_AGENT_ID = '1';

export default function AgentDashboardPage() {
  const agentData = initialAgents.find(a => a.id === CURRENT_AGENT_ID);
  
  const agentBookings = initialBookings.filter(b => b.agentId === CURRENT_AGENT_ID);
  const agentLeads = initialLeads.filter(l => l.assignedTo === CURRENT_AGENT_ID);
  
  const totalRevenue = agentBookings.reduce((s, b) => s + b.sellingPrice, 0);
  const commission = totalRevenue * 0.02;

  const bookedLeads = agentLeads.filter(l => l.status === 'Booked').length;
  const conversionRate = agentLeads.length > 0 ? Math.round((bookedLeads / agentLeads.length) * 100) : 0;
  const overdueFollowUps = agentLeads.filter(l => l.followUpDate && new Date(l.followUpDate) < new Date() && l.status !== 'Booked' && l.status !== 'Lost').length;

  const monthlyRevenue = [
    { name: 'Jan', revenue: 45000 }, { name: 'Feb', revenue: 52000 }, { name: 'Mar', revenue: 68000 },
    { name: 'Apr', revenue: 61000 }, { name: 'May', revenue: 85000 }, { name: 'Jun', revenue: 92000 },
    { name: 'Jul', revenue: totalRevenue },
  ];

  const pipelineData = [
    { stage: 'New', count: agentLeads.filter(l => l.status === 'New').length, color: '#3b82f6' },
    { stage: 'Contacted', count: agentLeads.filter(l => l.status === 'Contacted').length, color: '#06b6d4' },
    { stage: 'Qualified', count: agentLeads.filter(l => l.status === 'Qualified').length, color: '#6366f1' },
    { stage: 'Proposal', count: agentLeads.filter(l => l.status === 'Proposal Sent').length, color: '#8b5cf6' },
    { stage: 'Negotiating', count: agentLeads.filter(l => l.status === 'Negotiating').length, color: '#f59e0b' },
    { stage: 'Booked', count: bookedLeads, color: '#059669' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Welcome back, {agentData?.name.split(' ')[0]}!</h1>
        <p className="text-sm text-slate-500 mt-0.5">Agent Workspace Dashboard</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="metric-value">{formatINR(totalRevenue)}</p>
          <p className="metric-subtitle">This month</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Commission Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="metric-value text-emerald-700">{formatINR(commission)}</p>
          <p className="metric-subtitle">~2% of total sales</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Active Leads</span>
            <UserPlus className="w-4 h-4 text-blue-500" />
          </div>
          <p className="metric-value">{agentLeads.filter(l => l.status !== 'Booked' && l.status !== 'Lost').length}</p>
          <p className="metric-subtitle">{conversionRate}% conversion rate</p>
        </div>
        <div className="metric-card" style={{ borderColor: overdueFollowUps > 0 ? '#fca5a5' : undefined }}>
          <div className="flex items-center justify-between">
            <span className="metric-label">Tasks</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="metric-value text-amber-600">{overdueFollowUps}</p>
          <p className="metric-subtitle text-amber-500">Overdue follow-ups</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Revenue Trend</CardTitle>
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
              <CardTitle>My Pipeline</CardTitle>
              <Link href="/agents/leads" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
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
                      style={{ width: `${Math.max((item.count / Math.max(agentLeads.length, 1)) * 100, item.count > 0 ? 8 : 0)}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="w-6 text-xs font-semibold text-slate-700 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Followups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Needs Follow-up</CardTitle>
              <Link href="/agents/leads" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentLeads.filter(l => l.status !== 'Booked' && l.status !== 'Lost').slice(0, 5).map(lead => {
                const client = getClientById(lead.clientId);
                return (
                  <Link key={lead.id} href={`/agents/leads/${lead.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors -mx-1 group">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {client?.name || 'Unknown'} → {lead.destination}
                      </p>
                      <p className={`text-xs mt-0.5 ${lead.followUpDate && new Date(lead.followUpDate) < new Date() ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                        Follow up: {lead.followUpDate || 'None'}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Link href="/agents/bookings" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentBookings.slice(0, 5).map(booking => {
                const client = getClientById(booking.clientId);
                return (
                  <Link key={booking.id} href={`/agents/bookings`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors -mx-1 group">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {client?.name || 'Unknown'} → {booking.destination}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {booking.date} · {booking.tripType || booking.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{formatINR(booking.sellingPrice)}</p>
                      <Badge variant={booking.bookingStatus === 'Confirmed' ? 'green' : 'amber'} className="mt-1">{booking.bookingStatus}</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
