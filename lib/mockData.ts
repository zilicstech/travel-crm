export const initialAgencies = [
  { id: '1', name: 'Global Explorer Travels', owner: 'John Davis', status: 'Active', agentsCount: 15, totalRevenue: 42850 },
  { id: '2', name: 'Wanderlust Inc.', owner: 'Alice Smith', status: 'Active', agentsCount: 5, totalRevenue: 12000 },
];

export const initialAgents = [
  { id: '1', agencyId: '1', name: 'Liam Smith', email: 'liam@globalexplorer.com', department: 'Sales', bookings: 14, commission: 840, leadsAssigned: 18, callsMade: 52, followUpsCompleted: 34, quotationsSent: 12, revenueGenerated: 485000, pendingTasks: 3, conversionPercent: 78 },
  { id: '2', agencyId: '1', name: 'Emma Wilson', email: 'emma@globalexplorer.com', department: 'Sales', bookings: 9, commission: 540, leadsAssigned: 12, callsMade: 38, followUpsCompleted: 24, quotationsSent: 8, revenueGenerated: 320000, pendingTasks: 5, conversionPercent: 67 },
  { id: '3', agencyId: '1', name: 'Oliver Khan', email: 'oliver@globalexplorer.com', department: 'Operations', bookings: 6, commission: 360, leadsAssigned: 9, callsMade: 22, followUpsCompleted: 15, quotationsSent: 5, revenueGenerated: 180000, pendingTasks: 2, conversionPercent: 55 },
  { id: '4', agencyId: '1', name: 'Priya Sharma', email: 'priya@globalexplorer.com', department: 'Visa', bookings: 4, commission: 240, leadsAssigned: 7, callsMade: 18, followUpsCompleted: 12, quotationsSent: 3, revenueGenerated: 95000, pendingTasks: 4, conversionPercent: 43 },
  { id: '5', agencyId: '1', name: 'Arjun Mehta', email: 'arjun@globalexplorer.com', department: 'Sales', bookings: 11, commission: 660, leadsAssigned: 15, callsMade: 45, followUpsCompleted: 30, quotationsSent: 10, revenueGenerated: 420000, pendingTasks: 1, conversionPercent: 73 },
];

export interface CustomerDocument {
  id: string;
  name: string;
  type: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dob?: string;
  documents: CustomerDocument[];
}

export const initialCustomers = [
  { 
    id: '1', agentId: '1', name: 'Sarah Jenkins', email: 'sarah@example.com', phone: '+1234567890', status: 'Customer', tags: ['VIP', 'Repeat'],
    pastBookings: [{ id: 'B1001', type: 'Flight + Hotel', destination: 'Bali', date: '2025-12-10' }],
    documents: [{ id: 'D1', name: 'Passport.pdf', type: 'Passport' }],
    interactions: [{ id: 'I1', date: '2026-07-05', note: 'Discussed upcoming trip to Europe.' }],
    familyMembers: [
      { id: 'F1', name: 'Tom Jenkins', relation: 'Spouse', dob: '1985-05-12', documents: [{ id: 'D1-F1', name: 'Tom_Passport.pdf', type: 'Passport' }] },
      { id: 'F2', name: 'Lily Jenkins', relation: 'Child', dob: '2015-08-22', documents: [] }
    ]
  },
  { 
    id: '2', agentId: '1', name: 'Marcus Thorne', email: 'marcus@example.com', phone: '+0987654321', status: 'Lead', tags: ['High Budget'],
    pastBookings: [],
    documents: [],
    interactions: [{ id: 'I2', date: '2026-07-15', note: 'Initial inquiry for Zermatt ski trip.' }],
    familyMembers: []
  },
  { 
    id: '3', agentId: '2', name: 'Elena Rodriguez', email: 'elena@example.com', phone: '+1122334455', status: 'Customer', tags: [],
    pastBookings: [{ id: 'B800', type: 'Hotel', destination: 'Paris', date: '2024-05-12' }],
    documents: [{ id: 'D2', name: 'Visa_Application.pdf', type: 'Visa' }],
    interactions: [],
    familyMembers: []
  },
  { 
    id: '4', agentId: '3', name: 'David Chen', email: 'david@example.com', phone: '+5566778899', status: 'Lead', tags: ['Family'],
    pastBookings: [],
    documents: [],
    interactions: [],
    familyMembers: [
      { id: 'F3', name: 'Sarah Chen', relation: 'Spouse', dob: '1990-11-05', documents: [] }
    ]
  },
];

