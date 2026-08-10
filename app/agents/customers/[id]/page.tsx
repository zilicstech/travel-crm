'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initialCustomers } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Phone, Mail, FileText, Calendar, MessageSquare, UploadCloud } from 'lucide-react';
import { FamilyMembersSection } from '@/components/shared/FamilyMembersSection';

export default function CustomerProfilePage() {
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Customers
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-600 font-medium">
              <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" /> {customer.phone}</span>
              <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5" /> {customer.email}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status === 'Customer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {customer.status}
              </span>
              {customer.tags?.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <MessageSquare className="w-4 h-4 mr-1.5" /> Add Note / Log Call
          </Button>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* Section 1: Active Trips & History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" /> Active Trips & History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {customer.pastBookings && customer.pastBookings.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customer.pastBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-slate-900">{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.destination}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{booking.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No past trips found for this customer.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Documents */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-slate-400" /> Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upload Dropzone */}
            <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer min-h-[120px]">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Upload Document</p>
              <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
            
            {/* Existing Documents */}
            {customer.documents?.map((doc) => (
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

        {/* Section 3: Interaction Log */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-blue-600" /> Interaction Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {customer.interactions && customer.interactions.length > 0 ? (
                customer.interactions.map((interaction) => (
                  <div key={interaction.id} className="flex gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {interaction.date.split('-')[2]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-900">Note added by You</span>
                        <span className="text-xs text-slate-500 font-medium">{interaction.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{interaction.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No interactions recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
