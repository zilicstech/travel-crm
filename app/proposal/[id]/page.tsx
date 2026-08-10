'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { initialLeads } from '@/lib/mockData';
import { Plane, Calendar, MapPin, CheckCircle, FileText, Send, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProposalPage() {
  const params = useParams();
  const leadId = params.id as string;
  const lead = initialLeads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Proposal Not Found</h1>
          <p className="text-slate-500">The link you followed may be broken or expired.</p>
        </div>
      </div>
    );
  }

  const totalSelling = lead.proposalItems.reduce((sum, item) => sum + item.sellingPrice, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">TravelOS</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Prepared for</p>
            <p className="text-sm font-bold text-slate-900">{lead.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
        {/* Intro */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Your Travel Proposal</h1>
          <p className="text-slate-600 text-lg">We've put together a carefully crafted itinerary for your upcoming trip to <span className="font-bold text-slate-900">{lead.destination}</span>.</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">{lead.destination}</span>
            </div>
            {(lead.travelDateFrom || lead.travelDateTo) && (
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold">
                  {lead.travelDateFrom} {lead.travelDateTo && `to ${lead.travelDateTo}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">
                {lead.guestDetails.adults + lead.guestDetails.children + lead.guestDetails.infants} Guests
              </span>
            </div>
          </div>
        </div>

        {/* Proposal Items */}
        <Card className="mb-8 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-6 rounded-t-xl">
            <CardTitle className="text-lg font-bold flex items-center">
              <FileText className="w-5 h-5 mr-2 opacity-80" /> Proposed Itinerary & Inclusions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {lead.proposalItems.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {lead.proposalItems.map(item => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{item.description}</h3>
                      {item.supplier && <p className="text-sm text-slate-500 mt-1">Provider: {item.supplier}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">₹{item.sellingPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
                
                {/* Total */}
                <div className="p-6 bg-blue-50 border-t border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">Grand Total</h3>
                    <p className="text-sm text-blue-700">Includes all listed items and taxes.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-700">₹{totalSelling.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Your customized itinerary details are being finalized.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        {lead.proposalItems.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Confirm Your Trip?</h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">If this proposal looks good to you, please contact your agent to finalize the booking and secure these rates.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="h-12 px-8 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md hover:shadow-lg transition-all">
                <CheckCircle className="w-5 h-5 mr-2" /> Approve Proposal
              </Button>
              <Button variant="outline" className="h-12 px-8 text-base font-bold text-slate-700 rounded-full hover:bg-slate-50 border-slate-300">
                <Send className="w-5 h-5 mr-2" /> Contact Agent
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
