'use client';

export interface DynamicSettingItem {
  id: string;
  name: string;
  active: boolean;
  isDefault?: boolean;
}

export interface AgencyProfileSetting {
  agencyName: string;
  ownerName: string;
  email: string;
  gstNumber: string;
  currency: string;
  defaultCommission: number;
}

const DEFAULT_TRAVEL_CATEGORIES: DynamicSettingItem[] = [
  { id: 'cat-1', name: 'Holiday Package', active: true, isDefault: true },
  { id: 'cat-2', name: 'Hotel', active: true, isDefault: true },
  { id: 'cat-3', name: 'Flight', active: true, isDefault: true },
  { id: 'cat-4', name: 'Visa', active: true, isDefault: true },
  { id: 'cat-5', name: 'Cruise Package', active: true },
  { id: 'cat-6', name: 'MICE / Corporate Travel', active: true },
  { id: 'cat-7', name: 'Group Tour', active: true },
];

const DEFAULT_DOCUMENT_TYPES: DynamicSettingItem[] = [
  { id: 'doc-1', name: 'Passport', active: true, isDefault: true },
  { id: 'doc-2', name: 'Visa', active: true, isDefault: true },
  { id: 'doc-3', name: 'ID Card / National ID', active: true, isDefault: true },
  { id: 'doc-4', name: 'PAN Card', active: true },
  { id: 'doc-5', name: 'Aadhaar Card', active: true },
  { id: 'doc-6', name: 'Driving License', active: true },
  { id: 'doc-7', name: 'Travel Insurance', active: true },
  { id: 'doc-8', name: 'Vaccination Certificate', active: true },
];

const DEFAULT_LEAD_SOURCES: DynamicSettingItem[] = [
  { id: 'src-1', name: 'Website', active: true },
  { id: 'src-2', name: 'WhatsApp', active: true },
  { id: 'src-3', name: 'Phone Call', active: true },
  { id: 'src-4', name: 'Social Media', active: true },
  { id: 'src-5', name: 'Walk-in', active: true },
  { id: 'src-6', name: 'Referral', active: true },
  { id: 'src-7', name: 'Corporate Direct', active: true },
];

const DEFAULT_TRAVEL_PREFERENCES: DynamicSettingItem[] = [
  { id: 'pref-1', name: '4 Star Hotels', active: true },
  { id: 'pref-2', name: '5 Star Hotels', active: true },
  { id: 'pref-3', name: 'Veg Meals', active: true },
  { id: 'pref-4', name: 'Non-veg Meals', active: true },
  { id: 'pref-5', name: 'Wheelchair Assistance', active: true },
  { id: 'pref-6', name: 'Early Check-in', active: true },
];

const DEFAULT_AGENCY_PROFILE: AgencyProfileSetting = {
  agencyName: 'Global Explorer Travels',
  ownerName: 'John Davis',
  email: 'owner@globalexplorer.com',
  gstNumber: '27AABCU9603R1ZM',
  currency: '₹ (INR)',
  defaultCommission: 2,
};

// ── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  CATEGORIES: 'travelos_agency_travel_categories',
  DOCUMENTS: 'crm_documents',
  LEAD_SOURCES: 'crm_lead_sources',
  PROFILE: 'crm_agency_profile',
  TRAVEL_PREFERENCES: 'crm_travel_preferences',
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// ── Travel Categories API ─────────────────────────────────────────────────────
export function getTravelCategories(): DynamicSettingItem[] {
  return getStored(STORAGE_KEYS.CATEGORIES, DEFAULT_TRAVEL_CATEGORIES);
}

export function getActiveTravelCategories(): string[] {
  return getTravelCategories()
    .filter(item => item.active)
    .map(item => item.name);
}

export function saveTravelCategories(categories: DynamicSettingItem[]): void {
  setStored(STORAGE_KEYS.CATEGORIES, categories);
}

// ── Document Types API ────────────────────────────────────────────────────────
export function getDocumentTypes(): DynamicSettingItem[] {
  return getStored(STORAGE_KEYS.DOCUMENTS, DEFAULT_DOCUMENT_TYPES);
}

export function getActiveDocumentTypes(): string[] {
  return getDocumentTypes()
    .filter(item => item.active)
    .map(item => item.name);
}

export function saveDocumentTypes(types: DynamicSettingItem[]): void {
  setStored(STORAGE_KEYS.DOCUMENTS, types);
}

// ── Lead Sources API ──────────────────────────────────────────────────────────
export function getLeadSources(): DynamicSettingItem[] {
  return getStored(STORAGE_KEYS.LEAD_SOURCES, DEFAULT_LEAD_SOURCES);
}

export function getActiveLeadSources(): string[] {
  return getLeadSources()
    .filter(item => item.active)
    .map(item => item.name);
}

export function saveLeadSources(sources: DynamicSettingItem[]): void {
  setStored(STORAGE_KEYS.LEAD_SOURCES, sources);
}

// ── Travel Preferences API ───────────────────────────────────────────────────
export function getTravelPreferences(): DynamicSettingItem[] {
  return getStored(STORAGE_KEYS.TRAVEL_PREFERENCES, DEFAULT_TRAVEL_PREFERENCES);
}

export function getActiveTravelPreferences(): string[] {
  return getTravelPreferences()
    .filter(item => item.active)
    .map(item => item.name);
}

export function saveTravelPreferences(preferences: DynamicSettingItem[]): void {
  setStored(STORAGE_KEYS.TRAVEL_PREFERENCES, preferences);
}

// ── Agency Profile API ────────────────────────────────────────────────────────
export function getAgencyProfile(): AgencyProfileSetting {
  return getStored(STORAGE_KEYS.PROFILE, DEFAULT_AGENCY_PROFILE);
}

export function saveAgencyProfile(profile: AgencyProfileSetting): void {
  setStored(STORAGE_KEYS.PROFILE, profile);
}
