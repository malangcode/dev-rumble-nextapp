'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { axiosWithCsrf } from '@/lib/axiosWithCsrf'; // ✅ use helper
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [signingUp, setSigningUp] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      setSigningUp(true);

      // Signup API call
      await axiosWithCsrf.post('/auth/', {
        username: username.trim(),
        email: email.trim(),
        password1: password,
        password2: confirmPassword,
      });

      console.log('Signup successful');

      // Auto-login after signup
      await axiosWithCsrf.post('/auth/login/', {
        email: email.trim(),
        password: password,
      });

      console.log('Login successful after signup');
      window.location.href = '/';

    } catch (err: any) {
      console.error(err);

      if (err.response?.data) {
        const data = err.response.data;
        let messages: string[] = [];

        for (const key in data) {
          if (Array.isArray(data[key])) {
            messages.push(`${key}: ${data[key].join(' ')}`);
          } else if (typeof data[key] === 'string') {
            messages.push(`${key}: ${data[key]}`);
          }
        }
        setError(messages.join(' | '));
      } else {
        setError('Signup failed. Please try again.');
      }
    }finally{
      setSigningUp(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosWithCsrf.post(
          "/auth/google/",
          {
            access_token: tokenResponse.access_token,
          },
          { withCredentials: true } // needed to receive cookies!
        );

        console.log("✅ Google login success:", res.data);
        toast.success("Logged in successfully!")
        window.location.href = "/";
        // maybe trigger AuthProvider refetch or redirect here
      } catch (err) {
        console.error("❌ Google login failed:", err);
        toast.error("Google login failed!")
      }
    },
    onError: (err) => console.error("❌ Google login error:", err),
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700">Create an Account</h2>

        <Button
          onClick={()=>handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
          variant="outline"
        >
          <FcGoogle size={20} /> Continue with Google
        </Button>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Your username"
            />
          </div>

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

          <div className="relative">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            {signingUp ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
