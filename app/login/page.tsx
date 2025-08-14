"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf"; // ✅ use helper
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { Github } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loggingIn, setLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLogin(true);
      const res = await axiosWithCsrf.post("/auth/login/", {
        email: email.trim(),
        password,
      });

      toast.success("Logged in successfully!");
      console.log("Login successful:", res.data);
      window.location.href = "/login/loading"; // redirect on success
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors.join(" "));
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLogin(false);
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
        toast.success("Logged in successfully!");
        window.location.href = "/login/loading";
        // maybe trigger AuthProvider refetch or redirect here
      } catch (err) {
        console.error("❌ Google login failed:", err);
        toast.error("Google login failed!");
      }
    },
    onError: (err) => console.error("❌ Google login error:", err),
  });

  const handleGithubLogin = () => {
    const clientId = "Ov23li2EaARy6c1mz8NK"; // Replace with your real GitHub client ID
    const redirectUri = "http://localhost:3000/github-callback"; // Must match GitHub App setting
    // const redirectUri = "https://cms-nextapp-sandy.vercel.app/github-callback"; // Must match GitHub App setting

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;

    // ✅ Redirect the whole page (no popup)
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Welcome Back
        </h2>

        {/* Google Login */}
        <Button
          onClick={() => handleGoogleLogin()}
          className="w-full flex py-3 items-center justify-center gap-2 shadow border border-gray-100 px-6 bg-white text-gray-800 hover:bg-gray-100"
          variant="outline"
        >
          <FcGoogle size={20} /> Continue with Google
        </Button>

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-sm shadow hover:bg-gray-900"
        >
          <Github size={20} className="text-white" />
          <span className="font-medium">Continue with GitHub</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">or</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          login with email
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e:any) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              required
              onChange={(e:any) => setPassword(e.target.value)}
              className="w-full mt-1 pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="••••••••"
            />
            <button
              // type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            {loggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
