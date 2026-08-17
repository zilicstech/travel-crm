'use client';

import React, { useState } from 'react';
import { Client, initialAgents, initialClients, Lead, Traveller } from '@/lib/mockData';
import { getActiveTravelCategories, getActiveLeadSources, getActiveTravelPreferences } from '@/lib/agencySettings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Search, UserPlus, ArrowRight } from 'lucide-react';

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onLeadCreated: (lead: Lead) => void;
  currentAgentId?: string;
}

type Step = 'client' | 'details' | 'travellers';

export function AddLeadModal({ open, onClose, onLeadCreated, currentAgentId }: AddLeadModalProps) {
  const [step, setStep] = useState<Step>('client');
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientData, setNewClientData] = useState({ name: '', type: 'B2C' as 'B2C' | 'B2B', phone: '', email: '' });
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [dynamicSources, setDynamicSources] = useState<string[]>([]);
  const [dynamicPreferences, setDynamicPreferences] = useState<string[]>([]);
  
  // Client selection
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Lead Details
  const [details, setDetails] = useState({
    destination: '',
    travelDateFrom: '',
    travelDateTo: '',
    adultsCount: 2,
    kidsCount: 0,
    source: '',
    sourceCountry: '',
    budget: '',
    assignedTo: currentAgentId || initialAgents[0].id
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 3: Preferences & Travellers
  const [kidsAges, setKidsAges] = useState<number[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  React.useEffect(() => {
    if (open) {
      setIsCreatingClient(false);
      setNewClientData({ name: '', type: 'B2C', phone: '', email: '' });
      setStep('client');
      setClientSearch('');
      setSelectedClient(null);
      setDetails({
        destination: '',
        travelDateFrom: '',
        travelDateTo: '',
        adultsCount: 2,
        kidsCount: 0,
        source: '',
        sourceCountry: '',
        budget: '',
        assignedTo: currentAgentId || initialAgents[0].id
      });
      setSelectedCategories([]);
      // Fetch dynamic configured travel categories and sources
      setDynamicCategories(getActiveTravelCategories());
      const sources = getActiveLeadSources();
      setDynamicSources(sources);
      if (sources.length > 0) {
        setDetails(p => ({ ...p, source: sources[0] }));
      }
      setDynamicPreferences(getActiveTravelPreferences());
      
      setKidsAges([]);
      setSelectedPreferences([]);
      setSpecialNotes('');
    }
  }, [open, currentAgentId]);

  // Adjust Kids Ages Array when Kids Count changes
  React.useEffect(() => {
    if (details.kidsCount > kidsAges.length) {
      setKidsAges(prev => [...prev, ...Array(details.kidsCount - prev.length).fill(5)]);
    } else if (details.kidsCount < kidsAges.length) {
      setKidsAges(prev => prev.slice(0, details.kidsCount));
    }
  }, [details.kidsCount]);

  const clientResults = clientSearch.length > 1 
    ? initialClients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.identifier.toLowerCase().includes(clientSearch.toLowerCase())).slice(0, 5)
    : [];

  const toggleCategory = (c: string) => {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleNextFromClient = () => {
    if (isCreatingClient) {
      if (!newClientData.name || !newClientData.phone) return;
      const mainContactId = `M${Date.now()}`;
      const newClientObj: Client = {
        id: `C${Date.now()}`,
        name: newClientData.name,
        type: newClientData.type,
        identifier: newClientData.phone,
        owningAgentId: currentAgentId || initialAgents[0].id,
        mainContactId,
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0],
        members: [{
          id: mainContactId,
          name: newClientData.name,
          relation: 'Self',
          phone: newClientData.phone,
          email: newClientData.email,
          documents: [],
          isActive: true,
        }],
      };
      setSelectedClient(newClientObj);
    }
    setStep('details');
  };

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev => prev.includes(pref) ? prev.filter(c => c !== pref) : [...prev, pref]);
  };

  const handleCreate = () => {
    if (!selectedClient || !details.destination) return;

    const lead: Lead = {
      id: `L${Date.now()}`,
      clientId: selectedClient.id,
      destination: details.destination,
      travelDateFrom: details.travelDateFrom,
      travelDateTo: details.travelDateTo,
      categories: selectedCategories as any,
      travellers: [], // Members selected later from detail page
      budget: details.budget,
      adultsCount: details.adultsCount,
      kidsCount: details.kidsCount,
      kidsAges: details.kidsCount > 0 ? kidsAges : [],
      travelPreferences: selectedPreferences,
      specialNotes,
      status: 'New',
      source: details.source || 'Other',
      sourceCountry: details.sourceCountry,
      priority: 'Medium',
      assignedTo: details.assignedTo,
      followUpDate: '',
      date: new Date().toISOString().split('T')[0],
      proposalItems: [],
      bookingVouchers: [],
      invoices: [],
      notes: [],
      timeline: [{
        id: `T${Date.now()}`, type: 'created', description: 'Lead created', timestamp: new Date().toISOString(), actor: 'Current User'
      }]
    };

    onLeadCreated(lead);
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose} size="lg">
        <ModalHeader onClose={onClose}>
          <ModalTitle>Create New Lead</ModalTitle>
          <ModalDescription>
            {step === 'client' && 'Step 1 of 3: Select or create the client for this lead.'}
            {step === 'details' && 'Step 2 of 3: Enter the trip details.'}
            {step === 'travellers' && 'Step 3 of 3: Select who is travelling (optional).'}
          </ModalDescription>
          {/* Stepper indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1 flex-1 rounded-full ${step === 'client' || step === 'details' || step === 'travellers' ? 'bg-blue-600' : 'bg-slate-100'}`} />
            <div className={`h-1 flex-1 rounded-full ${step === 'details' || step === 'travellers' ? 'bg-blue-600' : 'bg-slate-100'}`} />
            <div className={`h-1 flex-1 rounded-full ${step === 'travellers' ? 'bg-blue-600' : 'bg-slate-100'}`} />
          </div>
        </ModalHeader>

        <ModalBody>
          {step === 'client' && (
            <div className="space-y-6">
              {!selectedClient ? (
                <>
                  {isCreatingClient ? (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-800">Create New Client</h3>
                        <Button variant="ghost" size="xs" onClick={() => setIsCreatingClient(false)} className="text-slate-500">Cancel</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Client Name *</label>
                          <Input placeholder="e.g. Ajay Sharma" value={newClientData.name} onChange={e => setNewClientData(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Type *</label>
                          <Select value={newClientData.type} onChange={e => setNewClientData(p => ({ ...p, type: e.target.value as 'B2C' | 'B2B' }))}>
                            <option value="B2C">B2C — Household / Family</option>
                            <option value="B2B">B2B — Group / Company</option>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number *</label>
                          <Input placeholder="+919876543210" value={newClientData.phone} onChange={e => setNewClientData(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Email (Optional)</label>
                          <Input type="email" placeholder="ajay@email.com" value={newClientData.email} onChange={e => setNewClientData(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Search Existing Client</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input placeholder="Search by name, phone, or company handle..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="pl-9" />
                        </div>
                      </div>

                      {clientSearch.length > 1 && (
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                          {clientResults.length > 0 ? (
                            clientResults.map(client => (
                              <div key={client.id} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedClient(client)}>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{client.name}</p>
                                  <p className="text-xs text-slate-500 font-mono">{client.identifier}</p>
                                </div>
                                <Button variant="ghost" size="xs">Select</Button>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-slate-500">No matching clients found.</div>
                          )}
                        </div>
                      )}

                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                        <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-500">OR</span></div>
                      </div>

                      <Button variant="outline" className="w-full h-12 border-dashed border-2 hover:bg-slate-50" onClick={() => setIsCreatingClient(true)}>
                        <UserPlus className="w-4 h-4 text-slate-400" /> Create New Client
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Selected Client</p>
                    <p className="text-base font-bold text-blue-900">{selectedClient.name}</p>
                    <p className="text-sm text-blue-700 font-mono">{selectedClient.identifier}</p>
                  </div>
                  <Button variant="ghost" size="xs" onClick={() => setSelectedClient(null)} className="text-blue-700 hover:bg-blue-100">
                    Change
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Destination / Trip Name *</label>
                  <Input placeholder="e.g. Summer in Paris" value={details.destination} onChange={e => setDetails(p => ({ ...p, destination: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">From Date</label>
                  <Input type="date" value={details.travelDateFrom} onChange={e => setDetails(p => ({ ...p, travelDateFrom: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">To Date</label>
                  <Input type="date" value={details.travelDateTo} onChange={e => setDetails(p => ({ ...p, travelDateTo: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Adults (12+ yrs)</label>
                  <div className="flex items-center justify-between border border-slate-200 rounded-lg p-2 h-10 bg-white">
                    <button type="button" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors" onClick={() => setDetails(p => ({ ...p, adultsCount: Math.max(1, p.adultsCount - 1) }))} disabled={details.adultsCount <= 1}>
                      <span className="text-lg font-medium leading-none -mt-0.5">-</span>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{details.adultsCount}</span>
                    <button type="button" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors" onClick={() => setDetails(p => ({ ...p, adultsCount: p.adultsCount + 1 }))}>
                      <span className="text-lg font-medium leading-none -mt-0.5">+</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Kids (0-11 yrs)</label>
                  <div className="flex items-center justify-between border border-slate-200 rounded-lg p-2 h-10 bg-white">
                    <button type="button" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors" onClick={() => setDetails(p => ({ ...p, kidsCount: Math.max(0, p.kidsCount - 1) }))} disabled={details.kidsCount <= 0}>
                      <span className="text-lg font-medium leading-none -mt-0.5">-</span>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{details.kidsCount}</span>
                    <button type="button" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors" onClick={() => setDetails(p => ({ ...p, kidsCount: p.kidsCount + 1 }))}>
                      <span className="text-lg font-medium leading-none -mt-0.5">+</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Lead Source</label>
                  <Select value={details.source} onChange={e => setDetails(p => ({ ...p, source: e.target.value }))}>
                    {dynamicSources.map(s => <option key={s} value={s}>{s}</option>)}
                    {dynamicSources.length === 0 && <option value="Other">Other</option>}
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Source Country / Origin</label>
                  <Input placeholder="e.g. India or UAE" value={details.sourceCountry} onChange={e => setDetails(p => ({ ...p, sourceCountry: e.target.value }))} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-600">Requirements / Configured Travel Categories</label>
                  <span className="text-[10px] text-blue-600">Managed in Settings</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dynamicCategories.map(c => {
                    const isSel = selectedCategories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCategory(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${isSel ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 'travellers' && (
            <div className="space-y-6">
              <ModalDescription>
                Step 3 of 3: Add extra preferences and notes for this lead.
              </ModalDescription>
              
              {details.kidsCount > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Age of Kids (in years)</label>
                  <div className="flex flex-wrap gap-3">
                    {kidsAges.map((age, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                        <span className="text-xs font-medium text-slate-500 w-10">Kid {idx + 1}</span>
                        <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                          <button type="button" className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors" onClick={() => setKidsAges(p => { const n = [...p]; n[idx] = Math.max(0, n[idx] - 1); return n; })} disabled={age <= 0}>-</button>
                          <span className="text-xs font-bold w-6 text-center">{age}</span>
                          <button type="button" className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors" onClick={() => setKidsAges(p => { const n = [...p]; n[idx] = Math.min(11, n[idx] + 1); return n; })} disabled={age >= 11}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-600">Travel Preferences</label>
                  <span className="text-[10px] text-blue-600">Managed in Settings</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dynamicPreferences.map(p => {
                    const isSel = selectedPreferences.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePreference(p)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${isSel ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Special Requirements / Notes</label>
                <textarea 
                  className="w-full h-24 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 resize-none"
                  placeholder="e.g., Anniversary trip, needs wheelchair access..."
                  value={specialNotes}
                  onChange={e => setSpecialNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {step === 'client' && (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" onClick={handleNextFromClient} disabled={!selectedClient && (!isCreatingClient || !newClientData.name || !newClientData.phone)}>Next <ArrowRight className="w-4 h-4" /></Button>
            </>
          )}
          {step === 'details' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setStep('client')}>Back</Button>
              <Button size="sm" onClick={() => setStep('travellers')} disabled={!details.destination}>Next <ArrowRight className="w-4 h-4" /></Button>
            </>
          )}
          {step === 'travellers' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setStep('details')}>Back</Button>
              <Button size="sm" onClick={handleCreate}>Create Lead</Button>
            </>
          )}
        </ModalFooter>
      </Modal>

    </>
  );
}
