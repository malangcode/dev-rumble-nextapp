"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiSearch } from "react-icons/fi";

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);

  const groups = [
    {
      id: 1,
      name: "React Dev Team",
      description: "Building modern web apps with React & Next.js",
      members: 8,
      skills: ["React", "Next.js", "TailwindCSS"],
      progress: 75,
    },
    {
      id: 2,
      name: "AI Research Group",
      description: "Exploring AI and machine learning models",
      members: 12,
      skills: ["Python", "TensorFlow", "ML"],
      progress: 50,
    },
    {
      id: 3,
      name: "UI/UX Designers",
      description: "Crafting beautiful and intuitive user interfaces",
      members: 5,
      skills: ["Figma", "UI Design", "UX Research"],
      progress: 90,
    },
  ];

  const toggleJoin = (id: number) => {
    setJoinedGroups((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.skills.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      )
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
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-200">
            <FiUsers /> Groups & Teams
          </h1>
          <div className="flex items-center bg-white/70 dark:bg-zinc-800 px-4 py-2 rounded-xl shadow border border-white/20">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search groups..."
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            >
              {/* Group Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {group.name}
                </h2>
                <p className="text-sm text-gray-500">{group.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {group.members} members
                </p>
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {group.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full mt-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500"
                    style={{ width: `${group.progress}%` }}
                  />
                </div>
              </div>

              {/* Join/Leave Button */}
              <div>
                <button
                  onClick={() => toggleJoin(group.id)}
                  className={`px-6 py-2 rounded-xl text-sm font-medium shadow transition ${
                    joinedGroups.includes(group.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white hover:opacity-90"
                  }`}
                >
                  {joinedGroups.includes(group.id) ? "Leave Group" : "Join Group"}
                </button>
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <p className="text-center text-gray-500">
              No groups found matching your search.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
