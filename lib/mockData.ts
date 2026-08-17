// ── Type Definitions ──────────────────────────────────────────────────────

export type ClientType = 'B2C' | 'B2B';
export type Relation = 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Parent' | 'Sibling' | 'Friend' | 'Colleague' | 'Other';
export type Gender = 'Male' | 'Female' | 'Other';
export type TravellerStatus = 'Tentative' | 'Confirmed' | 'Dropped';
export type LeadCategory = 'Holiday Package' | 'Hotel' | 'Flight' | 'Visa';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiating' | 'Booked' | 'Lost';
export type LeadSource = string; // Now dynamic based on settings
export type LeadPriority = 'High' | 'Medium' | 'Low';
export type BookingType = 'Flight' | 'Hotel' | 'Package' | 'Visa';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refunded';

// ── Member & Client ───────────────────────────────────────────────────────

export interface MemberDocument {
  id: string;
  name: string;
  type: 'Passport' | 'Visa' | 'ID Card' | 'Other';
  uploadDate: string;
}

export interface Member {
  id: string;
  name: string;
  relation: Relation;
  gender?: Gender;
  dob?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  phone?: string;
  email?: string;
  documents: MemberDocument[];
  isActive: boolean;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  identifier: string;
  owningAgentId: string;
  mainContactId: string;
  members: Member[];
  isActive: boolean;
  createdDate: string;
}

// ── Lead & Traveller ──────────────────────────────────────────────────────

export interface VisaChecklist {
  passportCollected: boolean;
  photosCollected: boolean;
  formsFilled: boolean;
  submittedToEmbassy: boolean;
  approved: boolean;
}

export interface Traveller {
  memberId: string;
  status: TravellerStatus;
  dropReason?: string;
  fareClass?: 'Adult' | 'Child' | 'Infant' | 'Unknown';
  visaChecklist: VisaChecklist;
}

export interface ProposalItem {
  id: string;
  type: 'Flight' | 'Hotel' | 'Transfer' | 'Activity' | 'Visa Fee' | 'Miscellaneous';
  description: string;
  supplier: string;
  netCost: number;
  sellingPrice: number;
}

export interface BookingVoucher {
  id: string;
  type: 'Flight' | 'Hotel' | 'Transfer' | 'Activity' | 'Visa' | 'Other';
  supplier: string;
  referenceNumber: string; // PNR, Booking ID, etc.
  date: string;
  fileUrl?: string;
  notes?: string;
}

export interface LeadInvoice {
  id: string;
  description: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';
  date: string;
  dueDate: string;
}

export interface LeadNote {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'traveller_added' | 'traveller_dropped' | 'note_added' | 'proposal_item' | 'link_shared' | 'created' | 'reassigned' | 'voucher_added' | 'invoice_added';
  description: string;
  timestamp: string;
  actor: string;
}

export interface Lead {
  id: string;
  clientId: string;
  destination: string;
  travelDateFrom: string;
  travelDateTo: string;
  categories: LeadCategory[];
  travellers: Traveller[];
  budget?: string;
  adultsCount?: number;
  kidsCount?: number;
  kidsAges?: number[];
  travelPreferences?: string[];
  specialNotes?: string;
  status: LeadStatus;
  source: LeadSource;
  sourceCountry?: string;
  priority: LeadPriority;
  assignedTo: string;
  followUpDate: string;
  date: string;
  proposalItems: ProposalItem[];
  bookingVouchers: BookingVoucher[];
  invoices: LeadInvoice[];
  notes: LeadNote[];
  timeline: TimelineEvent[];
  lostReason?: string;
}

// ── Agents ────────────────────────────────────────────────────────────────

export interface Agent {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  department: string;
  bookings: number;
  commission: number;
  leadsAssigned: number;
  callsMade: number;
  followUpsCompleted: number;
  quotationsSent: number;
  revenueGenerated: number;
  pendingTasks: number;
  conversionPercent: number;
  isActive: boolean;
}

// ── Booking ───────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  clientId: string;
  agentId: string;
  type: BookingType;
  destination: string;
  pnr: string;
  ticketNo: string;
  airline: string;
  supplier: string;
  journeyDate: string;
  returnDate: string;
  tripType: string;
  netCost: number;
  sellingPrice: number;
  profit: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  date: string;
  cancelReason: string;
  refundStatus: string;
}

// ── Invoice ───────────────────────────────────────────────────────────────

export interface ClientInvoice {
  id: string;
  clientId: string;
  clientName: string;
  agentId: string;
  amount: number;
  gst: number;
  totalWithGst: number;
  amountPaid: number;
  status: string;
  date: string;
  dueDate: string;
  paymentMode: string;
}

