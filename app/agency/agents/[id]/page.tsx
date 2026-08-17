'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initialAgents, initialLeads, initialBookings, initialClients, getClientById } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, LeadStatusBadge, BookingStatusBadge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import {
  ArrowLeft, User, BarChart3, UserPlus, Phone, Mail,
  CheckCircle, Plane, Hotel, Package, FileText, Edit, Trash2, UserMinus, PlusCircle,
  ToggleLeft, ToggleRight, MessageSquare, Download, ChevronRight
} from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

type Tab = 'overview' | 'performance' | 'leads' | 'bookings';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Flight: <Plane className="w-3.5 h-3.5" />,
  Hotel: <Hotel className="w-3.5 h-3.5" />,
  Package: <Package className="w-3.5 h-3.5" />,
  Visa: <FileText className="w-3.5 h-3.5" />,
};

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
  const agentClients = initialClients.filter(c => c.owningAgentId === agent.id);
  const totalProfit = agentBookings.reduce((s, b) => s + b.profit, 0);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { key: 'performance', label: 'Performance', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'leads', label: `Leads (${agentLeads.length})`, icon: <UserPlus className="w-4 h-4" /> },
    { key: 'bookings', label: `Bookings (${agentBookings.length})`, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
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
                <Badge variant="blue">{agent.department}</Badge>
                <Badge variant={isActive ? 'green' : 'slate'}>{isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" /> {agent.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" /> ID: {agent.id}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <Button size="sm" variant="outline"><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
              <Button size="sm" variant="outline"><MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Message</Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsActive(v => !v)}
              >
                {isActive ? <ToggleLeft className="w-3.5 h-3.5 mr-1.5" /> : <ToggleRight className="w-3.5 h-3.5 mr-1.5" />}
                {isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="metric-card !p-4">
          <span className="metric-label">Active Leads</span>
          <p className="metric-value">{activeLeads.length}</p>
        </div>
        <div className="metric-card !p-4">
          <span className="metric-label">Clients</span>
          <p className="metric-value">{agentClients.length}</p>
        </div>
        <div className="metric-card !p-4">
          <span className="metric-label">Bookings</span>
          <p className="metric-value">{agentBookings.length}</p>
        </div>
        <div className="metric-card !p-4">
          <span className="metric-label">Revenue</span>
          <p className="metric-value text-emerald-700">{formatINR(agent.revenueGenerated)}</p>
        </div>
        <div className="metric-card !p-4">
          <span className="metric-label">Profit</span>
          <p className="metric-value text-emerald-700">{formatINR(totalProfit)}</p>
        </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {[
                { label: 'Full Name', value: agent.name },
                { label: 'Email', value: agent.email },
                { label: 'Department', value: agent.department },
                { label: 'Commission Rate', value: `${agent.commission} per booking` },
              ].map(row => (
                <div key={row.label} className="flex justify-between px-5 py-3">
                  <span className="text-xs font-medium text-slate-500">{row.label}</span>
                  <span className="text-xs font-bold text-slate-900">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agency Owner Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100">
                <PlusCircle className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold">Assign New Lead</p>
                  <p className="text-[11px] opacity-70">Manually assign a lead to this agent</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100">
                <Edit className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold">Edit Profile & Department</p>
                  <p className="text-[11px] opacity-70">Update agent info and department</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button onClick={() => setShowConfirmModal('remove')} className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors text-red-700 bg-red-50 border-red-100 hover:bg-red-100">
                <UserMinus className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold">Remove Agent</p>
                  <p className="text-[11px] opacity-70">Permanently remove this agent from agency</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Performance */}
      {activeTab === 'performance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="metric-card">
              <span className="metric-label">Leads Assigned</span>
              <p className="metric-value">{agent.leadsAssigned}</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Calls Made</span>
              <p className="metric-value">{agent.callsMade}</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Follow-ups Done</span>
              <p className="metric-value text-emerald-700">{agent.followUpsCompleted}</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Quotations Sent</span>
              <p className="metric-value">{agent.quotationsSent}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <p className="text-xs text-slate-500 font-medium">Conversion Rate</p>
                  <p className="text-3xl font-bold mt-2 text-slate-900">{agent.conversionPercent}%</p>
                </div>
                <div className="text-center p-4 border-l border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold mt-2 text-slate-900">{agent.bookings}</p>
                </div>
                <div className="text-center p-4 border-l border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold mt-2 text-amber-600">{agent.pendingTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Leads */}
      {activeTab === 'leads' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Leads Assigned</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client / Destination</th>
                    <th>Categories</th>
                    <th>Follow-up</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agentLeads.map(lead => {
                    const client = getClientById(lead.clientId);
                    return (
                      <tr key={lead.id}>
                        <td>
                          <div className="font-bold text-slate-900">{client?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500">{lead.destination}</div>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {lead.categories.map(cat => (
                              <Badge key={cat} variant="slate">{cat}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="text-sm font-medium text-slate-700">{lead.followUpDate || '–'}</td>
                        <td><LeadStatusBadge status={lead.status} /></td>
                      </tr>
                    );
                  })}
                  {agentLeads.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-12 text-sm text-slate-400">No leads assigned.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Bookings */}
      {activeTab === 'bookings' && (
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID / Type</th>
                    <th>Client / Destination</th>
                    <th className="text-right">Selling Price</th>
                    <th className="text-right">Profit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agentBookings.map(b => {
                    const client = getClientById(b.clientId);
                    return (
                      <tr key={b.id}>
                        <td>
                          <div className="font-bold text-slate-900">{b.id}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            {TYPE_ICONS[b.type]} {b.type}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm font-medium text-slate-700">{client?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{b.destination}</div>
                        </td>
                        <td className="text-right font-bold text-slate-900">{formatINR(b.sellingPrice)}</td>
                        <td className="text-right font-bold text-emerald-700">{formatINR(b.profit)}</td>
                        <td><BookingStatusBadge status={b.bookingStatus} /></td>
                      </tr>
                    );
                  })}
                  {agentBookings.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-400">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Modal */}
      <Modal open={showConfirmModal === 'remove'} onClose={() => setShowConfirmModal(null)}>
        <ModalHeader onClose={() => setShowConfirmModal(null)}>
          <ModalTitle>Remove Agent</ModalTitle>
          <ModalDescription>This action cannot be undone.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-slate-600">
            Are you sure you want to remove <span className="font-bold text-slate-900">{agent.name}</span> from the agency? All their leads will need to be reassigned.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowConfirmModal(null)}>Cancel</Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => { setShowConfirmModal(null); router.push('/agency/agents'); }}
          >
            Remove Agent
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
