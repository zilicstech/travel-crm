'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  initialLeads, Client, Lead, LeadNote, ProposalItem, Traveller, TravellerStatus, BookingVoucher, LeadInvoice, LeadStatus, initialAgents,
  getClientById, getAgentById, deriveFareClass, hasBirthdayDuringTrip, getMemberById 
} from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, LeadStatusBadge, TravellerStatusBadge, InfoBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { 
  ArrowLeft, Plus, Link as LinkIcon, Trash2, Edit, User,
  CheckCircle2, AlertTriangle, Gift, FileText, MessageSquare, DollarSign, Send, Users, Shield, Check, Calendar, Globe
} from 'lucide-react';

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function AgencyLeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [lead, setLead] = useState<Lead | undefined>(initialLeads.find(l => l.id === leadId));
  const [activeTab, setActiveTab] = useState<'details' | 'proposal' | 'bookings' | 'invoices' | 'visa' | 'timeline'>('details');
  const [newNoteText, setNewNoteText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Add Traveller Modal State
  const [showAddTravellerModal, setShowAddTravellerModal] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Record<string, boolean>>({});
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [newMemberData, setNewMemberData] = useState({ name: '', relation: 'Self' as import('@/lib/mockData').Relation, dob: '' });

  // Add Proposal Item Modal State
  const [showAddProposalModal, setShowAddProposalModal] = useState(false);
  const [newProposalItem, setNewProposalItem] = useState<{
    description: string;
    type: ProposalItem['type'];
    supplier: string;
    netCost: string;
    sellingPrice: string;
  }>({
    description: '',
    type: 'Flight',
    supplier: '',
    netCost: '',
    sellingPrice: '',
  });

  // Add Booking Voucher Modal State
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [newVoucher, setNewVoucher] = useState<{
    type: BookingVoucher['type'];
    supplier: string;
    referenceNumber: string;
    notes: string;
  }>({
    type: 'Flight',
    supplier: '',
    referenceNumber: '',
    notes: '',
  });

  // Add Invoice Modal State
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState<{
    description: string;
    amount: string;
    status: LeadInvoice['status'];
    dueDate: string;
  }>({
    description: '',
    amount: '',
    status: 'Draft',
    dueDate: '',
  });

  // Add Status Update Modal State
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [updateStatusData, setUpdateStatusData] = useState<{
    status: LeadStatus;
    remarks: string;
  }>({
    status: lead?.status || 'New',
    remarks: '',
  });

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignAgentId, setReassignAgentId] = useState<string>(lead?.assignedTo || '');

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-left">
        <p className="text-sm text-slate-500">Lead not found.</p>
        <Link href="/agency/leads" className="text-sm text-blue-600 hover:underline mt-2">&larr; Back to Leads</Link>
      </div>
    );
  }

  const client = getClientById(lead.clientId);
  const agent = getAgentById(lead.assignedTo);
  const totalNet = lead.proposalItems.reduce((sum, item) => sum + item.netCost, 0);
  const totalSelling = lead.proposalItems.reduce((sum, item) => sum + item.sellingPrice, 0);
  const margin = totalSelling > 0 ? ((totalSelling - totalNet) / totalSelling) * 100 : 0;
  
  // Conditional Visa tab visibility
  const hasVisaCategory = Array.isArray(lead.categories) && lead.categories.includes('Visa');

  const handleUpdateStatusSubmit = () => {
    if (!updateStatusData.remarks.trim()) return;

    const noteObj: LeadNote = {
      id: `N${Date.now()}`,
      text: updateStatusData.remarks.trim(),
      author: 'John Davis (Owner)',
      timestamp: new Date().toISOString(),
    };

    setLead(prev => prev ? { 
      ...prev, 
      status: updateStatusData.status,
      notes: [noteObj, ...prev.notes],
      timeline: [
        { id: `T${Date.now()}_status`, type: 'status_change', description: `Status changed to ${updateStatusData.status}`, timestamp: new Date().toISOString(), actor: 'John Davis' },
        { id: `T${Date.now()}_note`, type: 'note_added', description: `Added note: "${updateStatusData.remarks.trim().substring(0, 35)}..."`, timestamp: new Date().toISOString(), actor: 'John Davis' },
        ...prev.timeline
      ]
    } : prev);

    setShowUpdateStatusModal(false);
    setUpdateStatusData({ status: updateStatusData.status, remarks: '' });
  };

  const handleReassignAgentSubmit = () => {
    const newAgent = getAgentById(reassignAgentId);
    if (!newAgent) return;
    
    setLead(prev => prev ? {
      ...prev,
      assignedTo: reassignAgentId,
      timeline: [{
        id: `T${Date.now()}_reassign`,
        type: 'reassigned',
        description: `Lead reassigned to ${newAgent.name}`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis (Owner)'
      }, ...prev.timeline]
    } : prev);

    setShowReassignModal(false);
  };

  const handlePostNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newNoteText.trim()) return;

    const noteObj: LeadNote = {
      id: `N${Date.now()}`,
      text: newNoteText.trim(),
      author: 'John Davis (Owner)',
      timestamp: new Date().toISOString(),
    };

    setLead(prev => prev ? {
      ...prev,
      notes: [noteObj, ...prev.notes],
      timeline: [{
        id: `T${Date.now()}`,
        type: 'note_added',
        description: `Added note: "${newNoteText.trim().substring(0, 35)}..."`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);

    setNewNoteText('');
  };

  const handleToggleVisaChecklist = (travellerIdx: number, key: string) => {
    setLead(prev => {
      if (!prev) return prev;
      const updatedTravellers = [...prev.travellers];
      const target = { ...updatedTravellers[travellerIdx] };
      const currentVal = (target.visaChecklist as any)[key];
      target.visaChecklist = { ...target.visaChecklist, [key]: !currentVal };
      updatedTravellers[travellerIdx] = target;
      return { ...prev, travellers: updatedTravellers };
    });
  };

  // ── Add Traveller Handler ───────────────────────────────────────────────────
  const handleAddTravellersSubmit = () => {
    if (!client) return;
    
    let memberIdsToAdd = Object.keys(selectedMemberIds).filter(id => selectedMemberIds[id]);
    
    if (isCreatingMember) {
      if (!newMemberData.name.trim()) return;
      const newMember = {
        id: `M${Date.now()}`,
        name: newMemberData.name.trim(),
        relation: newMemberData.relation,
        dob: newMemberData.dob,
        documents: [],
        isActive: true,
      };
      client.members.push(newMember); // Mutate mock client for demo session
      memberIdsToAdd = [newMember.id];
    }
    
    if (memberIdsToAdd.length === 0) return;

    const existingMemberIds = lead.travellers.map(t => t.memberId);
    const newTravellers: Traveller[] = memberIdsToAdd
      .filter(id => !existingMemberIds.includes(id))
      .map(memberId => ({
        memberId,
        status: 'Confirmed' as TravellerStatus,
        visaChecklist: { passportCollected: false, photosCollected: false, formsFilled: false, submittedToEmbassy: false, approved: false }
      }));

    if (newTravellers.length === 0) {
      setShowAddTravellerModal(false);
      return;
    }

    const addedMemberNames = newTravellers
      .map(t => getMemberById(client, t.memberId)?.name)
      .filter(Boolean)
      .join(', ');

    setLead(prev => prev ? {
      ...prev,
      travellers: [...prev.travellers, ...newTravellers],
      timeline: [{
        id: `T${Date.now()}`,
        type: 'traveller_added',
        description: `Added traveller(s): ${addedMemberNames}`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);

    setSelectedMemberIds({});
    setIsCreatingMember(false);
    setNewMemberData({ name: '', relation: 'Self' as any, dob: '' });
    setShowAddTravellerModal(false);
  };

  // ── Add Proposal Item Handler ───────────────────────────────────────────────
  const handleAddProposalItemSubmit = () => {
    if (!newProposalItem.description.trim() || !newProposalItem.sellingPrice) return;

    const item: ProposalItem = {
      id: `P${Date.now()}`,
      type: newProposalItem.type,
      description: newProposalItem.description.trim(),
      supplier: newProposalItem.supplier.trim() || 'Direct',
      netCost: Number(newProposalItem.netCost) || 0,
      sellingPrice: Number(newProposalItem.sellingPrice) || 0,
    };

    setLead(prev => prev ? {
      ...prev,
      proposalItems: [...prev.proposalItems, item],
      timeline: [{
        id: `T${Date.now()}`,
        type: 'proposal_item',
        description: `Added proposal item: "${item.description}" (${formatINR(item.sellingPrice)})`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);

    setNewProposalItem({
      description: '',
      type: 'Flight',
      supplier: '',
      netCost: '',
      sellingPrice: '',
    });
    setShowAddProposalModal(false);
  };

  // ── Delete Proposal Item Handler ────────────────────────────────────────────
  const handleDeleteProposalItem = (itemId: string) => {
    const targetItem = lead.proposalItems.find(i => i.id === itemId);
    setLead(prev => prev ? {
      ...prev,
      proposalItems: prev.proposalItems.filter(i => i.id !== itemId),
      timeline: [{
        id: `T${Date.now()}`,
        type: 'proposal_item',
        description: `Removed proposal item: "${targetItem?.description || 'Item'}"`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/proposal/${lead.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setLead(prev => prev ? {
        ...prev,
        timeline: [{
          id: `T${Date.now()}`,
          type: 'link_shared',
          description: `Copied public proposal link to clipboard`,
          timestamp: new Date().toISOString(),
          actor: 'John Davis'
        }, ...prev.timeline]
      } : prev);
    });
  };

  const handleAddVoucherSubmit = () => {
    if (!newVoucher.supplier.trim() || !newVoucher.referenceNumber.trim()) return;

    const voucher: BookingVoucher = {
      id: `V${Date.now()}`,
      type: newVoucher.type,
      supplier: newVoucher.supplier.trim(),
      referenceNumber: newVoucher.referenceNumber.trim(),
      date: new Date().toISOString().split('T')[0],
      notes: newVoucher.notes.trim(),
    };

    setLead(prev => prev ? {
      ...prev,
      bookingVouchers: [...prev.bookingVouchers, voucher],
      timeline: [{
        id: `T${Date.now()}`,
        type: 'voucher_added',
        description: `Added booking voucher for ${voucher.type} (${voucher.referenceNumber})`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);

    setNewVoucher({ type: 'Flight', supplier: '', referenceNumber: '', notes: '' });
    setShowAddVoucherModal(false);
  };

  const handleDeleteVoucher = (voucherId: string) => {
    const targetVoucher = lead.bookingVouchers.find(v => v.id === voucherId);
    setLead(prev => prev ? {
      ...prev,
      bookingVouchers: prev.bookingVouchers.filter(v => v.id !== voucherId),
      timeline: [{
        id: `T${Date.now()}`,
        type: 'voucher_added',
        description: `Removed booking voucher: ${targetVoucher?.referenceNumber || 'Voucher'}`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);
  };

  const handleAddInvoiceSubmit = () => {
    if (!newInvoice.description.trim() || !newInvoice.amount) return;

    const invoice: LeadInvoice = {
      id: `INV${Date.now()}`,
      description: newInvoice.description.trim(),
      amount: Number(newInvoice.amount) || 0,
      status: newInvoice.status,
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate || new Date().toISOString().split('T')[0],
    };

    setLead(prev => prev ? {
      ...prev,
      invoices: [...prev.invoices, invoice],
      timeline: [{
        id: `T${Date.now()}`,
        type: 'invoice_added',
        description: `Generated invoice: ${invoice.description} for ${formatINR(invoice.amount)}`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);

    setNewInvoice({ description: '', amount: '', status: 'Draft', dueDate: '' });
    setShowAddInvoiceModal(false);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const targetInvoice = lead.invoices.find(i => i.id === invoiceId);
    setLead(prev => prev ? {
      ...prev,
      invoices: prev.invoices.filter(i => i.id !== invoiceId),
      timeline: [{
        id: `T${Date.now()}`,
        type: 'invoice_added',
        description: `Deleted invoice: ${targetInvoice?.description || 'Invoice'}`,
        timestamp: new Date().toISOString(),
        actor: 'John Davis'
      }, ...prev.timeline]
    } : prev);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/agency/leads" className="mt-1 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-bold text-slate-900">{client?.name || 'Unknown Client'}</h1>
              <LeadStatusBadge status={lead.status} />
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <InfoBadge icon={Globe} text={lead.source} />
              <InfoBadge icon={Calendar} text={lead.date} />
              <InfoBadge icon={User} text={agent?.name || 'Unassigned'} />
              <Button size="xs" variant="outline" className="h-[26px] px-2.5 text-[11px] font-semibold" onClick={() => { setReassignAgentId(lead.assignedTo || ''); setShowReassignModal(true); }}>
                {lead.assignedTo ? 'Reassign Agent' : 'Assign Agent'}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowUpdateStatusModal(true)} size="sm">
            <Edit className="w-3.5 h-3.5 mr-1" /> Update Status
          </Button>
        </div>
      </div>

      {/* Navigation Tabs (Without count badges) */}
      <div className="border-b border-slate-200">
        <nav className="flex items-center gap-6 px-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Trip Details
          </button>

          <button
            onClick={() => setActiveTab('proposal')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'proposal'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Proposal & Costing
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Bookings & Vouchers
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'invoices'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Invoices
          </button>

          {/* Conditional Visa Checklist Tab */}
          {hasVisaCategory && (
            <button
              onClick={() => setActiveTab('visa')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'visa'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              Visa Checklist
            </button>
          )}

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Timeline
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="py-2">
        {/* ===================================================================== */}
        {/* TAB 1: TRIP DETAILS (Trip Info + Travellers + Trip Notes) */}
        {/* ===================================================================== */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Top Grid: Info & Meta */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Trip Information</CardTitle>
                    <Button variant="ghost" size="xs"><Edit className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <dt className="text-xs font-medium text-slate-500 mb-1">Destination</dt>
                        <dd className="text-sm font-medium text-slate-900">{lead.destination}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500 mb-1">Travel Dates</dt>
                        <dd className="text-sm font-medium text-slate-900">{lead.travelDateFrom} to {lead.travelDateTo}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500 mb-1">Budget</dt>
                        <dd className="text-sm font-medium text-slate-900">{lead.budget || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500 mb-1">Requirements & Categories</dt>
                        <dd className="flex flex-wrap gap-1.5 mt-1">
                          {lead.categories.map(c => (
                            <Badge key={c} variant={c === 'Visa' ? 'blue' : 'slate'}>
                              {c}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {lead.status === 'Lost' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-900">Lead Lost</h4>
                      <p className="text-sm text-red-700 mt-1">{lead.lostReason || 'No reason provided.'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Embedded Travellers Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Travellers Manifest ({lead.travellers.length})
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Confirmed and tentative members registered for this trip</p>
                </div>
                <Button size="xs" variant="outline" onClick={() => setShowAddTravellerModal(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Member to Trip
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {lead.travellers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name & Relation</th>
                          <th>Status</th>
                          <th>Age & Fare Class</th>
                          <th>Special Alerts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.travellers.map((traveller, idx) => {
                          const member = getMemberById(client!, traveller.memberId);
                          if (!member) return null;
                          const fareClass = deriveFareClass(member.dob, lead.travelDateFrom);
                          const hasBday = hasBirthdayDuringTrip(member.dob, lead.travelDateFrom, lead.travelDateTo);
                          const isDropped = traveller.status === 'Dropped';

                          return (
                            <tr key={idx} className={isDropped ? 'bg-slate-50/50 opacity-75' : ''}>
                              <td>
                                <div className={`font-semibold ${isDropped ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{member.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{member.relation} {member.dob && `· DOB: ${member.dob}`}</div>
                              </td>
                              <td>
                                <TravellerStatusBadge status={traveller.status} />
                                {isDropped && traveller.dropReason && (
                                  <div className="text-[10px] text-slate-500 mt-1 max-w-[120px] truncate" title={traveller.dropReason}>{traveller.dropReason}</div>
                                )}
                              </td>
                              <td>
                                <div className="text-sm font-medium text-slate-700">{fareClass}</div>
                              </td>
                              <td>
                                {hasBday && !isDropped ? (
                                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                    <Gift className="w-3.5 h-3.5 text-amber-600" /> Birthday occurs during trip!
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400">Standard</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No travellers assigned to this lead yet. Click "Add Member to Trip" above.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Embedded Trip Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Trip Notes & Internal Comments ({lead.notes.length})
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">All notes and communication records captured for this trip.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handlePostNote} className="flex gap-3">
                  <Input 
                    placeholder="Add a new internal note or call summary for this trip..." 
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="flex-1" 
                  />
                  <Button type="submit" size="sm" disabled={!newNoteText.trim()}>
                    <Send className="w-3.5 h-3.5" /> Post Note
                  </Button>
                </form>

                <div className="space-y-3 pt-2">
                  {lead.notes.map(note => (
                    <div key={note.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{note.author}</span>
                        <span className="text-[11px] text-slate-400">{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                  {lead.notes.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No trip notes recorded yet. Post a note above to record client interactions.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: PROPOSAL & COSTING (Interactive Proposal Builder) */}
        {/* ===================================================================== */}
        {activeTab === 'proposal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Proposal Items</CardTitle>
                    <div className="flex gap-2">
                      <Button size="xs" variant="outline" onClick={handleCopyPublicLink}>
                        {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5 mr-1" />}
                        {isCopied ? 'Copied!' : 'Copy Public Link'}
                      </Button>
                      <Button size="xs" onClick={() => setShowAddProposalModal(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Proposal Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Type & Supplier</th>
                          <th className="text-right">Net Cost</th>
                          <th className="text-right">Selling Price</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.proposalItems.map(item => (
                          <tr key={item.id}>
                            <td className="font-semibold text-slate-900">{item.description}</td>
                            <td>
                              <div className="text-sm font-medium text-slate-700">{item.type}</div>
                              <div className="text-xs text-slate-500">{item.supplier}</div>
                            </td>
                            <td className="text-right text-sm font-mono text-slate-600">{formatINR(item.netCost)}</td>
                            <td className="text-right text-sm font-bold text-slate-900">{formatINR(item.sellingPrice)}</td>
                            <td className="text-right">
                              <button 
                                onClick={() => handleDeleteProposalItem(item.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                title="Remove Proposal Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {lead.proposalItems.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-8">
                              <p className="text-sm text-slate-500">No items added to proposal yet.</p>
                              <Button size="xs" variant="outline" className="mt-2" onClick={() => setShowAddProposalModal(true)}>
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add First Item
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Costing Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Net Cost</span>
                        <span className="font-medium text-slate-900">{formatINR(totalNet)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Selling Price</span>
                        <span className="font-bold text-slate-900">{formatINR(totalSelling)}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                        <span className="text-slate-500">Estimated Profit</span>
                        <span className="font-bold text-emerald-600">{formatINR(totalSelling - totalNet)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Margin</span>
                        <span className="font-medium text-slate-700">{margin.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: BOOKINGS & VOUCHERS */}
        {/* ===================================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Booking Vouchers
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Manage confirmed bookings and vouchers for this trip.</p>
                </div>
                <Button size="xs" onClick={() => setShowAddVoucherModal(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Booking Voucher
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type & Supplier</th>
                      <th>Reference / PNR</th>
                      <th>Booking Date</th>
                      <th>Notes</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.bookingVouchers.map(voucher => (
                      <tr key={voucher.id}>
                        <td>
                          <div className="text-sm font-bold text-slate-900">{voucher.supplier}</div>
                          <div className="text-xs text-slate-500">{voucher.type}</div>
                        </td>
                        <td className="font-mono text-sm font-semibold text-slate-700">
                          {voucher.referenceNumber}
                        </td>
                        <td className="text-sm text-slate-600">{voucher.date}</td>
                        <td className="text-sm text-slate-500 max-w-[200px] truncate">
                          {voucher.notes || '-'}
                        </td>
                        <td className="text-right">
                          <button 
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Voucher"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {lead.bookingVouchers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          <p className="text-sm text-slate-500">No booking vouchers uploaded yet.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: INVOICES */}
        {/* ===================================================================== */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Trip Invoices
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Track and generate invoices for this lead.</p>
                </div>
                <Button size="xs" onClick={() => setShowAddInvoiceModal(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Generate Invoice
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID & Description</th>
                      <th>Status</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.invoices.map(invoice => (
                      <tr key={invoice.id}>
                        <td>
                          <div className="text-sm font-bold text-slate-900">{invoice.id}</div>
                          <div className="text-xs text-slate-500">{invoice.description}</div>
                        </td>
                        <td>
                          <Badge variant={invoice.status === 'Paid' ? 'emerald' : invoice.status === 'Overdue' ? 'red' : invoice.status === 'Draft' ? 'slate' : 'blue'}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="text-sm text-slate-600">{invoice.date}</td>
                        <td className="text-sm text-slate-600">{invoice.dueDate}</td>
                        <td className="text-right font-mono font-bold text-slate-900">
                          {formatINR(invoice.amount)}
                        </td>
                        <td className="text-right">
                          <button 
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {lead.invoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <p className="text-sm text-slate-500">No invoices generated yet.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: VISA CHECKLIST (Rendered ONLY if category contains Visa) */}
        {/* ===================================================================== */}
        {activeTab === 'visa' && hasVisaCategory && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Per-Traveller Visa Document Checklist
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Track visa application stages for each confirmed traveller on this trip.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Traveller Name</th>
                      <th>Status</th>
                      <th className="w-80">Visa Steps & Checkmarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.travellers.map((traveller, idx) => {
                      const member = getMemberById(client!, traveller.memberId);
                      if (!member) return null;
                      const isDropped = traveller.status === 'Dropped';

                      return (
                        <tr key={idx} className={isDropped ? 'bg-slate-50/50 opacity-75' : ''}>
                          <td>
                            <div className="font-semibold text-slate-900">{member.name}</div>
                            <div className="text-xs text-slate-500">{member.relation}</div>
                          </td>
                          <td>
                            <TravellerStatusBadge status={traveller.status} />
                          </td>
                          <td>
                            {!isDropped ? (
                              <div className="grid grid-cols-5 gap-1.5">
                                {[
                                  { label: 'Passport Collected', key: 'passportCollected', val: traveller.visaChecklist.passportCollected },
                                  { label: 'Photos Collected', key: 'photosCollected', val: traveller.visaChecklist.photosCollected },
                                  { label: 'Forms Filled', key: 'formsFilled', val: traveller.visaChecklist.formsFilled },
                                  { label: 'Submitted to Embassy', key: 'submittedToEmbassy', val: traveller.visaChecklist.submittedToEmbassy },
                                  { label: 'Visa Approved', key: 'approved', val: traveller.visaChecklist.approved }
                                ].map(item => (
                                  <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => handleToggleVisaChecklist(idx, item.key)}
                                    title={`${item.label}: ${item.val ? 'Completed' : 'Click to mark complete'}`}
                                    className={`h-8 rounded-lg flex flex-col items-center justify-center transition-all ${
                                      item.val
                                        ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'
                                    }`}
                                  >
                                    {item.val ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                    <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{item.label.split(' ')[0]}</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Dropped traveller</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: TIMELINE */}
        {/* ===================================================================== */}
        {activeTab === 'timeline' && (
          <div className="max-w-2xl py-4">
            <div className="space-y-6">
              {lead.timeline.map((event, idx) => {
                const isLast = idx === lead.timeline.length - 1;
                return (
                  <div key={event.id} className="relative flex gap-4">
                    {!isLast && <div className="absolute left-[15px] top-[30px] bottom-[-24px] w-px bg-slate-200" />}
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center flex-shrink-0 z-10 text-slate-500">
                      {event.type === 'status_change' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      {event.type === 'traveller_added' && <Plus className="w-4 h-4" />}
                      {event.type === 'traveller_dropped' && <Trash2 className="w-4 h-4" />}
                      {event.type === 'link_shared' && <LinkIcon className="w-4 h-4" />}
                      {event.type === 'created' && <FileText className="w-4 h-4" />}
                      {event.type === 'note_added' && <MessageSquare className="w-4 h-4" />}
                      {event.type === 'reassigned' && <Users className="w-4 h-4" />}
                      {event.type === 'proposal_item' && <DollarSign className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.description}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(event.timestamp).toLocaleString()} · by {event.actor}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD TRAVELLER TO TRIP MODAL */}
      {/* ===================================================================== */}
      <Modal open={showAddTravellerModal} onClose={() => setShowAddTravellerModal(false)}>
        <ModalHeader onClose={() => setShowAddTravellerModal(false)}>
          <ModalTitle>Add Member to Trip Manifest</ModalTitle>
          <ModalDescription>Select family or team members from {client?.name} to register for this trip.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {isCreatingMember ? (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-800">Create New Member</h3>
                  <Button variant="ghost" size="xs" onClick={() => setIsCreatingMember(false)} className="text-slate-500">Cancel</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name *</label>
                    <Input placeholder="e.g. Rahul Sharma" value={newMemberData.name} onChange={e => setNewMemberData(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Relation</label>
                    <Select value={newMemberData.relation} onChange={e => setNewMemberData(p => ({ ...p, relation: e.target.value as any }))}>
                      <option value="Self">Self</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Date of Birth</label>
                    <Input type="date" value={newMemberData.dob} onChange={e => setNewMemberData(p => ({ ...p, dob: e.target.value }))} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Available Members ({client?.members.filter(m => m.isActive).length})</label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {client?.members.filter(m => m.isActive).map(member => {
                      const isAlreadyAdded = lead.travellers.some(t => t.memberId === member.id);
                      const isSelected = !!selectedMemberIds[member.id];

                      return (
                        <div 
                          key={member.id} 
                          onClick={() => {
                            if (!isAlreadyAdded) {
                              setSelectedMemberIds(p => ({ ...p, [member.id]: !p[member.id] }));
                            }
                          }}
                          className={`p-3 flex items-center justify-between ${
                            isAlreadyAdded ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isAlreadyAdded ? 'bg-slate-200 border-slate-300' : isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isAlreadyAdded && <Check className="w-3 h-3 text-slate-500" />}
                              {!isAlreadyAdded && isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.relation} {member.dob && `· DOB: ${member.dob}`}</p>
                            </div>
                          </div>
                          {isAlreadyAdded && (
                            <span className="text-[11px] font-semibold text-slate-500">Already Registered</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-500">OR</span></div>
                </div>

                <Button variant="outline" className="w-full h-12 border-dashed border-2 hover:bg-slate-50" onClick={() => setIsCreatingMember(true)}>
                  <Plus className="w-4 h-4 text-slate-400 mr-2" /> Create New Member
                </Button>
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddTravellerModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddTravellersSubmit} disabled={isCreatingMember ? !newMemberData.name.trim() : Object.values(selectedMemberIds).filter(Boolean).length === 0}>
            {isCreatingMember ? 'Create & Add Member' : 'Add Selected Members'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 2: ADD PROPOSAL ITEM & COSTING MODAL */}
      {/* ===================================================================== */}
      <Modal open={showAddProposalModal} onClose={() => setShowAddProposalModal(false)}>
        <ModalHeader onClose={() => setShowAddProposalModal(false)}>
          <ModalTitle>Add Proposal Line Item & Costing</ModalTitle>
          <ModalDescription>Enter supplier net cost and client selling price for this travel component.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Description *</label>
              <Input
                type="text"
                placeholder="e.g. 5 Nights Stay at Anantara Bangkok Resort & Spa"
                value={newProposalItem.description}
                onChange={e => setNewProposalItem({ ...newProposalItem, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Component Type *</label>
                <Select
                  value={newProposalItem.type}
                  onChange={e => setNewProposalItem({ ...newProposalItem, type: e.target.value as any })}
                >
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Activity">Activity</option>
                  <option value="Visa Fee">Visa Fee</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier / Vendor Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Agoda / Direct Hotel"
                  value={newProposalItem.supplier}
                  onChange={e => setNewProposalItem({ ...newProposalItem, supplier: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Net Supplier Cost (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g. 45000"
                  value={newProposalItem.netCost}
                  onChange={e => setNewProposalItem({ ...newProposalItem, netCost: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Selling Price (₹) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 58000"
                  value={newProposalItem.sellingPrice}
                  onChange={e => setNewProposalItem({ ...newProposalItem, sellingPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Calculated Preview */}
            {newProposalItem.sellingPrice && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>Estimated Item Profit:</span>
                <span className="text-emerald-700 font-bold">
                  {formatINR((Number(newProposalItem.sellingPrice) || 0) - (Number(newProposalItem.netCost) || 0))}
                </span>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddProposalModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddProposalItemSubmit} disabled={!newProposalItem.description.trim() || !newProposalItem.sellingPrice}>
            Add Line Item
          </Button>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 3: ADD BOOKING VOUCHER MODAL */}
      {/* ===================================================================== */}
      <Modal open={showAddVoucherModal} onClose={() => setShowAddVoucherModal(false)}>
        <ModalHeader onClose={() => setShowAddVoucherModal(false)}>
          <ModalTitle>Add Booking Voucher</ModalTitle>
          <ModalDescription>Record confirmed booking details (PNR, Ticket numbers, Hotel conf) for this trip.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Type *</label>
                <Select
                  value={newVoucher.type}
                  onChange={e => setNewVoucher({ ...newVoucher, type: e.target.value as any })}
                >
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Activity">Activity</option>
                  <option value="Visa">Visa</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Emirates, Hilton"
                  value={newVoucher.supplier}
                  onChange={e => setNewVoucher({ ...newVoucher, supplier: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reference Number / PNR *</label>
              <Input
                type="text"
                placeholder="e.g. ABCXYZ, HTL-98765"
                value={newVoucher.referenceNumber}
                onChange={e => setNewVoucher({ ...newVoucher, referenceNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Notes</label>
              <Input
                type="text"
                placeholder="Any special remarks or instructions"
                value={newVoucher.notes}
                onChange={e => setNewVoucher({ ...newVoucher, notes: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddVoucherModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddVoucherSubmit} disabled={!newVoucher.supplier.trim() || !newVoucher.referenceNumber.trim()}>
            Save Booking
          </Button>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 4: ADD INVOICE MODAL */}
      {/* ===================================================================== */}
      <Modal open={showAddInvoiceModal} onClose={() => setShowAddInvoiceModal(false)}>
        <ModalHeader onClose={() => setShowAddInvoiceModal(false)}>
          <ModalTitle>Generate Invoice</ModalTitle>
          <ModalDescription>Create a new invoice for this lead's bookings or services.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Description *</label>
              <Input
                type="text"
                placeholder="e.g. 50% Advance Payment for Package"
                value={newInvoice.description}
                onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 150000"
                  value={newInvoice.amount}
                  onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <Select
                  value={newInvoice.status}
                  onChange={e => setNewInvoice({ ...newInvoice, status: e.target.value as any })}
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <Input
                type="date"
                value={newInvoice.dueDate}
                onChange={e => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddInvoiceModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddInvoiceSubmit} disabled={!newInvoice.description.trim() || !newInvoice.amount}>
            Save Invoice
          </Button>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 5: UPDATE STATUS MODAL */}
      {/* ===================================================================== */}
      <Modal open={showUpdateStatusModal} onClose={() => setShowUpdateStatusModal(false)}>
        <ModalHeader onClose={() => setShowUpdateStatusModal(false)}>
          <ModalTitle>Update Lead Status</ModalTitle>
          <ModalDescription>Change the status of this lead and provide mandatory remarks.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Status *</label>
              <Select
                value={updateStatusData.status}
                onChange={e => setUpdateStatusData({ ...updateStatusData, status: e.target.value as LeadStatus })}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiating">Negotiating</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Notes *</label>
              <textarea
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[100px]"
                placeholder="Why are you changing the status? These remarks will be saved to the lead notes."
                value={updateStatusData.remarks}
                onChange={e => setUpdateStatusData({ ...updateStatusData, remarks: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowUpdateStatusModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleUpdateStatusSubmit} disabled={!updateStatusData.remarks.trim()}>
            Update Status
          </Button>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 6: REASSIGN AGENT MODAL */}
      {/* ===================================================================== */}
      <Modal open={showReassignModal} onClose={() => setShowReassignModal(false)}>
        <ModalHeader onClose={() => setShowReassignModal(false)}>
          <ModalTitle>{lead.assignedTo ? 'Reassign Agent' : 'Assign Agent'}</ModalTitle>
          <ModalDescription>Select an agent to take ownership of this lead.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Agent *</label>
              <Select
                value={reassignAgentId}
                onChange={e => setReassignAgentId(e.target.value)}
              >
                <option value="" disabled>Select an agent...</option>
                {initialAgents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowReassignModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleReassignAgentSubmit} disabled={!reassignAgentId || reassignAgentId === lead.assignedTo}>
            Confirm Assignment
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  );
}
