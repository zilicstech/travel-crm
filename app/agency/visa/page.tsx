'use client';

import React from 'react';
import { initialVisas, initialAgents } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, FileText, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const visas = initialVisas;
const total = visas.length;
const docsPending = visas.filter(v => !v.formsFilled || !v.photosCollected || !v.passportCollected).length;
const appointmentScheduled = visas.filter(v => v.appointmentDate && !v.biometricsDone && !v.submittedToEmbassy).length;
const biometricPending = visas.filter(v => v.appointmentDate && !v.biometricsDone && v.formsFilled).length;
const submitted = visas.filter(v => v.submittedToEmbassy && !v.approved && !v.rejected).length;
const approved = visas.filter(v => v.approved).length;
const rejected = visas.filter(v => v.rejected).length;
const passportPending = visas.filter(v => v.approved && !v.passportReturned).length;
const passportReturned = visas.filter(v => v.passportReturned).length;

const statusColors: Record<string, string> = {
  'Documents Pending': 'bg-amber-100 text-amber-700',
  'Appointment Scheduled': 'bg-blue-100 text-blue-700',
  'Submitted': 'bg-purple-100 text-purple-700',
  'Approved': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
};

// Pipeline steps
const pipeline = [
  { label: 'Documents Pending', count: docsPending, icon: FileText, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { label: 'Appointment', count: appointmentScheduled, icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { label: 'Biometric', count: biometricPending, icon: Shield, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { label: 'Submitted', count: submitted, icon: Clock, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { label: 'Approved', count: approved, icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  { label: 'Rejected', count: rejected, icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
];

export default function VisaDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</p><p className="text-2xl font-bold text-slate-900 mt-1">{total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Approved</p><p className="text-2xl font-bold text-green-700 mt-1">{approved}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Rejected</p><p className="text-2xl font-bold text-red-600 mt-1">{rejected}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passport Returned</p><p className="text-2xl font-bold text-slate-900 mt-1">{passportReturned}/{total}</p></CardContent></Card>
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-sm font-bold text-slate-900 flex items-center"><Shield className="w-4 h-4 mr-2 text-indigo-600" /> Visa Processing Pipeline</CardTitle></CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {pipeline.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className={`flex-1 min-w-[120px] p-4 rounded-xl border text-center ${step.color}`}>
                  <step.icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{step.count}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-1">{step.label}</p>
                </div>
                {i < pipeline.length - 1 && <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All applications */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-sm font-bold text-slate-900">All Visa Applications</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Visa Type</th>
                <th className="px-4 py-3">Passport</th>
                <th className="px-4 py-3">Appointment</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Docs</th>
                <th className="px-4 py-3">Passport Returned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visas.map(v => {
                const agent = initialAgents.find(a => a.id === v.agentId);
                const docsComplete = v.passportCollected && v.photosCollected && v.formsFilled;
                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-sm text-slate-900">{v.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{v.customerName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{v.country}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{v.visaType}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{v.passportNumber}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{v.appointmentDate || '–'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{agent?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[v.status] || 'bg-slate-100 text-slate-600'}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {docsComplete ? (
                        <span className="text-green-600"><CheckCircle className="w-4 h-4" /></span>
                      ) : (
                        <span className="text-amber-500"><AlertTriangle className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {v.passportReturned ? <span className="text-green-600 text-xs font-bold">Yes</span> : <span className="text-slate-400 text-xs">No</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
