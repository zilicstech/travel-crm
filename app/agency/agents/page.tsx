'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialAgents } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Users, UserPlus, Search } from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgencyAgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', phone: '' });

  const filtered = initialAgents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.email) return;
    alert(`Agent "${newAgent.name}" added successfully!`);
    setShowModal(false);
    setNewAgent({ name: '', email: '', phone: '' });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Agency Agents</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your team of {initialAgents.length} agents</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <UserPlus className="w-4 h-4" /> Add Agent
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 gap-4 flex-wrap">
          <CardTitle>Team Roster</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search agents by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filtered.map(agent => (
              <div key={agent.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{agent.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block text-left mr-8">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${agent.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/agency/agents/${agent.id}`)}
                    className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Manage Profile
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-400">No agents found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalHeader onClose={() => setShowModal(false)}>
          <ModalTitle>Add New Agent</ModalTitle>
          <ModalDescription>Fill in the details to onboard a new team member.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name *</label>
              <Input placeholder="e.g. Priya Sharma" value={newAgent.name} onChange={e => setNewAgent(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
              <Input type="email" placeholder="priya@agency.com" value={newAgent.email} onChange={e => setNewAgent(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
              <Input placeholder="+919876543210" value={newAgent.phone} onChange={e => setNewAgent(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddAgent} disabled={!newAgent.name || !newAgent.email}>
            Add Agent
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
