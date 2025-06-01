'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  HiHome,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiX,
} from 'react-icons/hi';

const navLinks = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'Menu', href: '/menu', icon: HiOutlineShoppingBag },
  { name: 'Checkout', href: '/checkout', icon: HiOutlineShoppingCart },
  { name: 'Notifications', href: '/notifications', icon: HiOutlineBell },
  { name: 'Cart', href: '/cart', icon: HiOutlineShoppingCart },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            SmartCanteen
          </Link>

          {/* Main Nav */}
          <div className="hidden md:flex items-center space-x-16">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-blue-600 transition-all duration-200"
                >
                  <div
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                    )}
                  >
                    <Icon className="text-lg" />
                  </div>
                  <span className="mt-[6px]">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile Icon */}
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition duration-200 flex items-center justify-center"
          >
            <HiOutlineUserCircle className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Account</h2>
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-red-500">
            <HiX className="text-2xl" />
          </button>
        </div>
        <div className="p-4 flex flex-col space-y-4">
          <Link
            href="/login"
            className="border border-blue-600 text-blue-600 text-center py-2 rounded hover:bg-blue-50 transition"
            onClick={toggleSidebar}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
            onClick={toggleSidebar}
          >
            Sign Up
          </Link>
          <Link href="/profile" onClick={toggleSidebar} className="text-sm text-gray-600 hover:text-blue-600 transition">
            My Profile
          </Link>
          <Link href="/settings" onClick={toggleSidebar} className="text-sm text-gray-600 hover:text-blue-600 transition">
            Settings
          </Link>
        </div>
      </div>

      {/* Background dim (optional) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-30 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
