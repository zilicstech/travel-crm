'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initialCustomers, initialAgents, initialBookings, initialLeads } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Phone, Mail, FileText, Calendar, MessageSquare, UploadCloud, User, TrendingUp } from 'lucide-react';
import { FamilyMembersSection } from '@/components/shared/FamilyMembersSection';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

const STATUS_COLORS: Record<string, string> = {
  Customer: 'bg-blue-100 text-blue-700',
  VIP: 'bg-amber-100 text-amber-700',
  Corporate: 'bg-purple-100 text-purple-700',
  Lead: 'bg-slate-100 text-slate-600',
};

export default function AgencyCustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const customer = initialCustomers.find(c => c.id === customerId);

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">Customer Not Found</h2>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const assignedAgent = initialAgents.find(a => a.id === customer.agentId);
  const customerBookings = initialBookings.filter(b => b.customerId === customer.id);
  const customerLeads = initialLeads.filter(l => l.customerId === customer.id);
  const totalSpend = customerBookings.reduce((s, b) => s + b.sellingPrice, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/agency/customers')}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Customers
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-semibold text-slate-700">{customer.name}</span>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-slate-600 font-medium">
              <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" /> {customer.phone}</span>
              <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5" /> {customer.email}</span>
              {assignedAgent && (
                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1.5" /> Managed by {assignedAgent.name}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[customer.status] || 'bg-slate-100 text-slate-600'}`}>
                {customer.status}
              </span>
              {customer.tags?.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-shrink-0">
          <MessageSquare className="w-4 h-4 mr-1.5" /> Add Note / Log Call
        </Button>
      </div>

      {/* Quick KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{customerBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spend</p>
            <p className="text-xl font-bold text-green-700 mt-1">{formatINR(totalSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Leads</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{customerLeads.filter(l => l.status !== 'Lost' && l.status !== 'Booked').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{customer.documents?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" /> Booking History
          </CardTitle>
          <span className="text-xs text-slate-400">{customerBookings.length} bookings</span>
        </CardHeader>
        <CardContent className="p-0">
          {customerBookings.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-3">Booking ID</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Journey Date</th>
                  <th className="px-6 py-3 text-right">Value</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-bold text-sm text-slate-900">{booking.id}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{booking.destination}</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{booking.type}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">{booking.journeyDate}</td>
                    <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">{formatINR(booking.sellingPrice)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        booking.bookingStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        booking.bookingStatus === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>{booking.bookingStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">No bookings found for this customer.</div>
          )}
        </CardContent>
      </Card>

      {/* Past Trips from mock (pastBookings) */}
      {customer.pastBookings && customer.pastBookings.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-slate-400" /> Past Trips
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-3">Booking ID</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customer.pastBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-bold text-sm text-slate-900">{booking.id}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{booking.destination}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-600">{booking.type}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{booking.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-slate-400" /> Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer min-h-[120px]">
            <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Upload Document</p>
            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
          {customer.documents?.map(doc => (
            <Card key={doc.id} className="flex flex-col justify-center min-h-[120px] shadow-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">{doc.type}</p>
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600 p-0 h-auto mt-2 font-semibold hover:text-blue-700">View File</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 2.5: Family Members */}
      <FamilyMembersSection initialMembers={customer.familyMembers || []} />

      {/* Interaction Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-blue-600" /> Interaction Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {customer.interactions && customer.interactions.length > 0 ? (
              customer.interactions.map(interaction => (
                <div key={interaction.id} className="flex gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {interaction.date.split('-')[2]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-900">
                        {assignedAgent ? `Note by ${assignedAgent.name}` : 'Note added'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{interaction.date}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{interaction.note}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">No interactions recorded yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
