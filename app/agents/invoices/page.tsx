'use client';

import React, { useState } from 'react';
import { initialClientInvoices, initialSupplierInvoices } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<'collect' | 'pay'>('collect');

  const totalToCollect = initialClientInvoices.reduce((sum, inv) => sum + (inv.status !== 'Paid' ? inv.amount : 0), 0);
  const totalToPay = initialSupplierInvoices.reduce((sum, inv) => sum + (inv.status !== 'Paid' ? inv.amount : 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-green-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Total Outstanding to Collect</p>
              <h2 className="text-2xl font-bold text-slate-900">${totalToCollect.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-700">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-orange-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Total Owed to Suppliers</p>
              <h2 className="text-2xl font-bold text-slate-900">${totalToPay.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-700">
              <ArrowUpFromLine className="w-6 h-6" />
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
            Money to Collect
          </button>
          <button 
            onClick={() => setActiveTab('pay')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'pay' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Money to Pay
          </button>
        </div>

        <CardContent className="p-0">
          {activeTab === 'collect' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialClientInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.customerName}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        invoice.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'pay' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Supplier Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialSupplierInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.supplierName}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        'bg-orange-100 text-orange-700'
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
