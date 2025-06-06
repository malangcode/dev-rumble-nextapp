'use client';

import { useState } from 'react';
import { Home, ShoppingCart, ClipboardList, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', icon: <Home size={18} />, key: 'dashboard' },
  { label: 'Orders', icon: <ClipboardList size={18} />, key: 'orders' },
  { label: 'Menu', icon: <ShoppingCart size={18} />, key: 'menu' },
  { label: 'Users', icon: <Users size={18} />, key: 'users' },
  { label: 'Settings', icon: <Settings size={18} />, key: 'settings' },
];

export default function AdminPage() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="text-gray-700">
            <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
            <p className="text-gray-600">Manage your canteen system with ease.</p>
          </div>
        );
      case 'orders':
        return <div>Orders Management Component</div>;
      case 'menu':
        return <div>Menu Management Component</div>;
      case 'users':
        return <div>User Management Component</div>;
      case 'settings':
        return <div>Settings Component</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2 mb-6">
            🍽️ Canteen Admin
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={cn(
                  'flex items-center w-full gap-2 px-4 py-2 rounded-lg text-left transition-colors',
                  activePage === item.key
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setActivePage(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div>
          <Button variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
