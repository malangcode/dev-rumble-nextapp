// app/layout.tsx (server component, no 'use client')
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import {NotificationProvider} from '@/context/messageContext';
import ConditionalLayout from '@/components/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartCanteen',
  description: 'Modern canteen management system for colleges',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <NotificationProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}
