// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NotificationProvider } from "@/context/messageContext";

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
          <Navbar />
          <div className="min-h-screen flex justify-center px-4 pt-3">
          <main className="w-full max-w-[1200px]">{children}</main>
          </div>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
