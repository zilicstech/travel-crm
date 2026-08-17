import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'blue' | 'cyan' | 'indigo' | 'purple' | 'amber' | 'green' | 'red' | 'slate' | 'emerald' | 'orange';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  blue: 'bg-blue-50 text-blue-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  indigo: 'bg-indigo-50 text-indigo-700',
  purple: 'bg-purple-50 text-purple-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  slate: 'bg-slate-100 text-slate-500',
  emerald: 'bg-emerald-50 text-emerald-700',
  orange: 'bg-orange-50 text-orange-700',
};

// Pre-mapped status → variant helpers
const LEAD_STATUS_VARIANT: Record<string, BadgeVariant> = {
  'New': 'blue',
  'Contacted': 'cyan',
  'Qualified': 'indigo',
  'Proposal Sent': 'purple',
  'Negotiating': 'amber',
  'Booked': 'green',
  'Lost': 'slate',
};

const BOOKING_STATUS_VARIANT: Record<string, BadgeVariant> = {
  'Confirmed': 'green',
  'Pending': 'amber',
  'Cancelled': 'red',
  'Completed': 'blue',
};

const CLIENT_TYPE_VARIANT: Record<string, BadgeVariant> = {
  'B2C': 'blue',
  'B2B': 'purple',
};

const TRAVELLER_STATUS_VARIANT: Record<string, BadgeVariant> = {
  'Tentative': 'amber',
  'Confirmed': 'green',
  'Dropped': 'slate',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-relaxed whitespace-nowrap",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}

// Convenience helpers
export function LeadStatusBadge({ status }: { status: string }) {
  return <Badge variant={LEAD_STATUS_VARIANT[status] || 'default'} dot>{status}</Badge>;
}

export function BookingStatusBadge({ status }: { status: string }) {
  return <Badge variant={BOOKING_STATUS_VARIANT[status] || 'default'}>{status}</Badge>;
}

export function ClientTypeBadge({ type }: { type: string }) {
  return <Badge variant={CLIENT_TYPE_VARIANT[type] || 'default'}>{type}</Badge>;
}

export function TravellerStatusBadge({ status }: { status: string }) {
  return <Badge variant={TRAVELLER_STATUS_VARIANT[status] || 'default'} dot>{status}</Badge>;
}

export function InfoBadge({ icon: Icon, text, className }: { icon: any, text: string, className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200", className)}>
      <Icon className="w-3.5 h-3.5 text-blue-500" />
      {text}
    </div>
  );
}
