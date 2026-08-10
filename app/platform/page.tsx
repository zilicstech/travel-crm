'use client';

import React from 'react';
import { initialAgencies } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building2, TrendingUp, Users } from 'lucide-react';

export default function PlatformDashboard() {
  const agencies = initialAgencies;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Agencies</CardTitle>
          <Building2 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{agencies.length}</div>
          <p className="text-xs text-green-600 font-medium mt-1">↑ +2 this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Agents</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{agencies.reduce((acc, curr) => acc + curr.agentsCount, 0)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Platform Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">${agencies.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
