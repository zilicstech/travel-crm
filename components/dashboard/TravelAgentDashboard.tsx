'use client';
import React, { useState } from 'react';
import { initialCustomers, initialBookings } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Search, Plane, Building, ReceiptText, FileText, Send, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function TravelAgentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'search'>('overview');
  const [customers] = useState(initialCustomers);
  const [bookings] = useState(initialBookings);

  const handleShare = (method: 'whatsapp' | 'email') => {
    alert(`Generating ${method} link...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        <Button 
          variant={activeTab === 'overview' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview & Bookings
        </Button>
        <Button 
          variant={activeTab === 'search' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('search')}
        >
          <Search className="h-4 w-4 mr-2" /> Find Flights & Hotels
        </Button>
      </div>

      {activeTab === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle>Search Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Destination</label>
                <div className="relative">
                  <Plane className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input className="pl-9" placeholder="City or Airport" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Check-in / Check-out</label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline"><Building className="h-4 w-4 mr-2" /> Search Hotels</Button>
              <Button><Plane className="h-4 w-4 mr-2" /> Search Flights</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings & Invoices</CardTitle>
                <Button variant="ghost" size="sm">Create Booking</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map(booking => {
                    const customer = customers.find(c => c.id === booking.customerId);
                    return (
                      <div key={booking.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">{booking.destination}</h4>
                            <p className="text-xs text-slate-500">{booking.type} • {customer?.name}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                          <span className="font-medium text-slate-900">${booking.sellingPrice.toLocaleString()}</span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')} title="Share via WhatsApp">
                              <Share2 className="h-3 w-3 mr-1" /> WhatsApp
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleShare('email')} title="Email Invoice">
                              <Send className="h-3 w-3 mr-1" /> Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customers & Leads</CardTitle>
                <Button variant="ghost" size="sm">Add New</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map(customer => (
                    <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        customer.status === 'Customer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
