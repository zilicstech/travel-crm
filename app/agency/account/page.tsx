'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AgencyAccountPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">Agency Account</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
            JD
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">John Davis</h3>
            <p className="text-slate-500">Agency Owner at Global Explorer Travels</p>
            <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <Input defaultValue="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <Input defaultValue="Davis" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <Input defaultValue="owner@globalexplorer.com" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Agency Name</label>
            <Input defaultValue="Global Explorer Travels" type="text" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
