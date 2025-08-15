"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-tr from-indigo-50 via-sky-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-10"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-8 border-b border-white/20 dark:border-white/10">
          <Image
            src="/images/profile2.jpg"
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              John Doe
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Computer Science – Senior
            </p>
            <p className="text-sm text-gray-500">Sydney, Australia</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-white/20 hover:bg-white/70 dark:hover:bg-zinc-900/70 shadow-sm transition">
              Message
            </button>
            <button className="px-6 py-2 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 text-white shadow hover:opacity-90 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "GPA", value: "3.9" },
            { label: "Credits", value: "98" },
            { label: "Attendance", value: "94%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/70 dark:bg-zinc-900/70 rounded-2xl px-6 py-4 shadow-md border border-white/20"
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-10 flex justify-center gap-8 border-b border-white/20 dark:border-white/10">
          {["overview", "courses", "groups", "timeline"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-base capitalize transition-all ${
                activeTab === tab
                  ? "border-b-2 border-fuchsia-500 text-fuchsia-500"
                  : "text-gray-500 hover:text-fuchsia-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
                Contact
              </h3>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineMail /> john.doe@example.com
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlinePhone /> +61 987654321
              </p>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-3">
                Availability
              </h3>
              <p className="text-sm text-gray-500">Unavailable</p>
              <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full mb-4">
                <div className="w-1/4 h-full bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500">Wednesday</p>
              <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full">
                <div className="w-3/4 h-full bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 rounded-full"></div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-3">
                Quick Links
              </h3>
              <a
                href="#"
                className="block text-sm text-fuchsia-500 hover:underline"
              >
                Academic Resources
              </a>
              <a
                href="#"
                className="block text-sm text-fuchsia-500 hover:underline"
              >
                Student Portal
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
