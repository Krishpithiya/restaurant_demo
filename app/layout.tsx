import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anna Kitchen — Premium South Indian Restaurant',
  description: 'Restaurant management system for Anna Kitchen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