export interface SupplierInvoice {
  id: string;
  supplierName: string;
  category: string;
  amount: number;
  status: string;
  dueDate: string;
  bookingRef: string;
}

// ── Visa ──────────────────────────────────────────────────────────────────

export interface VisaCase {
  id: string;
  clientId: string;
  clientName: string;
  agentId: string;
  country: string;
  visaType: string;
  passportNumber: string;
  status: string;
  passportCollected: boolean;
  photosCollected: boolean;
  formsFilled: boolean;
  appointmentDate: string;
  biometricsDone: boolean;
  submittedToEmbassy: boolean;
  approved: boolean;
  rejected: boolean;
  passportReturned: boolean;
  visaValidity: string;
  expiryDate: string;
  applicationDate: string;
}

// ══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════════════════

export const initialAgencies = [
  { id: '1', name: 'Global Explorer Travels', owner: 'John Davis', status: 'Active', agentsCount: 15, totalRevenue: 42850 },
  { id: '2', name: 'Wanderlust Inc.', owner: 'Alice Smith', status: 'Active', agentsCount: 5, totalRevenue: 12000 },
];

export const initialAgents: Agent[] = [
  { id: '1', agencyId: '1', name: 'Liam Smith', email: 'liam@globalexplorer.com', department: 'Sales', bookings: 14, commission: 840, leadsAssigned: 18, callsMade: 52, followUpsCompleted: 34, quotationsSent: 12, revenueGenerated: 1250000, pendingTasks: 3, conversionPercent: 32, isActive: true },
  { id: '2', agencyId: '1', name: 'Emma Wilson', email: 'emma@globalexplorer.com', department: 'Sales', bookings: 9, commission: 540, leadsAssigned: 12, callsMade: 38, followUpsCompleted: 24, quotationsSent: 8, revenueGenerated: 320000, pendingTasks: 5, conversionPercent: 67, isActive: true },
  { id: '3', agencyId: '1', name: 'Oliver Khan', email: 'oliver@globalexplorer.com', department: 'Operations', bookings: 6, commission: 360, leadsAssigned: 9, callsMade: 22, followUpsCompleted: 15, quotationsSent: 5, revenueGenerated: 420000, pendingTasks: 2, conversionPercent: 15, isActive: false },
  { id: '4', agencyId: '1', name: 'Priya Sharma', email: 'priya@globalexplorer.com', department: 'Visa', bookings: 4, commission: 240, leadsAssigned: 7, callsMade: 18, followUpsCompleted: 12, quotationsSent: 3, revenueGenerated: 95000, pendingTasks: 4, conversionPercent: 43, isActive: true },
  { id: '5', agencyId: '1', name: 'Arjun Mehta', email: 'arjun@globalexplorer.com', department: 'Sales', bookings: 11, commission: 660, leadsAssigned: 15, callsMade: 45, followUpsCompleted: 30, quotationsSent: 10, revenueGenerated: 420000, pendingTasks: 1, conversionPercent: 73, isActive: true },
];

// ── Clients ───────────────────────────────────────────────────────────────

