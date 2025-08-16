"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import AnimatedBg from "@/components/AnimatedBg";
import MouseEffect from "@/components/MouseEffect";

export default function FindBuddy() {
  const initialBuddies = [
    {
      id: "1",
      name: "Aarav Sharma",
      faculty: "Computer Science – Senior",
      location: "Sydney, Australia",
      email: "aarav@example.com",
      phone: "+977 9876543210",
      avatar: "/images/profile2.jpg",
      gpa: "3.8",
      credits: "92",
      attendance: "96%",
      skills: ["React", "Node.js", "MongoDB", "UI/UX Design"],
      courses: [
        { id: 1, name: "React Development", credits: 3, grade: "A" },
        { id: 2, name: "AI Fundamentals", credits: 4, grade: "B+" },
      ],
    },
    {
      id: "2",
      name: "Priya Khadka",
      faculty: "Information Systems – Junior",
      location: "Kathmandu, Nepal",
      email: "priya@example.com",
      phone: "+977 9812345678",
      avatar: "/images/profile2.jpg",
      gpa: "3.9",
      credits: "80",
      attendance: "94%",
      skills: ["Python", "Data Analysis", "Machine Learning", "SQL"],
      courses: [
        { id: 1, name: "Database Management", credits: 3, grade: "A" },
        { id: 2, name: "Python for Data Science", credits: 4, grade: "A-" },
      ],
    },
    {
      id: "3",
      name: "Rohan Thapa",
      faculty: "Network Engineering – Senior",
      location: "Melbourne, Australia",
      email: "rohan@example.com",
      phone: "+61 456 789 012",
      avatar: "/images/profile2.jpg",
      gpa: "3.7",
      credits: "88",
      attendance: "91%",
      skills: ["Cybersecurity", "Linux", "Cloud Computing", "Networking"],
      courses: [
        { id: 1, name: "Advanced Networking", credits: 3, grade: "A-" },
        { id: 2, name: "Cloud Infrastructure", credits: 4, grade: "B+" },
      ],
    },
    {
      id: "4",
      name: "Sita Adhikari",
      faculty: "Software Engineering – Sophomore",
      location: "Pokhara, Nepal",
      email: "sita@example.com",
      phone: "+977 9801234567",
      avatar: "/images/profile2.jpg",
      gpa: "3.6",
      credits: "65",
      attendance: "89%",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Git"],
      courses: [
        { id: 1, name: "Java Programming", credits: 3, grade: "A" },
        { id: 2, name: "Database Systems", credits: 4, grade: "B+" },
      ],
    },
    {
      id: "5",
      name: "Kiran Lama",
      faculty: "Artificial Intelligence – Senior",
      location: "Brisbane, Australia",
      email: "kiran@example.com",
      phone: "+61 400 123 456",
      avatar: "/images/profile2.jpg",
      gpa: "4.0",
      credits: "100",
      attendance: "98%",
      skills: ["Deep Learning", "Computer Vision", "Python", "TensorFlow"],
      courses: [
        { id: 1, name: "Deep Learning", credits: 3, grade: "A+" },
        { id: 2, name: "Computer Vision", credits: 4, grade: "A" },
      ],
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
    <div className="min-h-screen px-6 py-10  flex justify-center items-start">
      <MouseEffect />
      <AnimatedBg />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl rounded-3xl dark:bg-zinc-900/60 bg-white/50 backdrop-blur-xl shadow-2xl p-8"
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
          {filteredBuddies.map((b:any) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl dark:bg-zinc-900/70 border border-white/20 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            >
              {/* Info */}
              <div className="flex items-center gap-5 flex-1">
                <Link href={`/profile/${b.id}`}>
                  <Image
                    src={b.avatar}
                    alt={b.name}
                    width={70}
                    height={70}
                    className="rounded-full border-4 border-white shadow-md"
                  />
                </Link>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {b.name}
                  </h2>
                  <p className="text-sm text-gray-500">{b.faculty}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {b.skills.map((skill:any, idx:any) => (
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
