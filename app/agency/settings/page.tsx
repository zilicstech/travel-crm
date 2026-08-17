'use client';

import React, { useState, useEffect } from 'react';
import { 
  getTravelCategories, saveTravelCategories,
  getDocumentTypes, saveDocumentTypes,
  getLeadSources, saveLeadSources,
  getTravelPreferences, saveTravelPreferences,
  getAgencyProfile, saveAgencyProfile,
  DynamicSettingItem, AgencyProfileSetting 
} from '@/lib/agencySettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { 
  Sliders, Plus, CheckCircle2, Trash2, Edit2, ToggleLeft, ToggleRight, 
  Layers, FileText, Share2, Building2, Save, Sparkles 
} from 'lucide-react';

type Tab = 'categories' | 'documents' | 'sources' | 'preferences' | 'profile';

export default function AgencySettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');

  // Dynamic Lists State
  const [categories, setCategories] = useState<DynamicSettingItem[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DynamicSettingItem[]>([]);
  const [leadSources, setLeadSources] = useState<DynamicSettingItem[]>([]);
  const [travelPreferences, setTravelPreferences] = useState<DynamicSettingItem[]>([]);
  const [profile, setProfile] = useState<AgencyProfileSetting>({
    agencyName: '', ownerName: '', email: '', gstNumber: '', currency: '', defaultCommission: 0
  });

  // Modal State
  const [newItemName, setNewItemName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DynamicSettingItem | null>(null);
  const [saveToast, setSaveToast] = useState('');

  useEffect(() => {
    setCategories(getTravelCategories());
    setDocumentTypes(getDocumentTypes());
    setLeadSources(getLeadSources());
    setTravelPreferences(getTravelPreferences());
    setProfile(getAgencyProfile());
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // ── Handlers for Travel Categories ─────────────────────────────────────────
  const handleToggleCategory = (id: string) => {
    const updated = categories.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setCategories(updated);
    saveTravelCategories(updated);
    triggerToast('Travel categories updated successfully');
  };

  const handleAddCategory = () => {
    if (!newItemName.trim()) return;
    const newItem: DynamicSettingItem = {
      id: `cat-${Date.now()}`,
      name: newItemName.trim(),
      active: true,
    };
    const updated = [...categories, newItem];
    setCategories(updated);
    saveTravelCategories(updated);
    setNewItemName('');
    setShowAddModal(false);
    triggerToast(`Added "${newItem.name}" to travel categories`);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(item => item.id !== id);
    setCategories(updated);
    saveTravelCategories(updated);
    triggerToast('Category removed successfully');
  };

  // ── Handlers for Document Types ─────────────────────────────────────────────
  const handleToggleDocument = (id: string) => {
    const updated = documentTypes.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setDocumentTypes(updated);
    saveDocumentTypes(updated);
    triggerToast('Document types updated successfully');
  };

  const handleAddDocument = () => {
    if (!newItemName.trim()) return;
    const newItem: DynamicSettingItem = {
      id: `doc-${Date.now()}`,
      name: newItemName.trim(),
      active: true,
    };
    const updated = [...documentTypes, newItem];
    setDocumentTypes(updated);
    saveDocumentTypes(updated);
    setNewItemName('');
    setShowAddModal(false);
    triggerToast(`Added "${newItem.name}" to document types`);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documentTypes.filter(item => item.id !== id);
    setDocumentTypes(updated);
    saveDocumentTypes(updated);
    triggerToast('Document type removed successfully');
  };

  // ── Handlers for Lead Sources ──────────────────────────────────────────────
  const handleToggleSource = (id: string) => {
    const updated = leadSources.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setLeadSources(updated);
    saveLeadSources(updated);
    triggerToast('Lead sources updated successfully');
  };

  const handleAddSource = () => {
    if (!newItemName.trim()) return;
    const newItem: DynamicSettingItem = {
      id: `src-${Date.now()}`,
      name: newItemName.trim(),
      active: true,
    };
    const updated = [...leadSources, newItem];
    setLeadSources(updated);
    saveLeadSources(updated);
    setNewItemName('');
    setShowAddModal(false);
    triggerToast(`Added "${newItem.name}" to lead sources`);
  };

  const handleDeleteSource = (id: string) => {
    const updated = leadSources.filter(item => item.id !== id);
    setLeadSources(updated);
    saveLeadSources(updated);
    triggerToast('Lead source removed successfully');
  };

  // ── Handlers for Travel Preferences ──────────────────────────────────────────
  const handleTogglePreference = (id: string) => {
    const updated = travelPreferences.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setTravelPreferences(updated);
    saveTravelPreferences(updated);
    triggerToast('Travel preferences updated successfully');
  };

  const handleAddPreference = () => {
    if (!newItemName.trim()) return;
    const newItem: DynamicSettingItem = {
      id: `pref-${Date.now()}`,
      name: newItemName.trim(),
      active: true,
    };
    const updated = [...travelPreferences, newItem];
    setTravelPreferences(updated);
    saveTravelPreferences(updated);
    setNewItemName('');
    setShowAddModal(false);
    triggerToast(`Added "${newItem.name}" to travel preferences`);
  };

  const handleDeletePreference = (id: string) => {
    const updated = travelPreferences.filter(item => item.id !== id);
    setTravelPreferences(updated);
    saveTravelPreferences(updated);
    triggerToast('Travel preference removed successfully');
  };

  // ── Profile Save Handler ────────────────────────────────────────────────────
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveAgencyProfile(profile);
    triggerToast('Agency profile & tax preferences saved');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'categories', label: 'Travel Categories', icon: <Layers className="w-4 h-4" />, count: categories.length },
    { key: 'documents', label: 'Member Document Types', icon: <FileText className="w-4 h-4" />, count: documentTypes.length },
    { key: 'sources', label: 'Lead Sources', icon: <Share2 className="w-4 h-4" />, count: leadSources.length },
    { key: 'preferences', label: 'Travel Preferences', icon: <Sparkles className="w-4 h-4" />, count: travelPreferences.length },
    { key: 'profile', label: 'Agency Profile & Tax', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {saveToast}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Agency Settings & Configurations</h1>
            <Badge variant="blue">Owner Access</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure dynamic travel categories, document upload types, lead sources, and agency profiles.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-0.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === t.key ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRAVEL CATEGORIES CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Travel Categories</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                These categories are dynamically populated in the "Add Lead" modal when agents create a new enquiry.
              </p>
            </div>
            <Button size="sm" onClick={() => { setNewItemName(''); setShowAddModal(true); }}>
              <Plus className="w-4 h-4" /> Add Travel Category
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Status</th>
                  <th>Availability</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span className="font-bold text-slate-900">{cat.name}</span>
                      {cat.isDefault && <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">System Default</span>}
                    </td>
                    <td>
                      <Badge variant={cat.active ? 'green' : 'slate'}>
                        {cat.active ? 'Active in Add Lead' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-500">
                      {cat.active ? 'Available in lead enquiry form' : 'Disabled for new leads'}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleCategory(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                          title={cat.active ? 'Deactivate Category' : 'Activate Category'}
                        >
                          {cat.active ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                        {!cat.isDefault && (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MEMBER DOCUMENT TYPES CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Member Document Types</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Configure document types available when uploading passports, visas, or IDs for client members.
              </p>
            </div>
            <Button size="sm" onClick={() => { setNewItemName(''); setShowAddModal(true); }}>
              <Plus className="w-4 h-4" /> Add Document Type
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Type Name</th>
                  <th>Status</th>
                  <th>Usage Scope</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documentTypes.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <span className="font-bold text-slate-900">{doc.name}</span>
                      {doc.isDefault && <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Core Document</span>}
                    </td>
                    <td>
                      <Badge variant={doc.active ? 'green' : 'slate'}>
                        {doc.active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-500">
                      {doc.active ? 'Enabled in Member Document Upload' : 'Disabled in upload options'}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleDocument(doc.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                          title={doc.active ? 'Deactivate Document Type' : 'Activate Document Type'}
                        >
                          {doc.active ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                        {!doc.isDefault && (
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete Document Type"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LEAD SOURCES CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lead Sources & Acquisition Channels</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Manage incoming lead channels for agency reports and conversion funnels.
              </p>
            </div>
            <Button size="sm" onClick={() => { setNewItemName(''); setShowAddModal(true); }}>
              <Plus className="w-4 h-4" /> Add Lead Source
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Channel Name</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadSources.map((src) => (
                  <tr key={src.id}>
                    <td className="font-bold text-slate-900">{src.name}</td>
                    <td>
                      <Badge variant={src.active ? 'green' : 'slate'}>
                        {src.active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSource(src.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                          {src.active ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                        <button
                          onClick={() => handleDeleteSource(src.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── Travel Preferences List ── */}
      {activeTab === 'preferences' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Travel Preferences</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Configure choices for hotels, meals, or any other preferences to show in lead creation.
              </p>
            </div>
            <Button size="sm" onClick={() => { setNewItemName(''); setShowAddModal(true); }}>
              <Plus className="w-4 h-4" /> Add Preference
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Preference Name</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {travelPreferences.map((pref) => (
                  <tr key={pref.id}>
                    <td className="font-bold text-slate-900">{pref.name}</td>
                    <td>
                      <Badge variant={pref.active ? 'green' : 'slate'}>
                        {pref.active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePreference(pref.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                          {pref.active ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                        <button
                          onClick={() => handleDeletePreference(pref.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AGENCY PROFILE & PREFERENCES */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Profile & GST Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Agency Business Name *</label>
                  <Input
                    type="text"
                    required
                    value={profile.agencyName}
                    onChange={e => setProfile({ ...profile, agencyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Agency Owner Name *</label>
                  <Input
                    type="text"
                    required
                    value={profile.ownerName}
                    onChange={e => setProfile({ ...profile, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">GSTIN / Tax ID Number</label>
                  <Input
                    type="text"
                    value={profile.gstNumber}
                    onChange={e => setProfile({ ...profile, gstNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Primary Billing Currency</label>
                  <Input
                    type="text"
                    value={profile.currency}
                    onChange={e => setProfile({ ...profile, currency: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Default Commission Rate (%)</label>
                  <Input
                    type="number"
                    value={profile.defaultCommission}
                    onChange={e => setProfile({ ...profile, defaultCommission: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">
                  <Save className="w-4 h-4" /> Save Profile Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Dynamic Item Creation Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalHeader onClose={() => setShowAddModal(false)}>
          <ModalTitle>
            {activeTab === 'categories' && 'Add New Travel Category'}
            {activeTab === 'documents' && 'Add New Member Document Type'}
            {activeTab === 'sources' && 'Add New Lead Source'}
            {activeTab === 'preferences' && 'Add New Travel Preference'}
          </ModalTitle>
          <ModalDescription>
            This item will be stored and dynamically loaded across all lead creation and member document upload forms.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {activeTab === 'categories' && 'Travel Category Name *'}
              {activeTab === 'documents' && 'Document Type Name *'}
              {activeTab === 'sources' && 'Lead Source Name *'}
              {activeTab === 'preferences' && 'Travel Preference Name *'}
            </label>
            <Input
              type="text"
              autoFocus
              placeholder={
                activeTab === 'categories' ? 'e.g. Cruise Package, MICE Tour' :
                activeTab === 'documents' ? 'e.g. Vaccination Certificate, Insurance' :
                activeTab === 'sources' ? 'e.g. Trade Fair, Exhibition' :
                'e.g. 5 Star Hotels, Vegan Meals'
              }
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button 
            size="sm"
            onClick={() => {
              if (activeTab === 'categories') handleAddCategory();
              else if (activeTab === 'documents') handleAddDocument();
              else if (activeTab === 'sources') handleAddSource();
              else if (activeTab === 'preferences') handleAddPreference();
            }}
            disabled={!newItemName.trim()}
          >
            Add & Save Config
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  );
}