export const initialClients: Client[] = [
  {
    id: 'C1',
    name: 'Ajay Sharma',
    type: 'B2C',
    identifier: '+919876543210',
    owningAgentId: '1',
    mainContactId: 'M1',
    isActive: true,
    createdDate: '2026-06-01',
    members: [
      { id: 'M1', name: 'Ajay Sharma', relation: 'Self', gender: 'Male', dob: '1988-03-15', nationality: 'Indian', passportNumber: 'L9876543', passportExpiry: '2032-01-20', phone: '+919876543210', email: 'ajay.sharma@email.com', documents: [{ id: 'D1', name: 'Passport_Ajay.pdf', type: 'Passport', uploadDate: '2026-06-01' }], isActive: true },
      { id: 'M2', name: 'Sanya Sharma', relation: 'Spouse', gender: 'Female', dob: '1990-07-22', nationality: 'Indian', passportNumber: 'M1234567', passportExpiry: '2027-03-10', phone: '+919876543211', email: 'sanya.sharma@email.com', documents: [{ id: 'D2', name: 'Passport_Sanya.pdf', type: 'Passport', uploadDate: '2026-06-01' }], isActive: true },
      { id: 'M3', name: 'Rohan Sharma', relation: 'Son', gender: 'Male', dob: '2014-11-05', nationality: 'Indian', passportNumber: 'N7654321', passportExpiry: '2031-08-15', documents: [], isActive: true },
      { id: 'M4', name: 'Ananya Sharma', relation: 'Daughter', gender: 'Female', dob: '2019-04-18', nationality: 'Indian', passportNumber: '', passportExpiry: '', documents: [], isActive: true },
    ],
  },
  {
    id: 'C2',
    name: 'Iyer Corporate Travel',
    type: 'B2B',
    identifier: 'IYER-CORP',
    owningAgentId: '2',
    mainContactId: 'M5',
    isActive: true,
    createdDate: '2026-05-15',
    members: [
      { id: 'M5', name: 'Ramesh Iyer', relation: 'Self', gender: 'Male', dob: '1975-09-12', nationality: 'Indian', passportNumber: 'A9876543', passportExpiry: '2028-12-01', phone: '+918765432100', email: 'ramesh@iyercorp.com', documents: [{ id: 'D3', name: 'Passport_Ramesh.pdf', type: 'Passport', uploadDate: '2026-05-15' }], isActive: true },
      { id: 'M6', name: 'Pradeep Kumar', relation: 'Colleague', gender: 'Male', dob: '1985-01-20', nationality: 'Indian', passportNumber: 'B1234567', passportExpiry: '2026-09-30', phone: '+918765432101', email: 'pradeep@iyercorp.com', documents: [], isActive: true },
      { id: 'M7', name: 'Sunita Nair', relation: 'Colleague', gender: 'Female', dob: '1992-06-14', nationality: 'Indian', passportNumber: '', passportExpiry: '', phone: '+918765432102', email: 'sunita@iyercorp.com', documents: [], isActive: true },
    ],
  },
  {
    id: 'C3',
    name: 'Kapoor Friends Group',
    type: 'B2B',
    identifier: 'KAPOOR-FRIENDS',
    owningAgentId: '1',
    mainContactId: 'M8',
    isActive: true,
    createdDate: '2026-07-01',
    members: [
      { id: 'M8', name: 'Raj Kapoor', relation: 'Self', gender: 'Male', dob: '1991-02-28', nationality: 'Indian', passportNumber: 'C5432109', passportExpiry: '2030-06-15', phone: '+917654321098', email: 'raj.kapoor@email.com', documents: [{ id: 'D4', name: 'Passport_Raj.pdf', type: 'Passport', uploadDate: '2026-07-01' }], isActive: true },
      { id: 'M9', name: 'Dev Malhotra', relation: 'Friend', gender: 'Male', dob: '1990-08-11', nationality: 'Indian', passportNumber: 'D6543210', passportExpiry: '2029-11-22', phone: '+917654321099', email: 'dev.malhotra@email.com', documents: [], isActive: true },
      { id: 'M10', name: 'Neha Verma', relation: 'Friend', gender: 'Female', dob: '1993-12-03', nationality: 'Indian', passportNumber: '', passportExpiry: '', phone: '+917654321100', email: 'neha.verma@email.com', documents: [], isActive: true },
    ],
  },
  {
    id: 'C4',
    name: 'Elena Rodriguez',
    type: 'B2C',
    identifier: '+911122334455',
    owningAgentId: '2',
    mainContactId: 'M11',
    isActive: true,
    createdDate: '2026-04-10',
    members: [
      { id: 'M11', name: 'Elena Rodriguez', relation: 'Self', gender: 'Female', dob: '1987-05-30', nationality: 'Spanish', passportNumber: 'J8765432', passportExpiry: '2031-03-15', phone: '+911122334455', email: 'elena@example.com', documents: [{ id: 'D5', name: 'Passport_Elena.pdf', type: 'Passport', uploadDate: '2026-04-10' }, { id: 'D6', name: 'Visa_Japan.pdf', type: 'Visa', uploadDate: '2026-07-20' }], isActive: true },
    ],
  },
  {
    id: 'C5',
    name: 'David Chen',
    type: 'B2C',
    identifier: '+915566778899',
    owningAgentId: '3',
    mainContactId: 'M12',
    isActive: true,
    createdDate: '2026-05-20',
    members: [
      { id: 'M12', name: 'David Chen', relation: 'Self', gender: 'Male', dob: '1982-10-08', nationality: 'Chinese', passportNumber: 'K1234567', passportExpiry: '2029-07-01', phone: '+915566778899', email: 'david@example.com', documents: [{ id: 'D7', name: 'Passport_David.pdf', type: 'Passport', uploadDate: '2026-05-20' }], isActive: true },
      { id: 'M13', name: 'Sarah Chen', relation: 'Spouse', gender: 'Female', dob: '1990-11-05', nationality: 'Chinese', passportNumber: 'K7654321', passportExpiry: '2030-02-14', phone: '+915566778800', email: 'sarah.chen@example.com', documents: [], isActive: true },
    ],
  },
];