export type BookingType = 'Flight' | 'Hotel' | 'Package' | 'Visa';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refunded';

export const initialBookings = [
  { id: 'B1001', customerId: '1', agentId: '1', type: 'Flight' as BookingType, destination: 'Bali, Indonesia', pnr: 'ABC123', ticketNo: '098-1234567890', airline: 'IndiGo', supplier: 'IndiGo Direct', journeyDate: '2026-07-20', returnDate: '2026-07-27', tripType: 'Round Trip', netCost: 42000, sellingPrice: 52000, profit: 10000, bookingStatus: 'Confirmed' as BookingStatus, paymentStatus: 'Paid' as PaymentStatus, date: '2026-07-10', cancelReason: '', refundStatus: '' },
  { id: 'B1002', customerId: '1', agentId: '1', type: 'Hotel' as BookingType, destination: 'Bali, Indonesia', pnr: '', ticketNo: '', airline: '', supplier: 'Booking.com', journeyDate: '2026-07-20', returnDate: '2026-07-27', tripType: '', netCost: 85000, sellingPrice: 105000, profit: 20000, bookingStatus: 'Confirmed' as BookingStatus, paymentStatus: 'Paid' as PaymentStatus, date: '2026-07-10', cancelReason: '', refundStatus: '' },
  { id: 'B1003', customerId: '2', agentId: '1', type: 'Flight' as BookingType, destination: 'Zermatt, Switzerland', pnr: 'XYZ789', ticketNo: '724-9876543210', airline: 'SwissAir', supplier: 'MakeMyTrip', journeyDate: '2026-08-05', returnDate: '2026-08-12', tripType: 'Round Trip', netCost: 120000, sellingPrice: 145000, profit: 25000, bookingStatus: 'Pending' as BookingStatus, paymentStatus: 'Pending' as PaymentStatus, date: '2026-07-18', cancelReason: '', refundStatus: '' },
  { id: 'B1004', customerId: '3', agentId: '2', type: 'Package' as BookingType, destination: 'Kyoto, Japan', pnr: 'KYO456', ticketNo: '', airline: 'JAL', supplier: 'Cleartrip', journeyDate: '2026-09-12', returnDate: '2026-09-19', tripType: 'Round Trip', netCost: 210000, sellingPrice: 265000, profit: 55000, bookingStatus: 'Confirmed' as BookingStatus, paymentStatus: 'Partial' as PaymentStatus, date: '2026-07-22', cancelReason: '', refundStatus: '' },
  { id: 'B1005', customerId: '4', agentId: '3', type: 'Package' as BookingType, destination: 'Cape Town, SA', pnr: 'CPT321', ticketNo: '', airline: 'Emirates', supplier: 'Yatra', journeyDate: '2026-10-01', returnDate: '2026-10-08', tripType: 'Round Trip', netCost: 155000, sellingPrice: 195000, profit: 40000, bookingStatus: 'Pending' as BookingStatus, paymentStatus: 'Partial' as PaymentStatus, date: '2026-07-25', cancelReason: '', refundStatus: '' },
  { id: 'B1006', customerId: '1', agentId: '1', type: 'Visa' as BookingType, destination: 'Indonesia', pnr: '', ticketNo: '', airline: '', supplier: 'VFS Global', journeyDate: '2026-07-15', returnDate: '', tripType: '', netCost: 3500, sellingPrice: 5000, profit: 1500, bookingStatus: 'Completed' as BookingStatus, paymentStatus: 'Paid' as PaymentStatus, date: '2026-07-08', cancelReason: '', refundStatus: '' },
  { id: 'B1007', customerId: '3', agentId: '2', type: 'Flight' as BookingType, destination: 'Paris, France', pnr: 'PAR654', ticketNo: '057-1122334455', airline: 'Air France', supplier: 'Air France Direct', journeyDate: '2026-06-10', returnDate: '2026-06-17', tripType: 'Round Trip', netCost: 65000, sellingPrice: 78000, profit: 13000, bookingStatus: 'Completed' as BookingStatus, paymentStatus: 'Paid' as PaymentStatus, date: '2026-05-20', cancelReason: '', refundStatus: '' },
  { id: 'B1008', customerId: '2', agentId: '1', type: 'Hotel' as BookingType, destination: 'Dubai, UAE', pnr: '', ticketNo: '', airline: '', supplier: 'Agoda', journeyDate: '2026-08-15', returnDate: '2026-08-20', tripType: '', netCost: 48000, sellingPrice: 62000, profit: 14000, bookingStatus: 'Cancelled' as BookingStatus, paymentStatus: 'Refunded' as PaymentStatus, date: '2026-07-28', cancelReason: 'Client changed plans', refundStatus: 'Refunded ₹62,000' },
];

