import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.css';

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
      <body className={lora.className}>{children}</body>
    </html>
  );
}
