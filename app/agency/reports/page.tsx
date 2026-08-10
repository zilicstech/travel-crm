'use client';

import React, { useState } from 'react';
import { initialAgents, initialBookings, initialLeads, initialClientInvoices } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgencyReportsPage() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'employee' | 'leads' | 'bookings'>('revenue');

  // Revenue Data (dummy monthly data + current month from actual bookings)
  const totalRevenue = initialBookings.reduce((s, b) => s + b.sellingPrice, 0);
  const revenueData = [
    { name: 'Jan', revenue: 280000 }, { name: 'Feb', revenue: 350000 }, { name: 'Mar', revenue: 420000 },
    { name: 'Apr', revenue: 380000 }, { name: 'May', revenue: 510000 }, { name: 'Jun', revenue: 620000 },
    { name: 'Jul', revenue: totalRevenue },
  ];

  // Employee Data
  const employeeData = initialAgents.map(a => ({
    name: a.name,
    revenue: a.revenueGenerated,
    conversion: a.conversionPercent,
  }));

  // Leads Data
  const leadSourceData = [
    { name: 'Phone Call', value: initialLeads.filter(l => l.source === 'Phone Call').length },
    { name: 'Website', value: initialLeads.filter(l => l.source === 'Website').length },
    { name: 'WhatsApp', value: initialLeads.filter(l => l.source === 'WhatsApp').length },
    { name: 'Referral', value: initialLeads.filter(l => l.source === 'Referral').length },
    { name: 'Social Media', value: initialLeads.filter(l => l.source === 'Social Media').length },
  ].filter(d => d.value > 0);
  
  const leadColors = ['#3b82f6', '#22c55e', '#10b981', '#a855f7', '#ec4899'];

  // Booking Data
  const bookingTypeData = [
    { name: 'Flight', value: initialBookings.filter(b => b.type === 'Flight').length },
    { name: 'Hotel', value: initialBookings.filter(b => b.type === 'Hotel').length },
    { name: 'Package', value: initialBookings.filter(b => b.type === 'Package').length },
    { name: 'Visa', value: initialBookings.filter(b => b.type === 'Visa').length },
  ].filter(d => d.value > 0);
  
  const bookingColors = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Reports Center</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Current View (CSV)
        </Button>
      </div>

      <Card>
        <div className="flex border-b border-slate-100 p-2 gap-2 overflow-x-auto">
          {['revenue', 'employee', 'leads', 'bookings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab} Analytics
            </button>
          ))}
        </div>

        <CardContent className="p-6">
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Monthly Revenue Trends</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{fill: '#64748b', fontSize: 11}} />
                        <Tooltip formatter={(v: any) => formatINR(Number(v))} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                        <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Collection Status Overview</h3>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-2">Invoice</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2 text-right">Paid</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {initialClientInvoices.map(inv => (
                        <tr key={inv.id}>
                          <td className="px-4 py-2 font-bold text-slate-900">{inv.id}</td>
                          <td className="px-4 py-2 text-right">{formatINR(inv.totalWithGst)}</td>
                          <td className="px-4 py-2 text-right text-green-600 font-semibold">{formatINR(inv.amountPaid)}</td>
                          <td className="px-4 py-2"><span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{inv.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employee' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Revenue Generated by Agent vs Target</h3>
              <div className="h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{fill: '#64748b', fontSize: 11}} />
                    <Tooltip formatter={(v: any) => formatINR(Number(v))} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Agent KPI Data Table</h3>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-2">Agent Name</th>
                    <th className="px-4 py-2 text-right">Revenue</th>
                    <th className="px-4 py-2 text-right">Conv %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employeeData.map(a => (
                    <tr key={a.name}>
                      <td className="px-4 py-2 font-bold text-slate-900">{a.name}</td>
                      <td className="px-4 py-2 text-right font-semibold text-green-700">{formatINR(a.revenue)}</td>
                      <td className="px-4 py-2 text-right font-bold">{a.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Lead Source Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {leadSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={leadColors[index % leadColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {leadSourceData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: leadColors[index % leadColors.length] }}></div>
                      <span className="text-xs text-slate-600">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Leads Log</h3>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                      <th className="px-4 py-2">Lead</th>
                      <th className="px-4 py-2">Source</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {initialLeads.map(l => (
                      <tr key={l.id}>
                        <td className="px-4 py-2 font-bold text-slate-900">{l.name}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{l.source}</td>
                        <td className="px-4 py-2 text-xs font-semibold">{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Booking Type Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={bookingTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {bookingTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={bookingColors[index % bookingColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {bookingTypeData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bookingColors[index % bookingColors.length] }}></div>
                      <span className="text-xs text-slate-600">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Bookings Log</h3>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                      <th className="px-4 py-2">Booking ID</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {initialBookings.slice(0, 10).map(b => (
                      <tr key={b.id}>
                        <td className="px-4 py-2 font-bold text-slate-900">{b.id}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{b.type}</td>
                        <td className="px-4 py-2 text-right font-semibold text-green-700">{formatINR(b.sellingPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