// ── Leads ──────────────────────────────────────────────────────────────────

const emptyVisaChecklist: VisaChecklist = { passportCollected: false, photosCollected: false, formsFilled: false, submittedToEmbassy: false, approved: false };

export const initialLeads: Lead[] = [
  {
    id: 'L1',
    clientId: 'C1',
    destination: 'Bangkok, Thailand',
    travelDateFrom: '2026-10-01',
    travelDateTo: '2026-10-08',
    categories: ['Holiday Package', 'Flight'],
    travellers: [
      { memberId: 'M1', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { ...emptyVisaChecklist, passportCollected: true, photosCollected: true } },
      { memberId: 'M2', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { ...emptyVisaChecklist, passportCollected: true } },
      { memberId: 'M3', status: 'Tentative', fareClass: 'Child', visaChecklist: emptyVisaChecklist },
      { memberId: 'M9', status: 'Dropped', dropReason: 'Leave not approved by employer', fareClass: 'Adult', visaChecklist: { ...emptyVisaChecklist, passportCollected: true } },
    ],
    budget: '₹5,00,000',
    status: 'Proposal Sent',
    source: 'Phone Call',
    priority: 'High',
    assignedTo: '1',
    followUpDate: '2026-08-20',
    date: '2026-07-15',
    proposalItems: [
      { id: 'PI1', type: 'Flight', description: 'Mumbai – Bangkok return (Economy)', supplier: 'IndiGo', netCost: 45000, sellingPrice: 52000 },
      { id: 'PI2', type: 'Hotel', description: 'Anantara Riverside – 7N Superior Room', supplier: 'Anantara Hotels', netCost: 120000, sellingPrice: 145000 },
      { id: 'PI3', type: 'Activity', description: 'Full-day Floating Market + Temple Tour', supplier: 'Klook', netCost: 8000, sellingPrice: 12000 },
    ],
    bookingVouchers: [],
    invoices: [],
    notes: [
      { id: 'N1', text: 'Called Ajay. He wants a riverside hotel in Bangkok, flexible dates in October. Friend Dev may join.', timestamp: '2026-07-15T10:30:00', author: 'Liam Smith' },
      { id: 'N2', text: 'Dev confirmed he is joining. Added to traveller list. Passport collected from his office.', timestamp: '2026-07-18T14:00:00', author: 'Liam Smith' },
      { id: 'N3', text: 'Dev dropped out — leave was refused. His passport is still with us, needs to be returned.', timestamp: '2026-07-25T09:30:00', author: 'Liam Smith' },
    ],
    timeline: [
      { id: 'T1', type: 'created', description: 'Lead created for Bangkok trip', timestamp: '2026-07-15T10:00:00', actor: 'Liam Smith' },
      { id: 'T2', type: 'traveller_added', description: 'Ajay Sharma added as traveller', timestamp: '2026-07-15T10:05:00', actor: 'Liam Smith' },
      { id: 'T3', type: 'traveller_added', description: 'Sanya Sharma added as traveller', timestamp: '2026-07-15T10:06:00', actor: 'Liam Smith' },
      { id: 'T4', type: 'traveller_added', description: 'Dev Malhotra added as traveller', timestamp: '2026-07-18T14:00:00', actor: 'Liam Smith' },
      { id: 'T5', type: 'status_change', description: 'Status changed from New to Proposal Sent', timestamp: '2026-07-20T11:00:00', actor: 'Liam Smith' },
      { id: 'T6', type: 'link_shared', description: 'Proposal link shared via WhatsApp', timestamp: '2026-07-20T11:05:00', actor: 'Liam Smith' },
      { id: 'T7', type: 'traveller_dropped', description: 'Dev Malhotra dropped — Leave not approved', timestamp: '2026-07-25T09:30:00', actor: 'Liam Smith' },
    ],
  },
  {
    id: 'L2',
    clientId: 'C2',
    destination: 'Singapore',
    travelDateFrom: '2026-09-10',
    travelDateTo: '2026-09-17',
    categories: ['Holiday Package', 'Hotel', 'Visa'],
    travellers: [
      { memberId: 'M5', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { passportCollected: true, photosCollected: true, formsFilled: true, submittedToEmbassy: false, approved: false } },
      { memberId: 'M6', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { passportCollected: true, photosCollected: true, formsFilled: false, submittedToEmbassy: false, approved: false } },
      { memberId: 'M7', status: 'Tentative', fareClass: 'Adult', visaChecklist: emptyVisaChecklist },
    ],
    budget: '₹8,00,000',
    status: 'Negotiating',
    source: 'Referral',
    priority: 'High',
    assignedTo: '2',
    followUpDate: '2026-08-25',
    date: '2026-07-16',
    proposalItems: [
      { id: 'PI4', type: 'Flight', description: 'Mumbai – Singapore return (Business)', supplier: 'Singapore Airlines', netCost: 180000, sellingPrice: 210000 },
      { id: 'PI5', type: 'Hotel', description: 'Marina Bay Sands – 7N Deluxe', supplier: 'MBS Direct', netCost: 250000, sellingPrice: 310000 },
      { id: 'PI6', type: 'Visa Fee', description: 'Singapore Visa – 3 pax', supplier: 'VFS Global', netCost: 9000, sellingPrice: 12000 },
    ],
    bookingVouchers: [],
    invoices: [],
    notes: [
      { id: 'N4', text: 'Ramesh wants business class flights for the team. Budget approved by CFO.', timestamp: '2026-07-16T11:00:00', author: 'Emma Wilson' },
    ],
    timeline: [
      { id: 'T8', type: 'created', description: 'Lead created for Singapore corporate trip', timestamp: '2026-07-16T10:00:00', actor: 'Emma Wilson' },
      { id: 'T9', type: 'status_change', description: 'Status changed from New to Negotiating', timestamp: '2026-07-20T14:00:00', actor: 'Emma Wilson' },
    ],
  },
  {
    id: 'L3',
    clientId: 'C4',
    destination: 'Kyoto, Japan',
    travelDateFrom: '2026-11-01',
    travelDateTo: '2026-11-10',
    categories: ['Holiday Package', 'Visa'],
    travellers: [
      { memberId: 'M11', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { passportCollected: true, photosCollected: true, formsFilled: false, submittedToEmbassy: false, approved: false } },
    ],
    budget: '₹3,50,000',
    status: 'Qualified',
    source: 'Website',
    priority: 'Medium',
    assignedTo: '2',
    followUpDate: '2026-08-18',
    date: '2026-07-17',
    proposalItems: [],
    bookingVouchers: [],
    invoices: [],
    notes: [
      { id: 'N5', text: 'Elena wants a cultural immersion experience in Kyoto. Interested in traditional ryokans.', timestamp: '2026-07-17T09:00:00', author: 'Emma Wilson' },
    ],
    timeline: [
      { id: 'T10', type: 'created', description: 'Lead created for Kyoto trip', timestamp: '2026-07-17T09:00:00', actor: 'Emma Wilson' },
      { id: 'T11', type: 'status_change', description: 'Status changed from New to Qualified', timestamp: '2026-07-19T10:00:00', actor: 'Emma Wilson' },
    ],
  },
  {
    id: 'L4',
    clientId: 'C5',
    destination: 'Cape Town, South Africa',
    travelDateFrom: '2026-12-15',
    travelDateTo: '2026-12-25',
    categories: ['Holiday Package', 'Flight', 'Visa'],
    travellers: [
      { memberId: 'M12', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { passportCollected: true, photosCollected: true, formsFilled: true, submittedToEmbassy: true, approved: true } },
      { memberId: 'M13', status: 'Confirmed', fareClass: 'Adult', visaChecklist: { passportCollected: true, photosCollected: true, formsFilled: true, submittedToEmbassy: true, approved: false } },
    ],
    budget: '₹6,00,000',
    status: 'Booked',
    source: 'Walk-in',
    priority: 'High',
    assignedTo: '3',
    followUpDate: '',
    date: '2026-07-18',
    proposalItems: [
      { id: 'PI7', type: 'Flight', description: 'Mumbai – Cape Town return (Economy)', supplier: 'Emirates', netCost: 95000, sellingPrice: 115000 },
      { id: 'PI8', type: 'Hotel', description: 'Table Bay Hotel – 10N Ocean View', supplier: 'Sun International', netCost: 180000, sellingPrice: 220000 },
      { id: 'PI9', type: 'Activity', description: 'Cape Peninsula Full Day Tour', supplier: 'Viator', netCost: 12000, sellingPrice: 16000 },
    ],
    bookingVouchers: [],
    invoices: [],
    notes: [
      { id: 'N6', text: 'Booking confirmed. Flights ticketed, hotel voucher sent. Visas approved for David, Sarah awaiting.', timestamp: '2026-08-01T10:00:00', author: 'Oliver Khan' },
    ],
    timeline: [
      { id: 'T12', type: 'created', description: 'Lead created for Cape Town trip', timestamp: '2026-07-18T10:00:00', actor: 'Oliver Khan' },
      { id: 'T13', type: 'status_change', description: 'Status changed to Booked', timestamp: '2026-08-01T10:00:00', actor: 'Oliver Khan' },
    ],
  },
  {
    id: 'L5',
    clientId: 'C3',
    destination: 'Goa, India',
    travelDateFrom: '2026-09-05',
    travelDateTo: '2026-09-08',
    categories: ['Hotel'],
    travellers: [
      { memberId: 'M8', status: 'Confirmed', fareClass: 'Adult', visaChecklist: emptyVisaChecklist },
      { memberId: 'M9', status: 'Confirmed', fareClass: 'Adult', visaChecklist: emptyVisaChecklist },
      { memberId: 'M10', status: 'Tentative', fareClass: 'Adult', visaChecklist: emptyVisaChecklist },
    ],
    budget: '₹1,50,000',
    status: 'New',
    source: 'WhatsApp',
    priority: 'Low',
    assignedTo: '1',
    followUpDate: '2026-08-22',
    date: '2026-08-10',
    proposalItems: [],
    bookingVouchers: [],
    invoices: [],
    notes: [],
    timeline: [
      { id: 'T14', type: 'created', description: 'Lead created for Goa weekend trip', timestamp: '2026-08-10T16:00:00', actor: 'Liam Smith' },
    ],
  },
];

