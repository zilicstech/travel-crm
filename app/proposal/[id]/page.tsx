'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { initialLeads, getClientById, deriveFareClass } from '@/lib/mockData';
import { Plane, Calendar, MapPin, CheckCircle, FileText, Send, User, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ProposalPage() {
  const params = useParams();
  const leadId = params.id as string;
  const lead = initialLeads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900 mb-2">Proposal Not Found</h1>
        <p className="text-slate-500">The link you followed may be broken, expired, or removed.</p>
      </div>
    );
  }

  const client = getClientById(lead.clientId);
  const totalSelling = lead.proposalItems.reduce((sum, item) => sum + item.sellingPrice, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Enterprise Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">TravelOS</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Prepared for</p>
            <p className="text-sm font-bold text-slate-900">{client?.name || 'Valued Client'}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-8">
        {/* Intro Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            Official Proposal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Your Travel Itinerary</h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            We have carefully curated the following travel arrangements for your upcoming trip to <strong className="text-slate-900">{lead.destination}</strong>.
          </p>
        </div>

        {/* Trip Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
                <p className="text-base font-bold text-slate-900">{lead.destination}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Travel Dates</p>
                <p className="text-base font-bold text-slate-900">
                  {lead.travelDateFrom || 'TBD'} <span className="text-slate-400 font-normal mx-1">to</span> {lead.travelDateTo || 'TBD'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Travellers</p>
                <p className="text-base font-bold text-slate-900">{lead.travellers.length} Registered</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposal Details Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Proposed Services & Costing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {lead.proposalItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Service Description</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {lead.proposalItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{item.description}</p>
                          {item.supplier && <p className="text-xs text-slate-500 mt-1">Provided by {item.supplier}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="slate">{item.type}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-bold text-slate-900">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.sellingPrice)}
                          </p>
                        </td>
                      </tr>
                    ))}
                    {/* Grand Total Row */}
                    <tr className="bg-blue-50/50">
                      <td colSpan={2} className="px-6 py-5 text-right">
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grand Total</p>
                        <p className="text-xs text-slate-500 mt-0.5">Inclusive of taxes & fees</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-2xl font-bold text-blue-700">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalSelling)}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Building Proposal</h3>
                <p className="text-sm text-slate-500">Your agent is currently finalizing the line items for this itinerary.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        {lead.proposalItems.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-3">Ready to confirm your booking?</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                Secure your travel arrangements at these proposed rates. Click below to approve the proposal or reach out to your agent for any adjustments.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/50">
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve Proposal
                </Button>
                <Button variant="outline" className="h-12 px-8 text-sm font-bold border-slate-700 text-white hover:bg-slate-800 hover:text-white">
                  <Send className="w-4 h-4 mr-2" /> Message Agent
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
