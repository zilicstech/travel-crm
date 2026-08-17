import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TravelOS — Enterprise Travel Agency CRM & Management Platform',
  description: 'The operating system for modern travel agencies. Manage client profiles, itemized proposals, per-traveller visa checklists, and GST invoicing.',
  keywords: ['travel crm', 'travel agency software', 'travel agency crm', 'tour operator crm', 'itinerary proposal builder', 'visa tracking software'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'TravelOS — Enterprise Travel Agency CRM',
    description: 'Manage clients, proposals, visa checklists, and agency billing in one enterprise platform.',
    url: 'https://travelos.app',
    siteName: 'TravelOS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TravelOS — Enterprise Travel Agency CRM',
    description: 'The operating system for modern travel agencies.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'TravelOS',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web',
    'description': 'Enterprise Travel Agency CRM and Management Platform.',
    'url': 'https://travelos.app',
    'author': {
      '@type': 'Organization',
      'name': 'TravelOS Technologies Inc.',
      'url': 'https://travelos.app',
      'telephone': '+91-1800-572-9000'
    }
  };

  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
