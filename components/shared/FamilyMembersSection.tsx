import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, Plus, FileText, UploadCloud, X, Calendar } from 'lucide-react';
import { FamilyMember } from '@/lib/mockData';

interface FamilyMembersSectionProps {
  initialMembers: FamilyMember[];
}

export function FamilyMembersSection({ initialMembers }: FamilyMembersSectionProps) {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Spouse');
  const [newDob, setNewDob] = useState('');

  const handleAddMember = () => {
    if (!newName) return;
    const newMember: FamilyMember = {
      id: `F${Date.now()}`,
      name: newName,
      relation: newRelation,
      dob: newDob,
      documents: []
    };
    setMembers([...members, newMember]);
    setNewName('');
    setNewRelation('Spouse');
    setNewDob('');
    setShowAddModal(false);
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center">
          <Users className="w-4 h-4 mr-2 text-slate-400" /> Family Members ({members.length})
        </h2>
        <Button size="sm" variant="outline" className="text-xs font-semibold" onClick={() => setShowAddModal(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map(member => (
          <Card key={member.id} className="shadow-sm">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">{member.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {member.relation}
                  </span>
                  {member.dob && (
                    <span className="text-xs text-slate-500 font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {member.dob}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Documents ({member.documents?.length || 0})
              </h4>
              <div className="space-y-3">
                {member.documents?.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">{doc.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-blue-600 font-bold">View</Button>
                  </div>
                ))}
                
                <button className="w-full py-2.5 border border-dashed border-slate-300 rounded-md text-xs font-semibold text-slate-600 flex items-center justify-center hover:bg-white hover:border-blue-400 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Upload Document
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {members.length === 0 && (
          <div className="col-span-1 md:col-span-2 p-8 text-center bg-white border border-slate-200 rounded-lg">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No family members added yet.</p>
            <p className="text-xs text-slate-400 mt-1">Keep track of spouses, children, and their travel documents.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Add Family Member</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. John Doe" className="h-9 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Relation</label>
                <select 
                  value={newRelation} 
                  onChange={e => setNewRelation(e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Date of Birth (Optional)</label>
                <Input type="date" value={newDob} onChange={e => setNewDob(e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAddMember} disabled={!newName} className="bg-blue-600 hover:bg-blue-700 text-white">Save Member</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
