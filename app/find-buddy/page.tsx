"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function FindBuddy() {
  // Dummy buddy data
  const initialBuddies = [
    {
      id: 1,
      name: "Aarav Sharma",
      faculty: "Computer Science",
      skills: ["React", "Node.js", "MongoDB"],
      avatar: "/images/profile2.jpg",
    },
    {
      id: 2,
      name: "Priya Khadka",
      faculty: "Information Systems",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      avatar: "/images/profile2.jpg",
    },
    {
      id: 3,
      name: "Rohan Thapa",
      faculty: "Network Engineering",
      skills: ["Cybersecurity", "Linux", "Cloud"],
      avatar: "/images/profile2.jpg",
    },
  ];

  const [buddies, setBuddies] = useState(initialBuddies);
  const [search, setSearch] = useState("");
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const filteredBuddies = buddies.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.faculty.toLowerCase().includes(search.toLowerCase()) ||
      b.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleRequest = (id: number) => {
    setSentRequests((prev) =>
      prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-tr from-indigo-50 via-sky-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Search Bar */}
        <div className="flex mb-8">
          <input
            type="text"
            placeholder="Search for friends by name, faculty, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-l-xl border border-gray-300 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
          <button className="px-5 bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 text-white rounded-r-xl flex items-center justify-center hover:opacity-90 transition">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Buddy List */}
        <div className="space-y-6">
          {filteredBuddies.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-5 transition hover:shadow-xl"
            >
              {/* Avatar */}
              <Image
                src={b.avatar}
                alt={b.name}
                width={70}
                height={70}
                className="rounded-full border-4 border-white shadow-md"
              />

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {b.name}
                </h2>
                <p className="text-sm text-gray-500">{b.faculty}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {b.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => toggleRequest(b.id)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                  sentRequests.includes(b.id)
                    ? "bg-white/50 dark:bg-zinc-900/50 border border-fuchsia-500 text-fuchsia-500 hover:bg-white/70 dark:hover:bg-zinc-900/70"
                    : "bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 text-white hover:opacity-90"
                }`}
              >
                {sentRequests.includes(b.id) ? "Unsend" : "Send Request"}
              </button>
            </div>
          ))}

          {filteredBuddies.length === 0 && (
            <p className="text-center text-gray-500">No buddies found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
