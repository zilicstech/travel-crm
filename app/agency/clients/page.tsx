'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialClients, Client, getMainContact } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, ClientTypeBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Plus, Search, Building2, Phone, Mail, Users, ChevronRight } from 'lucide-react';

export default function AgencyClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add client form state
  const [newClient, setNewClient] = useState({ name: '', type: 'B2C' as 'B2C' | 'B2B', identifier: '', contactName: '', contactPhone: '', contactEmail: '', contactDob: '' });

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.identifier.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    return matchSearch && matchType && c.isActive;
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.identifier) return;
    const mainContactId = `M${Date.now()}`;
    const client: Client = {
      id: `C${Date.now()}`,
      name: newClient.name,
      type: newClient.type,
      identifier: newClient.identifier,
      owningAgentId: '1',
      mainContactId,
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0],
      members: [{
        id: mainContactId,
        name: newClient.name,
        relation: 'Self',
        phone: newClient.identifier,
        email: newClient.contactEmail,
        documents: [],
        isActive: true,
      }],
    };
    setClients(prev => [client, ...prev]);
    setNewClient({ name: '', type: 'B2C', identifier: '', contactName: '', contactPhone: '', contactEmail: '', contactDob: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} of {clients.filter(c => c.isActive).length} clients</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by name or identifier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-36">
          <option value="All">All Types</option>
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
        </Select>
      </div>

      {/* Client List */}
      {filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filtered.map(client => {
                const contact = getMainContact(client);
                const phone = client.identifier || contact?.phone || '—';
                return (
                  <div key={client.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{client.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div className="hidden sm:block text-left mr-8">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Type</p>
                        <ClientTypeBadge type={client.type} />
                      </div>
                      <Link href={`/agency/clients/${client.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={Building2}
            title="No clients found"
            description="Create your first client to start managing their travel needs."
            action={{ label: 'Add Client', onClick: () => setShowAddModal(true) }}
          />
        </Card>
      )}

      {/* Add Client Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} size="lg">
        <ModalHeader onClose={() => setShowAddModal(false)}>
          <ModalTitle>Add New Client</ModalTitle>
          <ModalDescription>Create a client account and their primary contact person.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Account Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Client Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Client Name *</label>
                  <Input placeholder="e.g. Ajay Sharma or Iyer Corp" value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Type *</label>
                  <Select value={newClient.type} onChange={e => setNewClient(p => ({ ...p, type: e.target.value as 'B2C' | 'B2B' }))}>
                    <option value="B2C">B2C — Household / Family</option>
                    <option value="B2B">B2B — Group / Company</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number *</label>
                  <Input
                    placeholder="+919876543210"
                    value={newClient.identifier}
                    onChange={e => setNewClient(p => ({ ...p, identifier: e.target.value }))}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Used to detect duplicates.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email (Optional)</label>
                  <Input type="email" placeholder="ajay@email.com" value={newClient.contactEmail} onChange={e => setNewClient(p => ({ ...p, contactEmail: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddClient} disabled={!newClient.name || !newClient.identifier}>
            Create Client
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
