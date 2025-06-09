"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HomePageSkeleton from "@/components/HomePageSkeleton";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  // const [loading, setLoading] = useState(true);
  const { user, logout, loading } = useAuth();

  // useEffect(() => {
  //   // Simulate a loading delay (e.g., fetching data)
  //   const timer = setTimeout(() => setLoading(false), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  if (loading) return <HomePageSkeleton />;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">
          Welcome to SmartCanteen 🍽️
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          A modern solution for college canteens to manage orders, inventory,
          and payments effortlessly.
        </p>

        <div className="w-full flex justify-center mb-10">
          <Image
            src="/images/canteen-illustration.svg"
            alt="Canteen Illustration"
            width={500}
            height={300}
            className="rounded-xl"
          />
        </div>

        <div className="space-x-4 mb-8">
          {user ? (
            <>
              <Link href="/menu">
                <Button size="lg">View Menu</Button>
              </Link>

              {user.is_superuser && user.is_staff && (
                <Link href="/admin">
                  <Button variant="outline" size="lg">
                    Admin Panel
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/menu">
                <Button size="lg">View Menu</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full max-w-5xl mt-8 px-4">
        {[
          {
            title: "Digital Menu",
            desc: "Browse, customize, and place food orders from your device.",
            icon: "🍕",
          },
          {
            title: "Smart Inventory",
            desc: "Real-time stock management and automated alerts.",
            icon: "📦",
          },
          {
            title: "Instant Payments",
            desc: "Pay securely with UPI, cards, or wallet.",
            icon: "💳",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-sm text-gray-400">
        Built with ❤️ by Rahish Sheikh | Powered by Next.js + Tailwind CSS
      </div>
    </section>
  );
}