export type LeadCategory = 'Holiday Package' | 'Hotel' | 'Flight' | 'Visa';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiating' | 'Booked' | 'Lost';
export type LeadSource = 'Website' | 'WhatsApp' | 'Phone Call' | 'Social Media' | 'Walk-in' | 'Referral' | 'Other';
export type LeadPriority = 'High' | 'Medium' | 'Low';

export interface ProposalItem {
  id: string;
  type: 'Flight' | 'Hotel' | 'Transfer' | 'Activity' | 'Visa Fee' | 'Miscellaneous';
  description: string;
  supplier: string;
  netCost: number;
  sellingPrice: number;
}

export interface VisaTracker {
  passportCollected: boolean;
  photosCollected: boolean;
  formsFilled: boolean;
  submittedToEmbassy: boolean;
  approved: boolean;
}

export interface LeadNote {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface Lead {
  id: string;
  countryCode: string;
  phone: string;
  name: string;
  email: string;
  customerId?: string;
  destination: string;
  travelDateFrom: string;
  travelDateTo: string;
  categories: LeadCategory[];
  guestDetails: { adults: number; children: number; infants: number; specialRequirements: string };
  budget: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo: string; // agent id
  followUpDate: string;
  date: string;
  proposalItems: ProposalItem[];
  visaTracker?: VisaTracker;
  notes: LeadNote[];
  lostReason?: string;
}

export const initialLeads: Lead[] = [
  {
    id: 'L1',
    countryCode: '+91',
    phone: '9876543210',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    customerId: undefined,
    destination: 'Maldives',
    travelDateFrom: '2026-10-01',
    travelDateTo: '2026-10-08',
    categories: ['Holiday Package', 'Flight'],
    guestDetails: { adults: 2, children: 0, infants: 0, specialRequirements: 'Sea-facing villa preferred' },
    budget: '₹5,00,000',
    status: 'New',
    source: 'Phone Call',
    priority: 'High',
    assignedTo: '1',
    followUpDate: '2026-08-01',
    date: '2026-07-15',
    proposalItems: [
      { id: 'PI1', type: 'Flight', description: 'Mumbai – Malé return (Business)', supplier: 'IndiGo', netCost: 45000, sellingPrice: 52000 },
      { id: 'PI2', type: 'Hotel', description: 'Sun Siyam Iru Veli – 7N Water Villa', supplier: 'Sun Siyam Resorts', netCost: 180000, sellingPrice: 210000 },
    ],
    visaTracker: undefined,
    notes: [
      { id: 'N1', text: 'Called James. He wants a water villa, flexible dates in October.', timestamp: '2026-07-15T10:30:00', author: 'Liam Smith' },
    ],
  },
  {
    id: 'L2',
    countryCode: '+91',
    phone: '8765432109',
    name: 'Sophia Lee',
    email: 'sophia.lee@email.com',
    customerId: '1',
    destination: 'Rome, Italy',
    travelDateFrom: '2026-09-10',
    travelDateTo: '2026-09-17',
    categories: ['Holiday Package', 'Hotel', 'Visa'],
    guestDetails: { adults: 2, children: 1, infants: 0, specialRequirements: 'Kid-friendly hotel' },
    budget: '₹3,00,000',
    status: 'Proposal Sent',
    source: 'Referral',
    priority: 'High',
    assignedTo: '1',
    followUpDate: '2026-08-15',
    date: '2026-07-16',
    proposalItems: [
      { id: 'PI3', type: 'Flight', description: 'Mumbai – Rome return (Economy)', supplier: 'Emirates', netCost: 55000, sellingPrice: 65000 },
      { id: 'PI4', type: 'Hotel', description: 'Hotel Eden – 7N Deluxe', supplier: 'Dorchester Collection', netCost: 75000, sellingPrice: 88000 },
      { id: 'PI5', type: 'Visa Fee', description: 'Schengen Visa – 3 pax', supplier: 'Embassy of Italy', netCost: 9000, sellingPrice: 12000 },
    ],
    visaTracker: {
      passportCollected: true,
      photosCollected: true,
      formsFilled: false,
      submittedToEmbassy: false,
      approved: false,
    },
    notes: [
      { id: 'N2', text: 'Proposal sent via WhatsApp. Sophia liked the hotel option.', timestamp: '2026-07-20T14:00:00', author: 'Liam Smith' },
      { id: 'N3', text: 'Follow-up call done. Passports collected from office.', timestamp: '2026-07-22T11:15:00', author: 'Liam Smith' },
    ],
  },
  {
    id: 'L3',
    countryCode: '+91',
    phone: '7654321098',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    customerId: undefined,
    destination: 'New York, USA',
    travelDateFrom: '2026-08-20',
    travelDateTo: '2026-08-27',
    categories: ['Flight', 'Hotel'],
    guestDetails: { adults: 1, children: 0, infants: 0, specialRequirements: '' },
    budget: '₹2,50,000',
    status: 'Booked',
    source: 'Website',
    priority: 'Medium',
    assignedTo: '2',
    followUpDate: '2026-07-20',
    date: '2026-07-17',
    proposalItems: [
      { id: 'PI6', type: 'Flight', description: 'Delhi – New York return (Economy)', supplier: 'Air India', netCost: 68000, sellingPrice: 78000 },
      { id: 'PI7', type: 'Hotel', description: 'The Whitby Hotel – 7N King', supplier: 'Firmdale Hotels', netCost: 90000, sellingPrice: 105000 },
    ],
    visaTracker: undefined,
    notes: [
      { id: 'N4', text: 'Booking confirmed. Tickets sent over email.', timestamp: '2026-07-17T09:00:00', author: 'Liam Smith' },
    ],
  },
  {
    id: 'L4',
    countryCode: '+91',
    phone: '6543210987',
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    customerId: '2',
    destination: 'Tokyo, Japan',
    travelDateFrom: '2026-11-01',
    travelDateTo: '2026-11-10',
    categories: ['Holiday Package', 'Visa'],
    guestDetails: { adults: 2, children: 2, infants: 0, specialRequirements: 'Vegetarian meals' },
    budget: '₹4,50,000',
    status: 'Lost',
    source: 'Social Media',
    priority: 'Low',
    assignedTo: '3',
    followUpDate: '',
    date: '2026-07-18',
    lostReason: 'Booked through another agency',
    proposalItems: [],
    visaTracker: {
      passportCollected: false,
      photosCollected: false,
      formsFilled: false,
      submittedToEmbassy: false,
      approved: false,
    },
    notes: [
      { id: 'N5', text: 'Client decided to book directly through another agency.', timestamp: '2026-07-25T16:00:00', author: 'Liam Smith' },
    ],
  },
];

export const initialClientInvoices = [
  { id: 'INV-001', customerId: '1', customerName: 'Sarah Jenkins', agentId: '1', amount: 157000, gst: 28260, totalWithGst: 185260, amountPaid: 185260, status: 'Paid', date: '2026-07-10', dueDate: '2026-07-20', paymentMode: 'Bank Transfer' },
  { id: 'INV-002', customerId: '2', customerName: 'Marcus Thorne', agentId: '1', amount: 145000, gst: 26100, totalWithGst: 171100, amountPaid: 50000, status: 'Partial', date: '2026-07-15', dueDate: '2026-08-15', paymentMode: '' },
  { id: 'INV-003', customerId: '3', customerName: 'Elena Rodriguez', agentId: '2', amount: 265000, gst: 47700, totalWithGst: 312700, amountPaid: 312700, status: 'Paid', date: '2026-07-12', dueDate: '2026-07-22', paymentMode: 'UPI' },
  { id: 'INV-004', customerId: '4', customerName: 'David Chen', agentId: '3', amount: 195000, gst: 35100, totalWithGst: 230100, amountPaid: 0, status: 'Pending', date: '2026-07-18', dueDate: '2026-08-18', paymentMode: '' },
  { id: 'INV-005', customerId: '1', customerName: 'Sarah Jenkins', agentId: '1', amount: 62000, gst: 11160, totalWithGst: 73160, amountPaid: 73160, status: 'Paid', date: '2026-06-10', dueDate: '2026-06-20', paymentMode: 'Credit Card' },
  { id: 'INV-006', customerId: '3', customerName: 'Elena Rodriguez', agentId: '2', amount: 78000, gst: 14040, totalWithGst: 92040, amountPaid: 92040, status: 'Paid', date: '2026-06-15', dueDate: '2026-06-25', paymentMode: 'Bank Transfer' },
];

export const initialSupplierInvoices = [
  { id: 'SUP-001', supplierName: 'Emirates Airlines', category: 'Flight', amount: 55000, status: 'Pending', dueDate: '2026-08-15', bookingRef: 'B1003' },
  { id: 'SUP-002', supplierName: 'Booking.com', category: 'Hotel', amount: 85000, status: 'Paid', dueDate: '2026-08-01', bookingRef: 'B1002' },
  { id: 'SUP-003', supplierName: 'SwissAir', category: 'Flight', amount: 120000, status: 'Pending', dueDate: '2026-08-20', bookingRef: 'B1003' },
  { id: 'SUP-004', supplierName: 'VFS Global', category: 'Visa', amount: 3500, status: 'Paid', dueDate: '2026-07-20', bookingRef: 'B1006' },
  { id: 'SUP-005', supplierName: 'IndiGo Direct', category: 'Flight', amount: 42000, status: 'Paid', dueDate: '2026-07-15', bookingRef: 'B1001' },
  { id: 'SUP-006', supplierName: 'Cleartrip', category: 'Package', amount: 210000, status: 'Pending', dueDate: '2026-09-01', bookingRef: 'B1004' },
];

export const initialVisas = [
  { id: 'V1', customerId: '3', customerName: 'Elena Rodriguez', agentId: '2', country: 'Japan', visaType: 'Tourist', passportNumber: 'J8765432', status: 'Documents Pending', passportCollected: true, photosCollected: true, formsFilled: false, appointmentDate: '2026-08-20', biometricsDone: false, submittedToEmbassy: false, approved: false, rejected: false, passportReturned: false, visaValidity: '', expiryDate: '', applicationDate: '2026-07-20' },
  { id: 'V2', customerId: '4', customerName: 'David Chen', agentId: '3', country: 'South Africa', visaType: 'Tourist', passportNumber: 'K1234567', status: 'Approved', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-07-10', biometricsDone: true, submittedToEmbassy: true, approved: true, rejected: false, passportReturned: true, visaValidity: '90 days', expiryDate: '2026-12-31', applicationDate: '2026-07-01' },
  { id: 'V3', customerId: '1', customerName: 'Sarah Jenkins', agentId: '1', country: 'Indonesia', visaType: 'Tourist eVisa', passportNumber: 'A9876543', status: 'Approved', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '', biometricsDone: false, submittedToEmbassy: true, approved: true, rejected: false, passportReturned: true, visaValidity: '30 days', expiryDate: '2026-08-20', applicationDate: '2026-07-05' },
  { id: 'V4', customerId: '2', customerName: 'Marcus Thorne', agentId: '1', country: 'Switzerland', visaType: 'Schengen', passportNumber: 'B5432109', status: 'Submitted', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-07-25', biometricsDone: true, submittedToEmbassy: true, approved: false, rejected: false, passportReturned: false, visaValidity: '', expiryDate: '', applicationDate: '2026-07-15' },
  { id: 'V5', customerId: '3', customerName: 'Elena Rodriguez', agentId: '2', country: 'UK', visaType: 'Tourist', passportNumber: 'J8765432', status: 'Rejected', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-06-15', biometricsDone: true, submittedToEmbassy: true, approved: false, rejected: true, passportReturned: true, visaValidity: '', expiryDate: '', applicationDate: '2026-06-01' },
  { id: 'V6', customerId: '4', customerName: 'David Chen', agentId: '3', country: 'Thailand', visaType: 'Tourist', passportNumber: 'K1234567', status: 'Appointment Scheduled', passportCollected: true, photosCollected: true, formsFilled: true, appointmentDate: '2026-08-25', biometricsDone: false, submittedToEmbassy: false, approved: false, rejected: false, passportReturned: false, visaValidity: '', expiryDate: '', applicationDate: '2026-08-01' },
];
