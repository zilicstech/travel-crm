'use client';

import React, { useState } from 'react';
import { initialClientInvoices, initialSupplierInvoices, initialBookings } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowDownToLine, ArrowUpFromLine, DollarSign, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function AgencyInvoicesPage() {
  const [activeTab, setActiveTab] = useState<'collect' | 'pay'>('collect');

  const totalCollected = initialClientInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPendingToCollect = initialClientInvoices.reduce((sum, inv) => sum + (inv.totalWithGst - inv.amountPaid), 0);
  const totalGST = initialClientInvoices.reduce((sum, inv) => sum + inv.gst, 0);

  const totalPaidToSuppliers = initialSupplierInvoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.amount : 0), 0);
  const totalPendingToPay = initialSupplierInvoices.reduce((sum, inv) => sum + (inv.status !== 'Paid' ? inv.amount : 0), 0);

  const totalProfit = initialBookings.reduce((sum, b) => sum + b.profit, 0);

  return (
    <div className="space-y-6">
      {/* Finance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Total Collected</p>
              <h2 className="text-2xl font-bold text-green-700">{formatINR(totalCollected)}</h2>
            </div>
            <ArrowDownToLine className="w-5 h-5 text-green-600 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">Pending to Collect</p>
              <h2 className="text-2xl font-bold text-red-700">{formatINR(totalPendingToCollect)}</h2>
            </div>
            <AlertTriangle className="w-5 h-5 text-red-600 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Pending to Suppliers</p>
              <h2 className="text-2xl font-bold text-amber-700">{formatINR(totalPendingToPay)}</h2>
            </div>
            <ArrowUpFromLine className="w-5 h-5 text-amber-600 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Total Profit</p>
              <h2 className="text-2xl font-bold text-blue-700">{formatINR(totalProfit)}</h2>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600 opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST Collected</p>
              <p className="text-lg font-bold text-slate-900">{formatINR(totalGST)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid to Suppliers</p>
              <p className="text-lg font-bold text-slate-900">{formatINR(totalPaidToSuppliers)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Tables Container */}
      <Card>
        <div className="flex border-b border-slate-100 p-2 gap-2">
          <button 
            onClick={() => setActiveTab('collect')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'collect' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Client Invoices (To Collect)
          </button>
          <button 
            onClick={() => setActiveTab('pay')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'pay' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Supplier Invoices (To Pay)
          </button>
        </div>

        <CardContent className="p-0 overflow-x-auto">
          {activeTab === 'collect' && (
            <table className="w-full text-sm text-left min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3 text-right">Base Amount</th>
                  <th className="px-6 py-3 text-right">GST</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-right">Paid</th>
                  <th className="px-6 py-3 text-right">Pending</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialClientInvoices.map((invoice) => {
                  const pending = invoice.totalWithGst - invoice.amountPaid;
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-bold text-slate-900">{invoice.id}</td>
                      <td className="px-6 py-3 text-sm text-slate-700 font-medium">{invoice.customerName}</td>
                      <td className="px-6 py-3 text-sm text-slate-600 text-right">{formatINR(invoice.amount)}</td>
                      <td className="px-6 py-3 text-sm text-slate-600 text-right">{formatINR(invoice.gst)}</td>
                      <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">{formatINR(invoice.totalWithGst)}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-green-600 text-right">{formatINR(invoice.amountPaid)}</td>
                      <td className="px-6 py-3 text-sm font-bold text-red-600 text-right">{pending > 0 ? formatINR(pending) : '–'}</td>
                      <td className="px-6 py-3 text-xs text-slate-600">
                        {invoice.dueDate}
                        {pending > 0 && new Date(invoice.dueDate) < new Date() && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-full">OVERDUE</span>}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          invoice.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === 'pay' && (
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Booking Ref</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialSupplierInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-bold text-slate-900">{invoice.id}</td>
                    <td className="px-6 py-3 text-sm text-slate-700 font-medium">{invoice.supplierName}</td>
                    <td className="px-6 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">{invoice.category}</span></td>
                    <td className="px-6 py-3 text-xs font-mono text-slate-500">{invoice.bookingRef}</td>
                    <td className="px-6 py-3 font-bold text-slate-900 text-right">{formatINR(invoice.amount)}</td>
                    <td className="px-6 py-3 text-xs text-slate-600">
                      {invoice.dueDate}
                      {invoice.status !== 'Paid' && new Date(invoice.dueDate) < new Date() && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-full">OVERDUE</span>}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
