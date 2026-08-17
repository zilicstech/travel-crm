import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 rounded-lg",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 rounded-lg",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-lg",
    ghost: "hover:bg-slate-100 active:bg-slate-200 text-slate-600 rounded-lg",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 rounded-lg",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 rounded-lg",
    icon: "hover:bg-slate-100 active:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg",
  };

  const sizes: Record<string, string> = {
    xs: "h-7 px-2.5 text-xs gap-1",
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9 px-4 text-sm gap-2",
    lg: "h-11 px-6 text-sm gap-2",
  };

  const iconSize = variant === 'icon' ? "h-8 w-8 p-0" : "";

  return (
    <button className={cn(base, variants[variant], iconSize || sizes[size], className)} {...props} />
  );
}