// ── Bookings ──────────────────────────────────────────────────────────────

export const initialBookings: Booking[] = [
  { id: 'B1001', clientId: 'C1', agentId: '1', type: 'Flight', destination: 'Bangkok, Thailand', pnr: 'ABC123', ticketNo: '098-1234567890', airline: 'IndiGo', supplier: 'IndiGo Direct', journeyDate: '2026-10-01', returnDate: '2026-10-08', tripType: 'Round Trip', netCost: 42000, sellingPrice: 52000, profit: 10000, bookingStatus: 'Confirmed', paymentStatus: 'Paid', date: '2026-07-10', cancelReason: '', refundStatus: '' },
  { id: 'B1002', clientId: 'C1', agentId: '1', type: 'Hotel', destination: 'Bangkok, Thailand', pnr: '', ticketNo: '', airline: '', supplier: 'Anantara Hotels', journeyDate: '2026-10-01', returnDate: '2026-10-08', tripType: '', netCost: 85000, sellingPrice: 105000, profit: 20000, bookingStatus: 'Confirmed', paymentStatus: 'Paid', date: '2026-07-10', cancelReason: '', refundStatus: '' },
  { id: 'B1003', clientId: 'C2', agentId: '2', type: 'Flight', destination: 'Singapore', pnr: 'XYZ789', ticketNo: '724-9876543210', airline: 'Singapore Airlines', supplier: 'SIA Direct', journeyDate: '2026-09-10', returnDate: '2026-09-17', tripType: 'Round Trip', netCost: 120000, sellingPrice: 145000, profit: 25000, bookingStatus: 'Pending', paymentStatus: 'Pending', date: '2026-07-18', cancelReason: '', refundStatus: '' },
  { id: 'B1004', clientId: 'C4', agentId: '2', type: 'Package', destination: 'Kyoto, Japan', pnr: 'KYO456', ticketNo: '', airline: 'JAL', supplier: 'Cleartrip', journeyDate: '2026-11-01', returnDate: '2026-11-10', tripType: 'Round Trip', netCost: 210000, sellingPrice: 265000, profit: 55000, bookingStatus: 'Confirmed', paymentStatus: 'Partial', date: '2026-07-22', cancelReason: '', refundStatus: '' },
  { id: 'B1005', clientId: 'C5', agentId: '3', type: 'Package', destination: 'Cape Town, SA', pnr: 'CPT321', ticketNo: '', airline: 'Emirates', supplier: 'Yatra', journeyDate: '2026-12-15', returnDate: '2026-12-25', tripType: 'Round Trip', netCost: 155000, sellingPrice: 195000, profit: 40000, bookingStatus: 'Pending', paymentStatus: 'Partial', date: '2026-07-25', cancelReason: '', refundStatus: '' },
  { id: 'B1006', clientId: 'C1', agentId: '1', type: 'Visa', destination: 'Thailand', pnr: '', ticketNo: '', airline: '', supplier: 'VFS Global', journeyDate: '2026-09-15', returnDate: '', tripType: '', netCost: 3500, sellingPrice: 5000, profit: 1500, bookingStatus: 'Completed', paymentStatus: 'Paid', date: '2026-07-08', cancelReason: '', refundStatus: '' },
  { id: 'B1007', clientId: 'C4', agentId: '2', type: 'Flight', destination: 'Paris, France', pnr: 'PAR654', ticketNo: '057-1122334455', airline: 'Air France', supplier: 'Air France Direct', journeyDate: '2026-06-10', returnDate: '2026-06-17', tripType: 'Round Trip', netCost: 65000, sellingPrice: 78000, profit: 13000, bookingStatus: 'Completed', paymentStatus: 'Paid', date: '2026-05-20', cancelReason: '', refundStatus: '' },
  { id: 'B1008', clientId: 'C2', agentId: '2', type: 'Hotel', destination: 'Dubai, UAE', pnr: '', ticketNo: '', airline: '', supplier: 'Agoda', journeyDate: '2026-08-15', returnDate: '2026-08-20', tripType: '', netCost: 48000, sellingPrice: 62000, profit: 14000, bookingStatus: 'Cancelled', paymentStatus: 'Refunded', date: '2026-07-28', cancelReason: 'Client changed plans', refundStatus: 'Refunded ₹62,000' },
];

