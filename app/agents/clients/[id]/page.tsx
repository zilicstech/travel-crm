'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { initialClients, initialLeads, Client, Member, Relation, getPassportStatus, getAgentById } from '@/lib/mockData';
import { getActiveDocumentTypes } from '@/lib/agencySettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users, Plus, Upload, FileText, CheckCircle2 } from 'lucide-react';

const RELATIONS: Relation[] = ['Self', 'Spouse', 'Son', 'Daughter', 'Parent', 'Sibling', 'Friend', 'Colleague', 'Other'];

export default function AgentClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | undefined>(() => initialClients.find(c => c.id === clientId));
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({ relation: 'Self' });

  // Document Upload Modal state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [docTypes, setDocTypes] = useState<string[]>([]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('');

  useEffect(() => {
    setDocTypes(getActiveDocumentTypes());
    if (getActiveDocumentTypes().length > 0) {
      setNewDocType(getActiveDocumentTypes()[0]);
    }
  }, []);

  if (!client) {
    return (
      <div className="space-y-6 text-left">
        <h1 className="text-xl font-bold text-slate-900">Client Not Found</h1>
        <Link href="/agents/clients" className="text-blue-600 hover:underline text-sm">&larr; Back to Clients</Link>
      </div>
    );
  }

  const agent = getAgentById(client.owningAgentId);
  const clientLeads = initialLeads.filter(l => l.clientId === client.id);
  const activeMembers = client.members.filter(m => m.isActive);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relation) return;

    const member: Member = {
      id: `M${Date.now()}`,
      name: newMember.name,
      relation: newMember.relation,
      gender: newMember.gender,
      dob: newMember.dob,
      nationality: newMember.nationality,
      passportNumber: newMember.passportNumber,
      passportExpiry: newMember.passportExpiry,
      phone: newMember.phone,
      email: newMember.email,
      documents: [],
      isActive: true,
    };

    const updated = { ...client, members: [...client.members, member] };
    setClient(updated);
    setShowAddMember(false);
    setNewMember({ relation: 'Self' });
  };

  const handleUploadDocument = () => {
    if (!selectedMember || !newDocName.trim()) return;

    const newDoc = {
      id: `D${Date.now()}`,
      name: newDocName.trim(),
      type: (newDocType || 'Other') as any,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    const updatedMembers = client.members.map(m => {
      if (m.id === selectedMember.id) {
        return { ...m, documents: [...m.documents, newDoc] };
      }
      return m;
    });

    const updatedClient = { ...client, members: updatedMembers };
    setClient(updatedClient);
    setSelectedMember({ ...selectedMember, documents: [...selectedMember.documents, newDoc] });
    setNewDocName('');
  };

  const getPassportBadge = (member: Member) => {
    const status = getPassportStatus(member);
    if (status === 'missing') return <span className="text-slate-400 text-xs">Not provided</span>;
    if (status === 'expiring') return <Badge variant="amber" dot>Expiring &lt;6mo</Badge>;
    return <Badge variant="green" dot>Valid</Badge>;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <Link href="/agents/clients" className="text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors">&larr; Back to Clients</Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
              <Badge variant={client.type === 'B2B' ? 'purple' : 'blue'}>{client.type}</Badge>
            </div>
            <p className="text-sm text-slate-500 font-mono mt-0.5">{client.identifier}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowAddMember(true)}>
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <span className="metric-label">Owning Agent</span>
          <p className="metric-value text-base mt-1">{agent?.name || 'Unassigned'}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Family / Team Members</span>
          <p className="metric-value">{activeMembers.length}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Leads</span>
          <p className="metric-value">{clientLeads.length}</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Passport Attention</span>
          <p className="metric-value text-amber-600">
            {activeMembers.filter(m => getPassportStatus(m) !== 'ok').length}
          </p>
        </div>
      </div>

      {/* Members Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members & Travellers ({activeMembers.length})</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Individual members under this account with passports & document vaults.</p>
          </div>
          <Button size="xs" variant="outline" onClick={() => setShowAddMember(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Member
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {activeMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Nationality</th>
                    <th>Passport</th>
                    <th>Passport Status</th>
                    <th>Vault Documents</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="font-medium text-slate-900">{member.name}</div>
                        {member.id === client.mainContactId && (
                          <span className="text-[10px] font-semibold text-blue-600 uppercase">Primary Contact</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={member.relation === 'Self' ? 'blue' : 'default'}>{member.relation}</Badge>
                      </td>
                      <td className="text-slate-500 text-sm">{member.dob || '—'}</td>
                      <td className="text-slate-500 text-sm">{member.gender || '—'}</td>
                      <td className="text-slate-500 text-sm">{member.nationality || '—'}</td>
                      <td className="text-sm font-mono text-slate-600">{member.passportNumber || '—'}</td>
                      <td>{getPassportBadge(member)}</td>
                      <td>
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" /> {member.documents.length} Docs
                        </button>
                      </td>
                      <td className="text-right">
                        <Button size="xs" variant="outline" onClick={() => setSelectedMember(member)}>
                          <Upload className="w-3.5 h-3.5" /> Upload Doc
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Users} title="No members yet" description="Add family members, friends, or colleagues to this client." action={{ label: 'Add Member', onClick: () => setShowAddMember(true) }} />
          )}
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <Modal open={showAddMember} onClose={() => setShowAddMember(false)} size="lg">
        <ModalHeader onClose={() => setShowAddMember(false)}>
          <ModalTitle>Add Member</ModalTitle>
          <ModalDescription>Only name and relation are required. Fill in the rest later.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name *</label>
              <Input placeholder="e.g. Sanya Sharma" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Relation *</label>
              <Select value={newMember.relation} onChange={e => setNewMember(p => ({ ...p, relation: e.target.value as Relation }))}>
                {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Date of Birth</label>
              <Input type="date" value={newMember.dob} onChange={e => setNewMember(p => ({ ...p, dob: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Gender</label>
              <Select value={newMember.gender} onChange={e => setNewMember(p => ({ ...p, gender: e.target.value as any }))}>
                <option value="">—</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Nationality</label>
              <Input placeholder="e.g. Indian" value={newMember.nationality} onChange={e => setNewMember(p => ({ ...p, nationality: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Passport Number</label>
              <Input placeholder="e.g. L9876543" value={newMember.passportNumber} onChange={e => setNewMember(p => ({ ...p, passportNumber: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Passport Expiry</label>
              <Input type="date" value={newMember.passportExpiry} onChange={e => setNewMember(p => ({ ...p, passportExpiry: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
              <Input placeholder="+919876543210" value={newMember.phone} onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddMember} disabled={!newMember.name || !newMember.relation}>Add Member</Button>
        </ModalFooter>
      </Modal>

      {/* Member Document Vault & Upload Modal */}
      {selectedMember && (
        <Modal open={!!selectedMember} onClose={() => setSelectedMember(null)} size="lg">
          <ModalHeader onClose={() => setSelectedMember(null)}>
            <ModalTitle>Document Vault — {selectedMember.name}</ModalTitle>
            <ModalDescription>View uploaded documents or attach a new document using configured document types.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Existing Documents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Uploaded Documents ({selectedMember.documents.length})</h4>
                {selectedMember.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMember.documents.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                            <p className="text-xs text-slate-500">Type: <span className="font-semibold text-slate-700">{doc.type}</span> · Uploaded: {doc.uploadDate}</p>
                          </div>
                        </div>
                        <Badge variant="blue">Attached</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    No documents uploaded yet for this member.
                  </div>
                )}
              </div>

              {/* Upload Form using Configured Document Types */}
              <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" /> Upload New Member Document
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Document Name / File Label *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Passport Front Page Scan"
                      value={newDocName}
                      onChange={e => setNewDocName(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Select Document Type *</label>
                      <span className="text-[10px] text-blue-600 font-semibold">Configured in Settings</span>
                    </div>
                    <Select value={newDocType} onChange={e => setNewDocType(e.target.value)}>
                      {docTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Button size="sm" onClick={handleUploadDocument} disabled={!newDocName.trim()}>
                    <CheckCircle2 className="w-4 h-4" /> Save Document to Member Vault
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}

    </div>
  );
}
