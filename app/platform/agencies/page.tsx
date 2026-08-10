'use client';

import React, { useState } from 'react';
import { initialAgencies } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus } from 'lucide-react';

export default function PlatformAgenciesPage() {
  const [search, setSearch] = useState('');
  const filteredAgencies = initialAgencies.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
        <CardTitle className="text-sm font-bold text-slate-900">Onboarded Agencies</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9 bg-slate-50 border-slate-200" 
              placeholder="Search agencies..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Agency</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-100">
              <tr className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4">Agency Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Agents</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{agency.name}</td>
                  <td className="px-6 py-4 text-slate-600">{agency.owner}</td>
                  <td className="px-6 py-4 text-slate-600">{agency.agentsCount}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">${agency.totalRevenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                      {agency.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">Manage</Button>
                  </td>
                </tr>
              ))}
              {filteredAgencies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No agencies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