// ── Invoices ──────────────────────────────────────────────────────────────

export const initialClientInvoices: ClientInvoice[] = [
  { id: 'INV-001', clientId: 'C1', clientName: 'Ajay Sharma', agentId: '1', amount: 157000, gst: 28260, totalWithGst: 185260, amountPaid: 185260, status: 'Paid', date: '2026-07-10', dueDate: '2026-07-20', paymentMode: 'Bank Transfer' },
  { id: 'INV-002', clientId: 'C2', clientName: 'Iyer Corporate Travel', agentId: '2', amount: 145000, gst: 26100, totalWithGst: 171100, amountPaid: 50000, status: 'Partial', date: '2026-07-15', dueDate: '2026-08-15', paymentMode: '' },
  { id: 'INV-003', clientId: 'C4', clientName: 'Elena Rodriguez', agentId: '2', amount: 265000, gst: 47700, totalWithGst: 312700, amountPaid: 312700, status: 'Paid', date: '2026-07-12', dueDate: '2026-07-22', paymentMode: 'UPI' },
  { id: 'INV-004', clientId: 'C5', clientName: 'David Chen', agentId: '3', amount: 195000, gst: 35100, totalWithGst: 230100, amountPaid: 0, status: 'Pending', date: '2026-07-18', dueDate: '2026-08-18', paymentMode: '' },
  { id: 'INV-005', clientId: 'C1', clientName: 'Ajay Sharma', agentId: '1', amount: 62000, gst: 11160, totalWithGst: 73160, amountPaid: 73160, status: 'Paid', date: '2026-06-10', dueDate: '2026-06-20', paymentMode: 'Credit Card' },
  { id: 'INV-006', clientId: 'C4', clientName: 'Elena Rodriguez', agentId: '2', amount: 78000, gst: 14040, totalWithGst: 92040, amountPaid: 92040, status: 'Paid', date: '2026-06-15', dueDate: '2026-06-25', paymentMode: 'Bank Transfer' },
];

