'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initialLeads, Lead, LeadStatus, LeadCategory, ProposalItem, VisaTracker } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, Users, DollarSign,
  Plus, Trash2, CheckSquare, Square, ClipboardList, Send, MessageSquare,
  FileText, Link as LinkIcon, ChevronDown, Edit2, Check, Clock
} from 'lucide-react';

const ALL_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Booked', 'Lost'];

const STATUS_COLORS: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-cyan-100 text-cyan-700',
  'Qualified': 'bg-indigo-100 text-indigo-700',
  'Proposal Sent': 'bg-purple-100 text-purple-700',
  'Negotiating': 'bg-orange-100 text-orange-700',
  'Booked': 'bg-green-100 text-green-700',
  'Lost': 'bg-slate-100 text-slate-500',
};

const CATEGORY_ICONS: Record<LeadCategory, string> = {
  'Holiday Package': '🏖',
  'Hotel': '🏨',
  'Flight': '✈️',
  'Visa': '🛂',
};

const ITEM_TYPES: ProposalItem['type'][] = ['Flight', 'Hotel', 'Transfer', 'Activity', 'Visa Fee', 'Miscellaneous'];

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // In a real app this would come from a global store; here we use local state seeded from mock data
  const found = initialLeads.find(l => l.id === leadId);
  const [lead, setLead] = useState<Lead | null>(found ?? null);
  const [noteText, setNoteText] = useState('');
  const [newItem, setNewItem] = useState<Partial<ProposalItem>>({ type: 'Flight', description: '', supplier: '', netCost: 0, sellingPrice: 0 });
  const [showAddItem, setShowAddItem] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(false);

  if (!lead) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Lead Not Found</h2>
        <Button variant="outline" size="sm" onClick={() => router.back()}>← Back to Leads</Button>
      </div>
    );
  }

  // ── Updaters ──────────────────────────────────────────────────────────────

  const updateStatus = (status: LeadStatus) => setLead(l => l ? { ...l, status } : l);
  const updateFollowUp = (date: string) => setLead(l => l ? { ...l, followUpDate: date } : l);

  const addNote = () => {
    if (!noteText.trim()) return;
    const note = { id: `N${Date.now()}`, text: noteText.trim(), timestamp: new Date().toISOString(), author: 'Liam Smith' };
    setLead(l => l ? { ...l, notes: [note, ...l.notes] } : l);
    setNoteText('');
  };

  const addProposalItem = () => {
    if (!newItem.description) return;
    const item: ProposalItem = {
      id: `PI${Date.now()}`,
      type: newItem.type ?? 'Flight',
      description: newItem.description ?? '',
      supplier: newItem.supplier ?? '',
      netCost: Number(newItem.netCost) || 0,
      sellingPrice: Number(newItem.sellingPrice) || 0,
    };
    setLead(l => l ? { ...l, proposalItems: [...l.proposalItems, item] } : l);
    setNewItem({ type: 'Flight', description: '', supplier: '', netCost: 0, sellingPrice: 0 });
    setShowAddItem(false);
  };

  const removeProposalItem = (id: string) => {
    setLead(l => l ? { ...l, proposalItems: l.proposalItems.filter(i => i.id !== id) } : l);
  };

  const toggleVisaStep = (field: keyof VisaTracker) => {
    setLead(l => {
      if (!l || !l.visaTracker) return l;
      return { ...l, visaTracker: { ...l.visaTracker, [field]: !l.visaTracker[field] } };
    });
  };

  // ── Computed ──────────────────────────────────────────────────────────────

  const totalNet = lead.proposalItems.reduce((s, i) => s + i.netCost, 0);
  const totalSelling = lead.proposalItems.reduce((s, i) => s + i.sellingPrice, 0);
  const margin = totalSelling > 0 ? (((totalSelling - totalNet) / totalSelling) * 100).toFixed(1) : '0.0';
  const totalGuests = lead.guestDetails.adults + lead.guestDetails.children + lead.guestDetails.infants;

  const hasVisa = lead.categories.includes('Visa');

  const visaSteps: { key: keyof VisaTracker; label: string; description: string }[] = [
    { key: 'passportCollected', label: 'Passport Collected', description: 'Original passport received from client' },
    { key: 'photosCollected', label: 'Photos Collected', description: 'Passport-size photos received (2 per pax)' },
    { key: 'formsFilled', label: 'Application Forms Filled', description: 'All embassy forms completed and signed' },
    { key: 'submittedToEmbassy', label: 'Submitted to Embassy / VFS', description: 'Application submitted for processing' },
    { key: 'approved', label: 'Visa Approved', description: 'Visa stamped and returned to client' },
  ];

  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/proposal/${lead.id}`;
    navigator.clipboard.writeText(url);
    setLinkGenerated(true);
    setTimeout(() => setLinkGenerated(false), 3000);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <button onClick={() => router.back()} className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Leads
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
              {/* Status selector */}
              <div className="relative group">
                <button className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_COLORS[lead.status]}`}>
                  {lead.status} <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-10 min-w-[180px] py-1 hidden group-hover:block">
                  {ALL_STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(s)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center gap-2 ${lead.status === s ? 'text-blue-600' : 'text-slate-700'}`}>
                      {lead.status === s && <Check className="w-3 h-3" />}
                      {lead.status !== s && <span className="w-3" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
              <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" />{lead.countryCode} {lead.phone}</span>
              <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5" />{lead.email}</span>
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5" />{lead.destination}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {lead.categories.map(cat => (
                <span key={cat} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {CATEGORY_ICONS[cat]} {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Follow-up Date */}
          <div className={`flex-shrink-0 p-4 rounded-xl border ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Follow-up Date</p>
            {editingFollowUp ? (
              <div className="flex gap-2 items-center">
                <Input type="date" defaultValue={lead.followUpDate}
                  onChange={e => updateFollowUp(e.target.value)} className="h-8 text-xs w-36" />
                <button onClick={() => setEditingFollowUp(false)} className="text-blue-600 hover:text-blue-700">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold ${isOverdue ? 'text-red-700' : 'text-slate-900'}`}>
                  {lead.followUpDate || 'Not set'}
                  {isOverdue && <span className="ml-2 text-[10px] font-bold text-red-600 uppercase">Overdue</span>}
                </p>
                <button onClick={() => setEditingFollowUp(true)} className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section A: Lead Summary ──────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
            <ClipboardList className="w-4 h-4 mr-2 text-blue-600" /> Lead Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Travel Dates</p>
              <p className="text-sm font-bold text-slate-900">{lead.travelDateFrom || '–'}</p>
              <p className="text-xs text-slate-500">to {lead.travelDateTo || '–'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Guests</p>
              <p className="text-sm font-bold text-slate-900">{totalGuests} Total</p>
              <p className="text-xs text-slate-500">{lead.guestDetails.adults}A · {lead.guestDetails.children}C · {lead.guestDetails.infants}I</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Budget</p>
              <p className="text-sm font-bold text-slate-900">{lead.budget || '–'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Created</p>
              <p className="text-sm font-bold text-slate-900">{lead.date}</p>
              {lead.customerId && <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-0.5">Existing Customer</p>}
            </div>
          </div>
          {lead.guestDetails.specialRequirements && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">Special Requirements</p>
              <p className="text-sm text-slate-700">{lead.guestDetails.specialRequirements}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section B: Proposal Builder ─────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-purple-600" /> Proposal Builder
          </CardTitle>
          <Button size="sm" onClick={() => setShowAddItem(!showAddItem)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-8 px-3">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Add Item form */}
          {showAddItem && (
            <div className="p-4 bg-purple-50 border-b border-purple-100 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                  <select value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value as ProposalItem['type'] }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none">
                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                  <Input value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                    placeholder="e.g., Mumbai–Dubai return (Economy)" className="h-9 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Supplier</label>
                  <Input value={newItem.supplier} onChange={e => setNewItem(p => ({ ...p, supplier: e.target.value }))}
                    placeholder="e.g., Emirates" className="h-9 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Net Cost (₹)</label>
                  <Input type="number" value={newItem.netCost || ''} onChange={e => setNewItem(p => ({ ...p, netCost: +e.target.value }))}
                    placeholder="0" className="h-9 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Selling Price (₹)</label>
                  <Input type="number" value={newItem.sellingPrice || ''} onChange={e => setNewItem(p => ({ ...p, sellingPrice: +e.target.value }))}
                    placeholder="0" className="h-9 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowAddItem(false)} className="h-8 text-xs text-slate-600">Cancel</Button>
                <Button size="sm" onClick={addProposalItem} disabled={!newItem.description}
                  className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50">
                  Add to Proposal
                </Button>
              </div>
            </div>
          )}

          {/* Items table */}
          {lead.proposalItems.length > 0 ? (
            <>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Supplier</th>
                    <th className="px-6 py-3 text-right">Net Cost</th>
                    <th className="px-6 py-3 text-right">Selling Price</th>
                    <th className="px-6 py-3 text-right">Margin</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lead.proposalItems.map(item => {
                    const itemMargin = item.sellingPrice > 0 ? (((item.sellingPrice - item.netCost) / item.sellingPrice) * 100).toFixed(0) : '0';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider">{item.type}</span>
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900 font-medium">{item.description}</td>
                        <td className="px-6 py-3 text-sm text-slate-500">{item.supplier}</td>
                        <td className="px-6 py-3 text-sm text-right text-slate-600">₹{item.netCost.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3 text-sm text-right font-bold text-slate-900">₹{item.sellingPrice.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3 text-right">
                          <span className={`text-xs font-bold ${Number(itemMargin) >= 15 ? 'text-green-600' : Number(itemMargin) >= 5 ? 'text-amber-600' : 'text-red-500'}`}>
                            {itemMargin}%
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={() => removeProposalItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">Total</td>
                    <td className="px-6 py-3 text-sm text-right text-slate-600 font-bold">₹{totalNet.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3 text-sm text-right font-bold text-green-700">₹{totalSelling.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`text-sm font-bold ${Number(margin) >= 15 ? 'text-green-600' : 'text-amber-600'}`}>{margin}%</span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>

              {/* Generate Link CTA */}
              <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-sm font-bold text-slate-900">Ready to share with client?</p>
                  <p className="text-xs text-slate-500">Generate a shareable proposal link to send over WhatsApp or Email</p>
                </div>
                <Button onClick={handleCopyLink}
                  className={`h-9 px-4 text-xs font-semibold ${linkGenerated ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  {linkGenerated ? <><Check className="w-3.5 h-3.5 mr-1.5" /> Link Copied!</> : <><LinkIcon className="w-3.5 h-3.5 mr-1.5" /> Generate & Copy Link</>}
                </Button>
              </div>
            </>
          ) : (
            <div className="p-10 text-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No proposal items yet.</p>
              <p className="text-xs text-slate-400 mt-0.5">Click "Add Item" above to start building the proposal.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section C: Visa Tracker (conditional) ───────────────────────── */}
      {hasVisa && lead.visaTracker && (
        <Card>
          <CardHeader className="flex flex-row items-center border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              🛂 <span className="ml-2">Visa Tracker</span>
            </CardTitle>
            <div className="ml-auto flex items-center gap-2">
              {(() => {
                const steps = Object.values(lead.visaTracker);
                const done = steps.filter(Boolean).length;
                return (
                  <>
                    <div className="flex gap-1">
                      {steps.map((v, i) => (
                        <div key={i} className={`w-5 h-1.5 rounded-full ${v ? 'bg-green-500' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{done}/5 steps</span>
                  </>
                );
              })()}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {visaSteps.map((step, idx) => {
              const done = lead.visaTracker![step.key];
              return (
                <button key={step.key} onClick={() => toggleVisaStep(step.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    done ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    done ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${done ? 'text-green-800' : 'text-slate-700'}`}>{step.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                  {done
                    ? <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <Square className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  }
                </button>
              );
            })}
            {lead.visaTracker.approved && (
              <div className="mt-2 p-3 bg-green-100 border border-green-300 rounded-xl text-center">
                <p className="text-sm font-bold text-green-800">✅ Visa Approved — All steps complete!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Section D: Activity & Notes Log ─────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-slate-500" /> Activity & Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Add note */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">LS</div>
            <div className="flex-1 space-y-2">
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note, log a call, or record any update..."
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white min-h-[80px] resize-none"
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) addNote(); }}
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400">Ctrl+Enter to submit</span>
                <Button size="sm" onClick={addNote} disabled={!noteText.trim()}
                  className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50">
                  <Send className="w-3 h-3 mr-1.5" /> Add Note
                </Button>
              </div>
            </div>
          </div>

          {/* Notes list */}
          {lead.notes.length > 0 ? (
            <div className="space-y-3">
              {lead.notes.map(note => (
                <div key={note.id} className="flex gap-3">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {note.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="w-px flex-1 bg-slate-100 mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{note.author}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {formatTimestamp(note.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-1" />
              <p className="text-sm text-slate-400">No notes yet. Add the first one above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
