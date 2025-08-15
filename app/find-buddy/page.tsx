"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

export default function FindBuddy() {
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

  const [buddies] = useState(initialBuddies);
  const [search, setSearch] = useState("");
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const toggleRequest = (id: number) => {
    setSentRequests((prev) =>
      prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id]
    );
  };

  const filteredBuddies = buddies.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.faculty.toLowerCase().includes(search.toLowerCase()) ||
      b.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-tr from-indigo-50 via-sky-50 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Find a Buddy
          </h1>
          <div className="flex items-center bg-white/70 dark:bg-zinc-800 px-4 py-2 rounded-xl shadow border border-white/20">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search buddies..."
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Buddy List */}
        <div className="space-y-6">
          {filteredBuddies.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            >
              {/* Info */}
              <div className="flex items-center gap-5 flex-1">
                <Image
                  src={b.avatar}
                  alt={b.name}
                  width={70}
                  height={70}
                  className="rounded-full border-4 border-white shadow-md"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {b.name}
                  </h2>
                  <p className="text-sm text-gray-500">{b.faculty}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {b.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button */}
              <div>
                <button
                  onClick={() => toggleRequest(b.id)}
                  className={`px-6 py-2 rounded-xl text-sm font-medium shadow transition ${
                    sentRequests.includes(b.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white hover:opacity-90"
                  }`}
                >
                  {sentRequests.includes(b.id) ? "Unsend" : "Send Request"}
                </button>
              </div>
            </div>
          ))}

          {filteredBuddies.length === 0 && (
            <p className="text-center text-gray-500">
              No buddies found matching your search.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
