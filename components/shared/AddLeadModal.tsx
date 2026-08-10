import React, { useState } from 'react';
import { initialCustomers, Lead, LeadCategory } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, ChevronRight, ChevronLeft, User, Search, Plus, Minus } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'GB +44' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
];

const ALL_CATEGORIES: LeadCategory[] = ['Holiday Package', 'Hotel', 'Flight', 'Visa'];

const CATEGORY_ICONS: Record<LeadCategory, string> = {
  'Holiday Package': '🏖',
  'Hotel': '🏨',
  'Flight': '✈️',
  'Visa': '🛂',
};

interface AddLeadModalProps {
  onClose: () => void;
  onAdd: (lead: Lead) => void;
}

export function AddLeadModal({ onClose, onAdd }: AddLeadModalProps) {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [matchedCustomer, setMatchedCustomer] = useState<typeof initialCustomers[0] | null>(null);
  const [lookupDone, setLookupDone] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState<LeadCategory[]>([]);
  const [destination, setDestination] = useState('');
  const [travelDateFrom, setTravelDateFrom] = useState('');
  const [travelDateTo, setTravelDateTo] = useState('');
  const [budget, setBudget] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [specialRequirements, setSpecialRequirements] = useState('');

  const handleLookup = () => {
    const normalized = phone.replace(/\D/g, '');
    const match = initialCustomers.find(c => c.phone.replace(/\D/g, '').endsWith(normalized));
    if (match) {
      setMatchedCustomer(match);
      setName(match.name);
      setEmail(match.email);
    } else {
      setMatchedCustomer(null);
    }
    setLookupDone(true);
  };

  const toggleCategory = (cat: LeadCategory) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = () => {
    const newLead: Lead = {
      id: `L${Date.now()}`,
      countryCode, phone, name, email,
      customerId: matchedCustomer?.id,
      destination, travelDateFrom, travelDateTo,
      categories,
      guestDetails: { adults, children, infants, specialRequirements },
      budget, status: 'New', followUpDate,
      source: 'Phone Call',
      priority: 'Medium',
      // Assigned to a generic agent for now, can be updated later if added by agency owner
      assignedTo: '1', 
      date: new Date().toISOString().split('T')[0],
      proposalItems: [],
      visaTracker: categories.includes('Visa') ? {
        passportCollected: false, photosCollected: false,
        formsFilled: false, submittedToEmbassy: false, approved: false,
      } : undefined,
      notes: [],
    };
    onAdd(newLead);
    onClose();
  };

  const Counter = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-bold text-slate-900 w-6 text-center">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Lead</h2>
            <p className="text-xs text-slate-500 mt-0.5">Step {step} of 3 — {step === 1 ? 'Contact Details' : step === 2 ? 'Trip Details' : 'Guest Info'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex px-6 pt-4 gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                <div className="flex gap-2">
                  <select value={countryCode} onChange={e => { setCountryCode(e.target.value); setLookupDone(false); }}
                    className="text-sm border border-slate-200 rounded-lg px-2 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-blue-600 focus:outline-none">
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <Input value={phone} onChange={e => { setPhone(e.target.value); setLookupDone(false); setMatchedCustomer(null); }}
                    placeholder="Enter mobile number" className="h-10 text-sm flex-1" />
                  <Button onClick={handleLookup} size="sm" variant="outline" disabled={!phone}
                    className="h-10 px-3 text-xs font-semibold border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50">
                    <Search className="w-3.5 h-3.5 mr-1" /> Lookup
                  </Button>
                </div>
              </div>

              {lookupDone && matchedCustomer && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{matchedCustomer.name}</p>
                    <p className="text-xs text-slate-500">{matchedCustomer.email} · Existing Customer</p>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Auto-filled</span>
                </div>
              )}

              {lookupDone && !matchedCustomer && phone && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 font-semibold">New contact — please enter name and email below.</p>
                </div>
              )}

              {lookupDone && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Rajesh Kumar"
                      className={`h-10 text-sm ${matchedCustomer ? 'bg-slate-50 text-slate-500' : ''}`} readOnly={!!matchedCustomer} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g., rajesh@email.com"
                      className={`h-10 text-sm ${matchedCustomer ? 'bg-slate-50 text-slate-500' : ''}`} readOnly={!!matchedCustomer} />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Trip Type <span className="text-blue-600">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        categories.includes(cat) ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}>
                      {CATEGORY_ICONS[cat]} {cat}
                    </button>
                  ))}
                </div>
                {categories.length === 0 && <p className="text-xs text-red-500 mt-1">Select at least one type</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Destination</label>
                <Input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g., Bali, Indonesia" className="h-10 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Travel From</label>
                  <Input type="date" value={travelDateFrom} onChange={e => setTravelDateFrom(e.target.value)} className="h-10 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Travel To</label>
                  <Input type="date" value={travelDateTo} onChange={e => setTravelDateTo(e.target.value)} className="h-10 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Approx. Budget</label>
                  <Input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., ₹2,00,000" className="h-10 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Follow-up Date</label>
                  <Input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="h-10 text-sm" />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-xs text-slate-500 font-medium">How many guests are travelling?</p>
              <Counter label="Adults (12+ years)" value={adults} onChange={setAdults} />
              <Counter label="Children (2–11 years)" value={children} onChange={setChildren} />
              <Counter label="Infants (under 2 years)" value={infants} onChange={setInfants} />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Special Requirements</label>
                <textarea value={specialRequirements} onChange={e => setSpecialRequirements(e.target.value)}
                  placeholder="e.g., Vegetarian meals, wheelchair access, honeymoon package..."
                  className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white min-h-[80px]" />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between p-6 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="h-9 px-4 text-sm font-semibold text-slate-600">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose} className="h-9 px-4 text-sm font-semibold text-slate-600">Cancel</Button>
          )}

          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && (!lookupDone || !name || !phone)}
              className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!destination || categories.length === 0}
              className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50">
              Create Lead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
