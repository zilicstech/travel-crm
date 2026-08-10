'use client';

import React from 'react';
import Link from 'next/link';
import { initialCustomers, initialBookings, initialLeads, initialAgents } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, CalendarCheck, Briefcase, TrendingUp, Target, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

const CURRENT_AGENT_ID = '1';
const agent = initialAgents.find(a => a.id === CURRENT_AGENT_ID)!;
const myLeads = initialLeads.filter(l => l.assignedTo === CURRENT_AGENT_ID);
const myBookings = initialBookings.filter(b => b.agentId === CURRENT_AGENT_ID);
const myCustomers = initialCustomers.filter(c => c.agentId === CURRENT_AGENT_ID);

const todayFollowUps = myLeads.filter(l => {
  if (!l.followUpDate || l.status === 'Booked' || l.status === 'Lost') return false;
  return new Date(l.followUpDate) <= new Date();
});

const conversionPercent = myLeads.length > 0
  ? Math.round((myLeads.filter(l => l.status === 'Booked').length / myLeads.length) * 100)
  : 0;

const totalRevenue = myBookings.reduce((s, b) => s + b.sellingPrice, 0);
const totalProfit = myBookings.reduce((s, b) => s + b.profit, 0);
const pendingBookings = myBookings.filter(b => b.bookingStatus === 'Pending');

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Leads</p>
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{myLeads.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">{myLeads.filter(l => l.status === 'New').length} new</p>
          </CardContent>
        </Card>
        <Card className={todayFollowUps.length > 0 ? 'border-red-200 bg-red-50/30' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Follow-ups Due</p>
              <CalendarCheck className={`w-4 h-4 ${todayFollowUps.length > 0 ? 'text-red-500' : 'text-green-600'}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{todayFollowUps.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">{todayFollowUps.length > 0 ? 'Action needed' : 'All clear'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bookings</p>
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{myBookings.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">{pendingBookings.length} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatINR(totalRevenue)}</p>
            <p className="text-xs text-green-600 font-semibold mt-0.5">Profit: {formatINR(totalProfit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversion %</p>
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{conversionPercent}%</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(conversionPercent, 100)}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Follow-ups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Overdue Follow-ups
            </CardTitle>
            <Link href="/agents/leads">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600">View All <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {todayFollowUps.length > 0 ? todayFollowUps.map(lead => (
                <Link key={lead.id} href={`/agents/leads/${lead.id}`} className="block p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.destination} · {lead.budget}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                        <Clock className="w-2.5 h-2.5 inline mr-0.5" /> {lead.followUpDate}
                      </span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="p-8 text-center text-sm text-slate-400">No overdue follow-ups. Great job!</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-purple-600" /> Recent Bookings
            </CardTitle>
            <Link href="/agents/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600">View All <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {myBookings.slice(0, 5).map(booking => {
                const customer = initialCustomers.find(c => c.id === booking.customerId);
                return (
                  <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{booking.destination}</h4>
                        <p className="text-xs text-slate-500">{booking.type} · {customer?.name} · {booking.journeyDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          booking.bookingStatus === 'Completed' ? 'bg-blue-100 text-blue-700' :
                          booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1.5">
                      <span className="font-bold text-slate-900">{formatINR(booking.sellingPrice)}</span>
                      <span className="text-green-600 font-semibold">Profit: {formatINR(booking.profit)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
