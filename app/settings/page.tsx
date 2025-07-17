'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: 'Rahish Sheikh',
    email: 'rahish@texas.edu.np',
    department: 'Bachelor of IT',
    password: '',
    confirmPassword: '',
    notifications: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Settings Updated:', form);
    alert('✅ Settings updated successfully!');
  };

  return (
    <section className="min-h-screen px-4 sm:px-10 py-10 bg-[var(--bg-component)] ">
      <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Account Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Section */}
          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-[var(--gray-300)] p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[var(--gray-300)] p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Department</label>
            <input
              name="department"
              type="text"
              value={form.department}
              onChange={handleChange}
              className="w-full border border=[var(--gray-300)] p-2 rounded-md"
              required
            />
          </div>

          {/* Password Section */}
          <div className="pt-6 border-t border-[var(--gray-200)] ">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Change Password</h3>
            <input
              name="password"
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-[var(--gray-300)] p-2 rounded-md mb-2"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-[var(--gray-300)] p-2 rounded-md"
            />
          </div>

          {/* Notifications */}
          <div className="pt-6 border-t border-[var(--gray-200] flex items-center gap-2">
            <input
              name="notifications"
              type="checkbox"
              checked={form.notifications}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-[var(--text-primary)] ">Receive order status notifications</label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" size="lg">
              Save Changes
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-[var(--gray-200)] ">
            <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Deleting your account will remove all order history and cannot be undone.
            </p>
            <Button type="button">
              Delete Account
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
