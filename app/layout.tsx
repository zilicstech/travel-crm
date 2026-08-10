import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Nexus Travel CRM',
  description: 'A basic SAAS travel CRM featuring specialized dashboards for Super Admins, Agency Owners, and Travel Agents.',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
