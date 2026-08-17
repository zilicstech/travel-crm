'use client';

import React, { useState } from 'react';
import { initialClients, initialAgents, Client } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Search, UserPlus, CheckCircle2 } from 'lucide-react';

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientCreated: (client: Client) => void;
  // If agent version, omit agent selection and assign to this agent. 
  // If agency version, show agent select.
  currentAgentId?: string; 
}

type Step = 'lookup' | 'create' | 'success';

export function AddClientModal({ open, onClose, onClientCreated, currentAgentId }: AddClientModalProps) {
  const [step, setStep] = useState<Step>('lookup');
  const [identifier, setIdentifier] = useState('');
  const [lookupResult, setLookupResult] = useState<Client | null>(null);
  
  const [newClient, setNewClient] = useState({ 
    name: '', type: 'B2C' as 'B2C' | 'B2B', 
    contactName: '', contactPhone: '', contactEmail: '', contactDob: '',
    owningAgentId: currentAgentId || initialAgents[0].id
  });

  // Reset when opened
  React.useEffect(() => {
    if (open) {
      setStep('lookup');
      setIdentifier('');
      setLookupResult(null);
      setNewClient({
        name: '', type: 'B2C',
        contactName: '', contactPhone: '', contactEmail: '', contactDob: '',
        owningAgentId: currentAgentId || initialAgents[0].id
      });
    }
  }, [open, currentAgentId]);

  const handleLookup = () => {
    if (!identifier) return;
    const match = initialClients.find(c => c.identifier.toLowerCase() === identifier.toLowerCase());
    setLookupResult(match || null);
    if (!match) {
      setNewClient(p => ({ ...p, type: 'B2C' })); // Default for new
    }
    setStep(match ? 'lookup' : 'create'); // If match, stay on lookup to show it. If not, go to create.
  };

  const handleCreate = () => {
    if (!newClient.name) return;
    const mainContactId = `M${Date.now()}`;
    const client: Client = {
      id: `C${Date.now()}`,
      name: newClient.name,
      type: newClient.type,
      identifier,
      owningAgentId: newClient.owningAgentId,
      mainContactId,
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0],
      members: [{
        id: mainContactId,
        name: newClient.name,
        relation: 'Self',
        phone: newClient.contactPhone || identifier, // Fallback to identifier if B2C
        email: newClient.contactEmail,
        documents: [],
        isActive: true,
      }],
    };
    onClientCreated(client);
    setStep('success');
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        <ModalTitle>Add New Client</ModalTitle>
        <ModalDescription>
          {step === 'lookup' && 'Search the agency database before creating a new client.'}
          {step === 'create' && 'Create a new client account and their primary contact.'}
          {step === 'success' && 'Client created successfully.'}
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        {step === 'lookup' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number or Company Handle *</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. +919876543210 or IYER-CORP" 
                  value={identifier} 
                  onChange={e => setIdentifier(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                />
                <Button onClick={handleLookup} disabled={!identifier}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {lookupResult && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                <div className="mt-0.5 text-blue-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Client Already Exists</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    "{lookupResult.name}" is already registered. They are currently managed by 
                    <span className="font-semibold"> {initialAgents.find(a => a.id === lookupResult.owningAgentId)?.name}</span>.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-700" onClick={() => onClientCreated(lookupResult)}>
                    Select {lookupResult.name}
                  </Button>
                </div>
              </div>
            )}
            {lookupResult === null && identifier && (
               <div className="text-sm text-slate-500 italic mt-2">Hit search to check the database...</div>
            )}
          </div>
        )}

        {step === 'create' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Identifier</p>
                <p className="text-sm font-semibold font-mono text-slate-900">{identifier}</p>
              </div>
              <Button variant="ghost" size="xs" onClick={() => setStep('lookup')}>Change</Button>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Account Details</h3>
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
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
                  <Input placeholder={newClient.type === 'B2C' ? identifier : "+919876543210"} value={newClient.contactPhone} onChange={e => setNewClient(p => ({ ...p, contactPhone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email (Optional)</label>
                  <Input type="email" placeholder="ajay@email.com" value={newClient.contactEmail} onChange={e => setNewClient(p => ({ ...p, contactEmail: e.target.value }))} />
                </div>
                {!currentAgentId && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Assign To Agent *</label>
                    <Select value={newClient.owningAgentId} onChange={e => setNewClient(p => ({ ...p, owningAgentId: e.target.value }))}>
                      {initialAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Client Created!</h3>
            <p className="text-slate-500 text-sm">You can now proceed.</p>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {step !== 'success' && (
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        )}
        {step === 'create' && (
          <Button size="sm" onClick={handleCreate} disabled={!newClient.name}>
            Create Client
          </Button>
        )}
        {step === 'success' && (
          <Button size="sm" onClick={onClose}>
            Done
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
