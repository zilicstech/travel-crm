'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initialAgents, initialLeads, initialBookings, initialCustomers } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft, User, BarChart3, UserPlus, Phone, Mail, Target,
  TrendingUp, CheckCircle, Clock, AlertTriangle, Plane, Hotel,
  Package, FileText, Edit, Trash2, UserMinus, PlusCircle,
  ToggleLeft, ToggleRight, MessageSquare, Download, ChevronRight
} from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-cyan-100 text-cyan-700',
  Qualified: 'bg-indigo-100 text-indigo-700',
  'Proposal Sent': 'bg-purple-100 text-purple-700',
  Negotiating: 'bg-orange-100 text-orange-700',
  Booked: 'bg-green-100 text-green-700',
  Lost: 'bg-slate-100 text-slate-500',
};

const TYPE_COLORS: Record<string, string> = {
  Flight: 'bg-blue-50 text-blue-700',
  Hotel: 'bg-purple-50 text-purple-700',
  Package: 'bg-emerald-50 text-emerald-700',
  Visa: 'bg-amber-50 text-amber-700',
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-blue-100 text-blue-700',
};

type Tab = 'overview' | 'performance' | 'leads' | 'bookings';

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isActive, setIsActive] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  const agent = initialAgents.find(a => a.id === id);
  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-slate-500 text-sm">Agent not found.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const agentLeads = initialLeads.filter(l => l.assignedTo === agent.id);
  const activeLeads = agentLeads.filter(l => l.status !== 'Lost' && l.status !== 'Booked');
  const agentBookings = initialBookings.filter(b => b.agentId === agent.id);
  const agentCustomers = initialCustomers.filter(c => c.agentId === agent.id);
  const totalProfit = agentBookings.reduce((s, b) => s + b.profit, 0);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { key: 'performance', label: 'Performance', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'leads', label: `Leads (${agentLeads.length})`, icon: <UserPlus className="w-4 h-4" /> },
    { key: 'bookings', label: `Bookings (${agentBookings.length})`, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/agency/agents')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400">Agents</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-semibold text-slate-700">{agent.name}</span>
      </div>

      {/* Agent Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {agent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isActive ? 'bg-green-500' : 'bg-slate-400'}`} />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900">{agent.name}</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {agent.department}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" /> {agent.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" /> Agent ID: {agent.id}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50">
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50">
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50">
                <Download className="w-3.5 h-3.5" /> Export Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsActive(v => !v)}
                className={`text-xs gap-1.5 ${isActive ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
              >
                {isActive ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                {isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirmModal('remove')}
                className="text-xs gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
              >
                <UserMinus className="w-3.5 h-3.5" /> Remove Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Active Leads', value: activeLeads.length, color: 'text-blue-700' },
          { label: 'Customers', value: agentCustomers.length, color: 'text-slate-900' },
          { label: 'Bookings', value: agentBookings.length, color: 'text-slate-900' },
          { label: 'Revenue', value: formatINR(agent.revenueGenerated), color: 'text-green-700' },
          { label: 'Profit', value: formatINR(totalProfit), color: 'text-emerald-700' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal Details */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Agent Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {[
                { label: 'Full Name', value: agent.name },
                { label: 'Email', value: agent.email },
                { label: 'Department', value: agent.department },
                { label: 'Agent ID', value: agent.id },
                { label: 'Commission Rate', value: `${agent.commission} per booking` },
              ].map(row => (
                <div key={row.label} className="flex justify-between px-5 py-3">
                  <span className="text-xs font-medium text-slate-500">{row.label}</span>
                  <span className="text-xs font-bold text-slate-900">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-900">Agency Owner Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[
                { icon: <PlusCircle className="w-4 h-4" />, label: 'Assign New Lead', desc: 'Manually assign a lead to this agent', color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100' },
                { icon: <Edit className="w-4 h-4" />, label: 'Edit Profile & Department', desc: 'Update agent info and department', color: 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100' },
                { icon: <ToggleLeft className="w-4 h-4" />, label: isActive ? 'Deactivate Agent' : 'Activate Agent', desc: 'Toggle active/inactive status', color: 'text-amber-700 bg-amber-50 border-amber-100 hover:bg-amber-100', onClick: () => setIsActive(v => !v) },
                { icon: <UserMinus className="w-4 h-4" />, label: 'Remove Agent', desc: 'Permanently remove this agent from agency', color: 'text-red-700 bg-red-50 border-red-100 hover:bg-red-100', onClick: () => setShowConfirmModal('remove') },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${action.color}`}
                >
                  <span className="flex-shrink-0">{action.icon}</span>
                  <div>
                    <p className="text-sm font-bold">{action.label}</p>
                    <p className="text-[11px] opacity-70">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Performance */}
      {activeTab === 'performance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Leads Assigned', value: agent.leadsAssigned, icon: <UserPlus className="w-4 h-4 text-blue-600" /> },
              { label: 'Calls Made', value: agent.callsMade, icon: <Phone className="w-4 h-4 text-slate-500" /> },
              { label: 'Follow-ups Done', value: agent.followUpsCompleted, icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
              { label: 'Quotations Sent', value: agent.quotationsSent, icon: <FileText className="w-4 h-4 text-indigo-600" /> },
            ].map(kpi => (
              <Card key={kpi.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                    {kpi.icon}
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-500" /> Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Conversion Rate</p>
                  <p className={`text-2xl font-bold mt-1 ${agent.conversionPercent >= 70 ? 'text-green-600' : agent.conversionPercent >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {agent.conversionPercent}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Total Bookings</p>
                  <p className="text-2xl font-bold mt-1 text-slate-900">{agent.bookings}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Pending Tasks</p>
                  <p className={`text-2xl font-bold mt-1 ${agent.pendingTasks > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    {agent.pendingTasks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Leads */}
      {activeTab === 'leads' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">All Leads Assigned</CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5">
                <PlusCircle className="w-4 h-4" /> Assign Lead
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Categories</th>
                  <th className="px-4 py-3">Follow-up</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentLeads.map(lead => {
                  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== 'Booked' && lead.status !== 'Lost';
                  return (
                    <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50/30' : ''}`}>
                      <td className="px-5 py-3">
                        <p className="text-sm font-bold text-slate-900">{lead.name}</p>
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
                      <td className={`px-4 py-3 text-xs font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {lead.followUpDate || '–'}
                        {isOverdue && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-full">OVERDUE</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.priority === 'High' ? 'bg-red-100 text-red-700' :
                          lead.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>{lead.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {agentLeads.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No leads assigned.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab: Bookings */}
      {activeTab === 'bookings' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900">All Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3">Booking ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Journey Date</th>
                  <th className="px-4 py-3 text-right">Selling</th>
                  <th className="px-4 py-3 text-right">Profit</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentBookings.map(b => {
                  const customer = initialCustomers.find(c => c.id === b.customerId);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-slate-900">{b.id}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[b.type]}`}>{b.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{customer?.name || '–'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{b.destination}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{b.journeyDate}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 text-right">{formatINR(b.sellingPrice)}</td>
                      <td className="px-4 py-3 font-bold text-green-700 text-right">{formatINR(b.profit)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${BOOKING_STATUS_COLORS[b.bookingStatus]}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {agentBookings.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-400">No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Confirm Modal */}
      {showConfirmModal === 'remove' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Remove Agent</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to remove <span className="font-bold text-slate-900">{agent.name}</span> from the agency? All their leads will need to be reassigned.
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(null)}>Cancel</Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => { setShowConfirmModal(null); router.push('/agency/agents'); }}
              >
                Remove Agent
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
