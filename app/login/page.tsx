'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login with', { email, password });
    // TODO: Add auth logic here
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: Add Google OAuth here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700">Welcome Back</h2>

        {/* Google Login */}
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
          variant="outline"
        >
          <FcGoogle size={20} /> Continue with Google
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm text-gray-500 bg-white px-2">
            or login with email
          </div>
        </div>

        {/* Email Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
