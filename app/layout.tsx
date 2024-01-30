import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Garden',
  description: `hoon's garden`,
};

const lora = Lora({
  weight: '700',
  subsets: ['latin'],
  style: 'italic',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lora.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
