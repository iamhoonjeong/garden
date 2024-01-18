import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Garden',
  description: `hoon's garden`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
