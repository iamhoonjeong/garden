import type { Metadata } from 'next';
import { Lora, Montserrat } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Garden',
  description: `hoon's garden`,
};

const lora = Lora({
  weight: ['700'],
  style: 'italic',
  subsets: ['latin'],
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lora.className} ${montserrat.className}`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
