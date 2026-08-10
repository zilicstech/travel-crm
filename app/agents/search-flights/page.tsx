'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plane, ArrowRightLeft, Clock, Luggage, Star, ChevronDown, ChevronUp, Filter, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

interface FlightSegment {
  from: string;
  to: string;
  dep: string;  // HH:MM
  arr: string;
  duration: string;
  airline: string;
  flightNo: string;
}

interface VendorOffer {
  vendor: string;
  vendorLogo: string;
  price: number;
  currency: string;
  refundable: boolean;
  baggage: string;
  seatsLeft: number;
  fareType: string;
}

interface FlightResult {
  id: string;
  segments: FlightSegment[];
  totalDuration: string;
  stops: number;
  stopDetail?: string;
  vendors: VendorOffer[];
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

function generateFlights(from: string, to: string, date: string, pax: number): FlightResult[] {
  const mult = pax;
  return [
    {
      id: 'F1',
      segments: [
        { from, to, dep: '06:15', arr: '09:20', duration: '3h 05m', airline: 'IndiGo', flightNo: '6E-204' },
      ],
      totalDuration: '3h 05m',
      stops: 0,
      vendors: [
        { vendor: 'IndiGo Direct', vendorLogo: '🔵', price: 4280 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 3, fareType: 'Saver' },
        { vendor: 'MakeMyTrip', vendorLogo: '🔴', price: 4350 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 3, fareType: 'Saver' },
        { vendor: 'Cleartrip', vendorLogo: '🟠', price: 4290 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 3, fareType: 'Saver' },
        { vendor: 'EaseMyTrip', vendorLogo: '🟢', price: 4320 * mult, currency: '₹', refundable: true, baggage: '15kg + 7kg cabin', seatsLeft: 3, fareType: 'Flexi' },
      ],
    },
    {
      id: 'F2',
      segments: [
        { from, to, dep: '08:45', arr: '11:55', duration: '3h 10m', airline: 'Air India', flightNo: 'AI-665' },
      ],
      totalDuration: '3h 10m',
      stops: 0,
      vendors: [
        { vendor: 'Air India Direct', vendorLogo: '🇮🇳', price: 5100 * mult, currency: '₹', refundable: true, baggage: '25kg check-in', seatsLeft: 8, fareType: 'Flexi' },
        { vendor: 'MakeMyTrip', vendorLogo: '🔴', price: 5050 * mult, currency: '₹', refundable: false, baggage: '20kg check-in', seatsLeft: 8, fareType: 'Saver' },
        { vendor: 'Yatra', vendorLogo: '🟡', price: 5180 * mult, currency: '₹', refundable: true, baggage: '25kg check-in', seatsLeft: 8, fareType: 'Flexi' },
        { vendor: 'Goibibo', vendorLogo: '🟣', price: 4980 * mult, currency: '₹', refundable: false, baggage: '20kg check-in', seatsLeft: 8, fareType: 'Saver' },
      ],
    },
    {
      id: 'F3',
      segments: [
        { from, to: 'DEL', dep: '10:30', arr: '12:15', duration: '1h 45m', airline: 'SpiceJet', flightNo: 'SG-102' },
        { from: 'DEL', to, dep: '14:00', arr: '17:20', duration: '3h 20m', airline: 'SpiceJet', flightNo: 'SG-851' },
      ],
      totalDuration: '6h 50m',
      stops: 1,
      stopDetail: '1h 45m layover at Delhi (DEL)',
      vendors: [
        { vendor: 'SpiceJet Direct', vendorLogo: '🌶', price: 3750 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 11, fareType: 'Saver' },
        { vendor: 'MakeMyTrip', vendorLogo: '🔴', price: 3820 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 11, fareType: 'Saver' },
        { vendor: 'Cleartrip', vendorLogo: '🟠', price: 3780 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 11, fareType: 'Saver' },
      ],
    },
    {
      id: 'F4',
      segments: [
        { from, to, dep: '15:30', arr: '18:40', duration: '3h 10m', airline: 'Vistara', flightNo: 'UK-878' },
      ],
      totalDuration: '3h 10m',
      stops: 0,
      vendors: [
        { vendor: 'Vistara Direct', vendorLogo: '⭐', price: 6200 * mult, currency: '₹', refundable: true, baggage: '20kg check-in + lounge', seatsLeft: 5, fareType: 'Business Saver' },
        { vendor: 'MakeMyTrip', vendorLogo: '🔴', price: 6100 * mult, currency: '₹', refundable: false, baggage: '20kg check-in', seatsLeft: 5, fareType: 'Premium Economy' },
        { vendor: 'Yatra', vendorLogo: '🟡', price: 6350 * mult, currency: '₹', refundable: true, baggage: '20kg check-in + priority', seatsLeft: 5, fareType: 'Flexi' },
      ],
    },
    {
      id: 'F5',
      segments: [
        { from, to, dep: '21:00', arr: '00:10+1', duration: '3h 10m', airline: 'Akasa Air', flightNo: 'QP-1346' },
      ],
      totalDuration: '3h 10m',
      stops: 0,
      vendors: [
        { vendor: 'Akasa Direct', vendorLogo: '🌅', price: 3920 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 14, fareType: 'Saver' },
        { vendor: 'EaseMyTrip', vendorLogo: '🟢', price: 3880 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 14, fareType: 'Saver' },
        { vendor: 'Goibibo', vendorLogo: '🟣', price: 3960 * mult, currency: '₹', refundable: false, baggage: '15kg check-in', seatsLeft: 14, fareType: 'Saver' },
      ],
    },
  ];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const POPULAR_ROUTES = [
  { from: 'BOM', to: 'DEL', label: 'Mumbai → Delhi' },
  { from: 'BOM', to: 'GOI', label: 'Mumbai → Goa' },
  { from: 'DEL', to: 'BLR', label: 'Delhi → Bangalore' },
  { from: 'BOM', to: 'DXB', label: 'Mumbai → Dubai' },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function SearchFlightsPage() {
  const [from, setFrom] = useState('BOM');
  const [to, setTo] = useState('DEL');
  const [date, setDate] = useState('2026-10-01');
  const [returnDate, setReturnDate] = useState('');
  const [pax, setPax] = useState(2);
  const [cabin, setCabin] = useState<CabinClass>('Economy');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [results, setResults] = useState<FlightResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterNonStop, setFilterNonStop] = useState(false);
  const [filterRefundable, setFilterRefundable] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<Record<string, string>>({});

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  const search = () => {
    setLoading(true);
    setResults(null);
    setExpandedFlight(null);
    setSelectedOffers({});
    setTimeout(() => {
      setResults(generateFlights(from, to, date, pax));
      setLoading(false);
    }, 900);
  };

  const selectOffer = (flightId: string, vendor: string) => {
    setSelectedOffers(prev => ({ ...prev, [flightId]: vendor }));
  };

  const sorted = results ? [...results]
    .filter(r => !filterNonStop || r.stops === 0)
    .filter(r => !filterRefundable || r.vendors.some(v => v.refundable))
    .sort((a, b) => {
      if (sortBy === 'price') return Math.min(...a.vendors.map(v => v.price)) - Math.min(...b.vendors.map(v => v.price));
      if (sortBy === 'departure') return a.segments[0].dep.localeCompare(b.segments[0].dep);
      return a.totalDuration.localeCompare(b.totalDuration);
    }) : null;

  const totalSelected = Object.keys(selectedOffers).length;

  return (
    <div className="space-y-6">
      {/* ── Search Form ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              <Plane className="w-4 h-4 mr-2 text-blue-600" /> Flight Search & Price Comparison
            </CardTitle>
            {/* Trip type toggle */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
              {(['one-way', 'round-trip'] as const).map(t => (
                <button key={t} onClick={() => setTripType(t)}
                  className={`px-3 py-1.5 rounded-md transition-all capitalize ${tripType === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Popular routes */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">Popular:</span>
            {POPULAR_ROUTES.map(r => (
              <button key={r.label} onClick={() => { setFrom(r.from); setTo(r.to); }}
                className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors border border-blue-100">
                {r.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* From */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">From (IATA)</label>
              <Input value={from} onChange={e => setFrom(e.target.value.toUpperCase())} className="h-10 text-sm font-bold tracking-wider uppercase" placeholder="BOM" maxLength={3} />
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center">
              <button onClick={swap} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm mb-0.5">
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">To (IATA)</label>
              <Input value={to} onChange={e => setTo(e.target.value.toUpperCase())} className="h-10 text-sm font-bold tracking-wider uppercase" placeholder="DEL" maxLength={3} />
            </div>

            {/* Depart */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{tripType === 'round-trip' ? 'Depart' : 'Date'}</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 text-sm" />
            </div>

            {/* Return (round-trip only) */}
            {tripType === 'round-trip' && (
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Return</label>
                <Input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="h-10 text-sm" />
              </div>
            )}

            {/* Pax */}
            <div className={tripType === 'round-trip' ? 'md:col-span-1' : 'md:col-span-1'}>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pax</label>
              <select value={pax} onChange={e => setPax(+e.target.value)}
                className="w-full h-10 text-sm border border-slate-200 rounded-lg px-2 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none">
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Pax</option>)}
              </select>
            </div>

            {/* Cabin */}
            <div className={tripType === 'round-trip' ? 'md:col-span-3' : 'md:col-span-2'}>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cabin</label>
              <select value={cabin} onChange={e => setCabin(e.target.value as CabinClass)}
                className="w-full h-10 text-sm border border-slate-200 rounded-lg px-2 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none">
                {(['Economy', 'Premium Economy', 'Business', 'First'] as CabinClass[]).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2 md:col-start-11">
              <Button onClick={search} disabled={loading || !from || !to || !date}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold disabled:opacity-50">
                {loading ? 'Searching...' : 'Search Flights'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700">Comparing prices from 6 vendors...</p>
            <p className="text-xs text-slate-400 mt-1">MakeMyTrip · Cleartrip · Yatra · Goibibo · EaseMyTrip · Direct</p>
          </CardContent>
        </Card>
      )}

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {sorted && (
        <>
          {/* Sort + Filter bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-600 font-medium">
              <span className="font-bold text-slate-900">{sorted.length}</span> flights found · {from} → {to} · {pax} pax · {cabin}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <button onClick={() => setFilterNonStop(!filterNonStop)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${filterNonStop ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  Non-stop only
                </button>
                <button onClick={() => setFilterRefundable(!filterRefundable)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${filterRefundable ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  Refundable
                </button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
                {(['price', 'departure', 'duration'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-all ${sortBy === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flight cards */}
          <div className="space-y-3">
            {sorted.map((flight, idx) => {
              const minPrice = Math.min(...flight.vendors.map(v => v.price));
              const maxPrice = Math.max(...flight.vendors.map(v => v.price));
              const cheapestVendor = flight.vendors.find(v => v.price === minPrice)!;
              const isExpanded = expandedFlight === flight.id;
              const isSelected = !!selectedOffers[flight.id];
              const priceDiff = maxPrice - minPrice;

              return (
                <Card key={flight.id} className={`transition-all border ${isSelected ? 'border-green-400 shadow-md' : 'border-slate-200'}`}>
                  <CardContent className="p-0">
                    {/* Flight summary row */}
                    <div className="flex items-center gap-6 p-5 flex-wrap">
                      {/* Best price badge */}
                      {idx === 0 && sortBy === 'price' && (
                        <div className="absolute -mt-8 ml-4">
                          <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Best Price</span>
                        </div>
                      )}

                      {/* Airline info */}
                      <div className="flex-shrink-0 w-28">
                        <p className="text-sm font-bold text-slate-900">{flight.segments[0].airline}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{flight.segments.map(s => s.flightNo).join(' → ')}</p>
                      </div>

                      {/* Route + timing */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-900">{flight.segments[0].dep}</p>
                          <p className="text-xs text-slate-500 font-medium">{flight.segments[0].from}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <p className="text-[10px] text-slate-400 font-medium mb-1">{flight.totalDuration}</p>
                          <div className="w-full flex items-center gap-1">
                            <div className="h-px flex-1 bg-slate-300" />
                            {flight.stops === 0
                              ? <span className="text-[10px] text-green-600 font-bold uppercase">Non-stop</span>
                              : <span className="text-[10px] text-amber-600 font-bold uppercase">{flight.stops} stop</span>
                            }
                            <div className="h-px flex-1 bg-slate-300" />
                          </div>
                          {flight.stopDetail && <p className="text-[9px] text-slate-400 mt-1">{flight.stopDetail}</p>}
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-900">{flight.segments[flight.segments.length - 1].arr}</p>
                          <p className="text-xs text-slate-500 font-medium">{flight.segments[flight.segments.length - 1].to}</p>
                        </div>
                      </div>

                      {/* Price range + expand */}
                      <div className="flex-shrink-0 text-right ml-auto">
                        <div className="flex items-baseline gap-2 justify-end">
                          <p className="text-lg font-bold text-green-700">{formatINR(minPrice)}</p>
                          {priceDiff > 0 && <p className="text-xs text-slate-400">– {formatINR(maxPrice)}</p>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">{flight.vendors.length} vendors · {formatINR(priceDiff)} spread</p>
                        {priceDiff > 0 && (
                          <p className="text-[10px] text-amber-600 font-bold flex items-center justify-end gap-0.5 mt-0.5">
                            <TrendingDown className="w-2.5 h-2.5" /> Save {formatINR(priceDiff)} by picking right vendor
                          </p>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setExpandedFlight(isExpanded ? null : flight.id)}
                          className="mt-2 text-xs text-blue-600 hover:bg-blue-50 h-7 px-2">
                          {isExpanded ? <><ChevronUp className="w-3.5 h-3.5 mr-1" />Hide prices</> : <><ChevronDown className="w-3.5 h-3.5 mr-1" />Compare {flight.vendors.length} prices</>}
                        </Button>
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 ml-2">
                          <span className="flex items-center text-[10px] text-green-700 font-bold bg-green-100 px-2 py-1 rounded-full uppercase tracking-wider">
                            <CheckCircle className="w-3 h-3 mr-1" /> Selected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Vendor comparison table */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                              <th className="px-6 py-3 text-left">Vendor</th>
                              <th className="px-4 py-3 text-left">Fare Type</th>
                              <th className="px-4 py-3 text-left">Baggage</th>
                              <th className="px-4 py-3 text-left">Refundable</th>
                              <th className="px-4 py-3 text-left">Seats Left</th>
                              <th className="px-4 py-3 text-right">Price ({pax} pax)</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[...flight.vendors].sort((a, b) => a.price - b.price).map((offer, vi) => {
                              const isCheapest = vi === 0;
                              const isSel = selectedOffers[flight.id] === offer.vendor;
                              return (
                                <tr key={offer.vendor} className={`transition-colors ${isSel ? 'bg-green-50' : 'hover:bg-white'}`}>
                                  <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{offer.vendorLogo}</span>
                                      <span className="text-sm font-semibold text-slate-900">{offer.vendor}</span>
                                      {isCheapest && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full uppercase tracking-wider">Cheapest</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-slate-600 font-medium">{offer.fareType}</td>
                                  <td className="px-4 py-3 text-xs text-slate-600">
                                    <span className="flex items-center gap-1"><Luggage className="w-3 h-3" /> {offer.baggage}</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    {offer.refundable
                                      ? <span className="text-[10px] font-bold text-green-600 uppercase">Yes</span>
                                      : <span className="text-[10px] font-bold text-slate-400 uppercase">No</span>
                                    }
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs font-bold ${offer.seatsLeft <= 5 ? 'text-red-500' : 'text-slate-600'}`}>
                                      {offer.seatsLeft <= 5 && <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                                      {offer.seatsLeft} left
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <p className={`text-sm font-bold ${isCheapest ? 'text-green-700' : 'text-slate-900'}`}>{formatINR(offer.price)}</p>
                                    {vi > 0 && <p className="text-[10px] text-red-400">+{formatINR(offer.price - flight.vendors.find(v=>v.price===minPrice)!.price)} vs best</p>}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Button size="sm" onClick={() => selectOffer(flight.id, offer.vendor)}
                                      className={`h-7 px-3 text-xs font-semibold ${isSel ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                      {isSel ? 'Selected' : 'Select'}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary bar */}
          {totalSelected > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{totalSelected} flight(s) selected</p>
                  <p className="text-sm font-bold">
                    Total: {formatINR(Object.entries(selectedOffers).reduce((sum, [fid, vendor]) => {
                      const f = results?.find(r => r.id === fid);
                      const v = f?.vendors.find(v => v.vendor === vendor);
                      return sum + (v?.price || 0);
                    }, 0))}
                  </p>
                </div>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold h-9 px-4">
                  Add to Proposal
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!loading && !results && (
        <Card>
          <CardContent className="p-12 text-center">
            <Plane className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Enter route details above and click Search Flights</p>
            <p className="text-xs text-slate-400 mt-1">We'll compare prices from MakeMyTrip, Cleartrip, Yatra, Goibibo, EaseMyTrip and direct airline portals</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