export const initialSupplierInvoices: SupplierInvoice[] = [
  { id: 'SUP-001', supplierName: 'Singapore Airlines', category: 'Flight', amount: 180000, status: 'Pending', dueDate: '2026-08-15', bookingRef: 'B1003' },
  { id: 'SUP-002', supplierName: 'Anantara Hotels', category: 'Hotel', amount: 85000, status: 'Paid', dueDate: '2026-08-01', bookingRef: 'B1002' },
  { id: 'SUP-003', supplierName: 'SIA Direct', category: 'Flight', amount: 120000, status: 'Pending', dueDate: '2026-08-20', bookingRef: 'B1003' },
  { id: 'SUP-004', supplierName: 'VFS Global', category: 'Visa', amount: 3500, status: 'Paid', dueDate: '2026-07-20', bookingRef: 'B1006' },
  { id: 'SUP-005', supplierName: 'IndiGo Direct', category: 'Flight', amount: 42000, status: 'Paid', dueDate: '2026-07-15', bookingRef: 'B1001' },
  { id: 'SUP-006', supplierName: 'Cleartrip', category: 'Package', amount: 210000, status: 'Pending', dueDate: '2026-09-01', bookingRef: 'B1004' },
];

// ── Visas ──────────────────────────────────────────────────────────────────

