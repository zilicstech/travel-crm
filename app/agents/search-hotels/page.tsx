'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Hotel, Star, MapPin, Wifi, Utensils, Dumbbell, Car, Waves, CheckCircle, AlertCircle, ChevronDown, ChevronUp, TrendingDown, Filter, Users } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface VendorHotelOffer {
  vendor: string;
  vendorLogo: string;
  price: number;          // per night, total guests
  currency: string;
  refundable: boolean;
  mealPlan: string;
  roomType: string;
  cancelPolicy: string;
  roomsLeft: number;
}

interface HotelResult {
  id: string;
  name: string;
  brand: string;
  address: string;
  stars: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  imageEmoji: string;
  vendors: VendorHotelOffer[];
}

// ── Mock generator ─────────────────────────────────────────────────────────────

function generateHotels(destination: string, nights: number): HotelResult[] {
  const n = nights || 1;
  return [
    {
      id: 'H1',
      name: 'The Leela Palace',
      brand: 'The Leela',
      address: `Chanakyapuri, ${destination}`,
      stars: 5,
      rating: 9.4,
      reviewCount: 3218,
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'parking'],
      imageEmoji: '🏰',
      vendors: [
        { vendor: 'Booking.com', vendorLogo: '🔵', price: 28000 * n, currency: '₹', refundable: true, mealPlan: 'Room Only', roomType: 'Deluxe Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 4 },
        { vendor: 'Agoda', vendorLogo: '🟠', price: 27200 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Deluxe Room', cancelPolicy: 'Non-refundable', roomsLeft: 4 },
        { vendor: 'Hotels.com', vendorLogo: '🔴', price: 28500 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast', roomType: 'Deluxe Room', cancelPolicy: 'Free cancel till 48h', roomsLeft: 4 },
        { vendor: 'MakeMyTrip', vendorLogo: '🟤', price: 26900 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Deluxe Room', cancelPolicy: 'Non-refundable', roomsLeft: 4 },
        { vendor: 'Leela Direct', vendorLogo: '👑', price: 27500 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast incl.', roomType: 'Deluxe Room + Late Checkout', cancelPolicy: 'Free cancel till 72h', roomsLeft: 4 },
      ],
    },
    {
      id: 'H2',
      name: 'Taj Hotel & Convention Centre',
      brand: 'Taj Hotels',
      address: `Diplomatic Enclave, ${destination}`,
      stars: 5,
      rating: 9.1,
      reviewCount: 5431,
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa'],
      imageEmoji: '🏛️',
      vendors: [
        { vendor: 'Booking.com', vendorLogo: '🔵', price: 18500 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast', roomType: 'Superior Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 9 },
        { vendor: 'Agoda', vendorLogo: '🟠', price: 17900 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Superior Room', cancelPolicy: 'Non-refundable', roomsLeft: 9 },
        { vendor: 'Expedia', vendorLogo: '🟡', price: 19200 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast', roomType: 'Superior Room', cancelPolicy: 'Free cancel till 48h', roomsLeft: 9 },
        { vendor: 'MakeMyTrip', vendorLogo: '🟤', price: 17400 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Standard Room', cancelPolicy: 'Non-refundable', roomsLeft: 9 },
        { vendor: 'Cleartrip', vendorLogo: '🟢', price: 18100 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Superior Room', cancelPolicy: 'Non-refundable', roomsLeft: 9 },
        { vendor: 'Taj Direct', vendorLogo: '🏯', price: 18000 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast + Evening Tea', roomType: 'Superior Room + Welcome Amenity', cancelPolicy: 'Free cancel till 72h', roomsLeft: 9 },
      ],
    },
    {
      id: 'H3',
      name: 'Oberoi Maidens',
      brand: 'Oberoi Hotels',
      address: `Civil Lines, ${destination}`,
      stars: 5,
      rating: 9.3,
      reviewCount: 1887,
      amenities: ['wifi', 'pool', 'restaurant', 'parking'],
      imageEmoji: '🌿',
      vendors: [
        { vendor: 'Booking.com', vendorLogo: '🔵', price: 15000 * n, currency: '₹', refundable: true, mealPlan: 'Room Only', roomType: 'Classic Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 6 },
        { vendor: 'Hotels.com', vendorLogo: '🔴', price: 15400 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast', roomType: 'Classic Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 6 },
        { vendor: 'Agoda', vendorLogo: '🟠', price: 14600 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Classic Room', cancelPolicy: 'Non-refundable', roomsLeft: 6 },
        { vendor: 'MakeMyTrip', vendorLogo: '🟤', price: 14200 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Classic Room', cancelPolicy: 'Non-refundable', roomsLeft: 6 },
      ],
    },
    {
      id: 'H4',
      name: 'Hyatt Regency',
      brand: 'Hyatt',
      address: `Bhikaji Cama Place, ${destination}`,
      stars: 5,
      rating: 8.7,
      reviewCount: 6892,
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'parking', 'spa'],
      imageEmoji: '🔷',
      vendors: [
        { vendor: 'Hyatt Direct', vendorLogo: '🔷', price: 12500 * n, currency: '₹', refundable: true, mealPlan: 'Room Only', roomType: 'King Room', cancelPolicy: 'Free cancel till 48h', roomsLeft: 14 },
        { vendor: 'Booking.com', vendorLogo: '🔵', price: 12800 * n, currency: '₹', refundable: true, mealPlan: 'Room Only', roomType: 'King Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 14 },
        { vendor: 'Expedia', vendorLogo: '🟡', price: 12200 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'King Room', cancelPolicy: 'Non-refundable', roomsLeft: 14 },
        { vendor: 'Agoda', vendorLogo: '🟠', price: 11900 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'King Room', cancelPolicy: 'Non-refundable', roomsLeft: 14 },
        { vendor: 'MakeMyTrip', vendorLogo: '🟤', price: 12100 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'King Room', cancelPolicy: 'Non-refundable', roomsLeft: 14 },
      ],
    },
    {
      id: 'H5',
      name: 'Radisson Blu Plaza',
      brand: 'Radisson',
      address: `Mahipalpur, ${destination}`,
      stars: 4,
      rating: 8.2,
      reviewCount: 4103,
      amenities: ['wifi', 'pool', 'gym', 'restaurant'],
      imageEmoji: '🏨',
      vendors: [
        { vendor: 'Booking.com', vendorLogo: '🔵', price: 7200 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast', roomType: 'Superior Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 20 },
        { vendor: 'Agoda', vendorLogo: '🟠', price: 6800 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Superior Room', cancelPolicy: 'Non-refundable', roomsLeft: 20 },
        { vendor: 'Hotels.com', vendorLogo: '🔴', price: 7400 * n, currency: '₹', refundable: true, mealPlan: 'Breakfast', roomType: 'Superior Room', cancelPolicy: 'Free cancel till 24h', roomsLeft: 20 },
        { vendor: 'Cleartrip', vendorLogo: '🟢', price: 6900 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Deluxe Room', cancelPolicy: 'Non-refundable', roomsLeft: 20 },
        { vendor: 'MakeMyTrip', vendorLogo: '🟤', price: 6750 * n, currency: '₹', refundable: false, mealPlan: 'Room Only', roomType: 'Superior Room', cancelPolicy: 'Non-refundable', roomsLeft: 20 },
      ],
    },
  ];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatINR(n: number) { return '₹' + n.toLocaleString('en-IN'); }

function nightsBetween(checkin: string, checkout: string) {
  if (!checkin || !checkout) return 1;
  const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
  return Math.max(1, Math.round(diff / 86400000));
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  restaurant: <Utensils className="w-3.5 h-3.5" />,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  pool: <Waves className="w-3.5 h-3.5" />,
  spa: <Star className="w-3.5 h-3.5" />,
};

const POPULAR_DESTINATIONS = ['Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Dubai', 'Bangkok', 'Singapore', 'Bali'];

// ── Component ──────────────────────────────────────────────────────────────────

export default function SearchHotelsPage() {
  const [destination, setDestination] = useState('Delhi');
  const [checkin, setCheckin] = useState('2026-10-01');
  const [checkout, setCheckout] = useState('2026-10-05');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [results, setResults] = useState<HotelResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'stars'>('price');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [filterRefundable, setFilterRefundable] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<Record<string, string>>({});

  const nights = nightsBetween(checkin, checkout);

  const search = () => {
    setLoading(true);
    setResults(null);
    setExpandedHotel(null);
    setSelectedOffers({});
    setTimeout(() => {
      setResults(generateHotels(destination, nights));
      setLoading(false);
    }, 900);
  };

  const selectOffer = (hotelId: string, vendor: string) => {
    setSelectedOffers(prev => ({ ...prev, [hotelId]: vendor }));
  };

  const sorted = results ? [...results]
    .filter(r => !filterStars || r.stars === filterStars)
    .filter(r => !filterRefundable || r.vendors.some(v => v.refundable))
    .sort((a, b) => {
      if (sortBy === 'price') return Math.min(...a.vendors.map(v => v.price)) - Math.min(...b.vendors.map(v => v.price));
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.stars - a.stars;
    }) : null;

  const totalSelected = Object.keys(selectedOffers).length;

  return (
    <div className="space-y-6">
      {/* ── Search Form ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
            <Hotel className="w-4 h-4 mr-2 text-purple-600" /> Hotel Search & Price Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Popular destinations */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">Popular:</span>
            {POPULAR_DESTINATIONS.map(d => (
              <button key={d} onClick={() => setDestination(d)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full hover:bg-purple-100 transition-colors border ${destination === d ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-purple-700 bg-purple-50 border-purple-100'}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Destination */}
            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Destination / City</label>
              <Input value={destination} onChange={e => setDestination(e.target.value)} className="h-10 text-sm" placeholder="e.g., Goa, India" />
            </div>

            {/* Check-in */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Check-in</label>
              <Input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="h-10 text-sm" />
            </div>

            {/* Check-out */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Check-out</label>
              <Input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="h-10 text-sm" />
            </div>

            {/* Nights indicator */}
            <div className="md:col-span-1 flex items-end pb-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{nights} night{nights !== 1 ? 's' : ''}</span>
            </div>

            {/* Rooms */}
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rooms</label>
              <select value={rooms} onChange={e => setRooms(+e.target.value)}
                className="w-full h-10 text-sm border border-slate-200 rounded-lg px-2 bg-white focus:ring-1 focus:ring-purple-600 focus:outline-none">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Guests */}
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Guests</label>
              <select value={guests} onChange={e => setGuests(+e.target.value)}
                className="w-full h-10 text-sm border border-slate-200 rounded-lg px-2 bg-white focus:ring-1 focus:ring-purple-600 focus:outline-none">
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2 md:col-start-11">
              <Button onClick={search} disabled={loading || !destination || !checkin || !checkout}
                className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold disabled:opacity-50">
                {loading ? 'Searching...' : 'Search Hotels'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700">Comparing hotel prices from 6 platforms...</p>
            <p className="text-xs text-slate-400 mt-1">Booking.com · Agoda · Hotels.com · Expedia · MakeMyTrip · Cleartrip</p>
          </CardContent>
        </Card>
      )}

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {sorted && (
        <>
          {/* Sort + filter bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-600 font-medium">
              <span className="font-bold text-slate-900">{sorted.length}</span> hotels · {destination} · {nights} nights · {rooms} room{rooms > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                {[5, 4].map(s => (
                  <button key={s} onClick={() => setFilterStars(filterStars === s ? null : s)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 ${filterStars === s ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'}`}>
                    {'★'.repeat(s)} only
                  </button>
                ))}
                <button onClick={() => setFilterRefundable(!filterRefundable)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${filterRefundable ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'}`}>
                  Refundable
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
                {(['price', 'rating', 'stars'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-all ${sortBy === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hotel cards */}
          <div className="space-y-3">
            {sorted.map((hotel) => {
              const minPrice = Math.min(...hotel.vendors.map(v => v.price));
              const maxPrice = Math.max(...hotel.vendors.map(v => v.price));
              const cheapestVendor = hotel.vendors.find(v => v.price === minPrice)!;
              const isExpanded = expandedHotel === hotel.id;
              const isSelected = !!selectedOffers[hotel.id];
              const priceDiff = maxPrice - minPrice;

              return (
                <Card key={hotel.id} className={`transition-all border ${isSelected ? 'border-green-400 shadow-md' : 'border-slate-200'}`}>
                  <CardContent className="p-0">
                    {/* Hotel summary */}
                    <div className="flex items-center gap-5 p-5 flex-wrap">
                      {/* Emoji image */}
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-xl text-4xl">
                        {hotel.imageEmoji}
                      </div>

                      {/* Hotel info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900">{hotel.name}</h3>
                          <span className="text-xs text-amber-500 font-bold">{'★'.repeat(hotel.stars)}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{hotel.brand}</span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {hotel.address}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {/* Rating */}
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                            {hotel.rating} <span className="text-[10px] text-green-600">({hotel.reviewCount.toLocaleString()} reviews)</span>
                          </span>
                          {/* Amenities */}
                          <div className="flex items-center gap-2 text-slate-400">
                            {hotel.amenities.map(a => (
                              <span key={a} title={a} className="hover:text-slate-700 transition-colors">{AMENITY_ICONS[a]}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Price + vendor count */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">From (total {nights}N)</p>
                        <p className="text-xl font-bold text-green-700">{formatINR(minPrice)}</p>
                        {priceDiff > 0 && (
                          <>
                            <p className="text-xs text-slate-400">up to {formatINR(maxPrice)}</p>
                            <p className="text-[10px] text-amber-600 font-bold flex items-center justify-end gap-0.5 mt-0.5">
                              <TrendingDown className="w-2.5 h-2.5" /> Save {formatINR(priceDiff)}
                            </p>
                          </>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1">{hotel.vendors.length} vendors compared</p>
                        <Button size="sm" variant="ghost" onClick={() => setExpandedHotel(isExpanded ? null : hotel.id)}
                          className="mt-2 text-xs text-purple-600 hover:bg-purple-50 h-7 px-2">
                          {isExpanded ? <><ChevronUp className="w-3.5 h-3.5 mr-1" /> Hide prices</> : <><ChevronDown className="w-3.5 h-3.5 mr-1" /> Compare {hotel.vendors.length} prices</>}
                        </Button>
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 ml-1">
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
                              <th className="px-6 py-3 text-left">Platform</th>
                              <th className="px-4 py-3 text-left">Room Type</th>
                              <th className="px-4 py-3 text-left">Meal Plan</th>
                              <th className="px-4 py-3 text-left">Cancellation</th>
                              <th className="px-4 py-3 text-left">Rooms Left</th>
                              <th className="px-4 py-3 text-right">Total ({nights}N)</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[...hotel.vendors].sort((a, b) => a.price - b.price).map((offer, vi) => {
                              const isCheapest = vi === 0;
                              const isSel = selectedOffers[hotel.id] === offer.vendor;
                              return (
                                <tr key={offer.vendor} className={`transition-colors ${isSel ? 'bg-green-50' : 'hover:bg-white'}`}>
                                  <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{offer.vendorLogo}</span>
                                      <span className="text-sm font-semibold text-slate-900">{offer.vendor}</span>
                                      {isCheapest && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full uppercase tracking-wider">Cheapest</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-slate-700 font-medium">{offer.roomType}</td>
                                  <td className="px-4 py-3 text-xs text-slate-600">{offer.mealPlan}</td>
                                  <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold uppercase ${offer.refundable ? 'text-green-600' : 'text-red-400'}`}>
                                      {offer.cancelPolicy}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs font-bold ${offer.roomsLeft <= 5 ? 'text-red-500' : 'text-slate-600'}`}>
                                      {offer.roomsLeft <= 5 && <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                                      {offer.roomsLeft} left
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <p className={`text-sm font-bold ${isCheapest ? 'text-green-700' : 'text-slate-900'}`}>{formatINR(offer.price)}</p>
                                    <p className="text-[10px] text-slate-400">({formatINR(Math.round(offer.price / nights))}/night)</p>
                                    {vi > 0 && <p className="text-[10px] text-red-400">+{formatINR(offer.price - minPrice)} vs best</p>}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Button size="sm" onClick={() => selectOffer(hotel.id, offer.vendor)}
                                      className={`h-7 px-3 text-xs font-semibold ${isSel ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
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

          {/* Sticky summary bar */}
          {totalSelected > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{totalSelected} hotel(s) selected · {nights} nights</p>
                  <p className="text-sm font-bold">
                    Total: {formatINR(Object.entries(selectedOffers).reduce((sum, [hid, vendor]) => {
                      const h = results?.find(r => r.id === hid);
                      const v = h?.vendors.find(v => v.vendor === vendor);
                      return sum + (v?.price || 0);
                    }, 0))}
                  </p>
                </div>
                <Button size="sm" className="bg-purple-500 hover:bg-purple-400 text-white font-semibold h-9 px-4">
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
            <Hotel className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Enter destination and dates above and click Search Hotels</p>
            <p className="text-xs text-slate-400 mt-1">We'll compare prices from Booking.com, Agoda, Hotels.com, Expedia, MakeMyTrip and more</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