export const initialVisas: VisaCase[] = [
  { id: 'V1', clientId: 'C4', clientName: 'Elena Rodriguez', agentId: '2', country: 'Japan', visaType: 'Tourist', passportNumber: 'J8765432', status: 'Documents Pending', passportCollected: true, photosCollected: true, formsFilled: false, appointmentDate: '2026-08-20', biometricsDone: false, submittedToEmbassy: false, approved: false, rejected: false, passportReturned: false, visaValidity: '', expiryDate: '', applicationDate: '2026-07-20' },
  { id: 'V2', clientId: 'C5', clientName: 'David Chen', agentId: '3', country: 'South Africa', visaType: 'Tourist', passportNumber: 'K1234567', status: 'Approved', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-07-10', biometricsDone: true, submittedToEmbassy: true, approved: true, rejected: false, passportReturned: true, visaValidity: '90 days', expiryDate: '2026-12-31', applicationDate: '2026-07-01' },
  { id: 'V3', clientId: 'C1', clientName: 'Ajay Sharma', agentId: '1', country: 'Thailand', visaType: 'Tourist eVisa', passportNumber: 'L9876543', status: 'Approved', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '', biometricsDone: false, submittedToEmbassy: true, approved: true, rejected: false, passportReturned: true, visaValidity: '30 days', expiryDate: '2026-11-01', applicationDate: '2026-07-05' },
  { id: 'V4', clientId: 'C2', clientName: 'Iyer Corporate Travel', agentId: '2', country: 'Singapore', visaType: 'Business', passportNumber: 'A9876543', status: 'Submitted', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-07-25', biometricsDone: true, submittedToEmbassy: true, approved: false, rejected: false, passportReturned: false, visaValidity: '', expiryDate: '', applicationDate: '2026-07-15' },
  { id: 'V5', clientId: 'C4', clientName: 'Elena Rodriguez', agentId: '2', country: 'UK', visaType: 'Tourist', passportNumber: 'J8765432', status: 'Rejected', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-06-15', biometricsDone: true, submittedToEmbassy: true, approved: false, rejected: true, passportReturned: true, visaValidity: '', expiryDate: '', applicationDate: '2026-06-01' },
];

// ── Helper: get client's main contact ─────────────────────────────────────

export function getMainContact(client: Client): Member | undefined {
  return client.members.find(m => m.id === client.mainContactId);
}

export function getMemberById(client: Client, memberId: string): Member | undefined {
  return client.members.find(m => m.id === memberId);
}

export function getClientById(clientId: string): Client | undefined {
  return initialClients.find(c => c.id === clientId);
}

export function getAgentById(agentId: string): Agent | undefined {
  return initialAgents.find(a => a.id === agentId);
}

// ── Passport attention flag helper ────────────────────────────────────────

export type PassportStatus = 'ok' | 'expiring' | 'missing';

export function getPassportStatus(member: Member, referenceDate?: string): PassportStatus {
  if (!member.passportNumber || !member.passportExpiry) return 'missing';
  const refDate = referenceDate ? new Date(referenceDate) : new Date();
  const expiry = new Date(member.passportExpiry);
  const sixMonthsFromRef = new Date(refDate);
  sixMonthsFromRef.setMonth(sixMonthsFromRef.getMonth() + 6);
  if (expiry <= sixMonthsFromRef) return 'expiring';
  return 'ok';
}

// ── Age / fare class helpers ──────────────────────────────────────────────

export function getAgeAtDate(dob: string, dateStr: string): number | null {
  if (!dob || !dateStr) return null;
  const birth = new Date(dob);
  const ref = new Date(dateStr);
  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) age--;
  return age;
}

export function deriveFareClass(dob: string | undefined, travelDate: string): 'Adult' | 'Child' | 'Infant' | 'Unknown' {
  if (!dob || !travelDate) return 'Unknown';
  const age = getAgeAtDate(dob, travelDate);
  if (age === null) return 'Unknown';
  if (age < 2) return 'Infant';
  if (age < 12) return 'Child';
  return 'Adult';
}

export function hasBirthdayDuringTrip(dob: string | undefined, from: string, to: string): boolean {
  if (!dob || !from || !to) return false;
  const birth = new Date(dob);
  const start = new Date(from);
  const end = new Date(to);
  // Check if birthday (month/day) falls within the trip range
  const thisYearBday = new Date(start.getFullYear(), birth.getMonth(), birth.getDate());
  return thisYearBday >= start && thisYearBday <= end;
}
