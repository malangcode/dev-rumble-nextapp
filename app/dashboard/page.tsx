
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Users,
  BookOpen,
  MapPin,
  Sparkles,
  NotebookPen,
  GraduationCap,
  FolderOpen,
  Wifi,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function StudentDashboard() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const router = useRouter();

  const { user } = useAuth();
  // Simple keyboard shortcut for command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const today = useMemo(() => new Date(), []);
  const day = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // --- Mock Data ---
  const schedule = [
    {
      time: "08:15",
      title: "Data Structures (CSE210)",
      where: "Room B-204",
      icon: <BookOpen className="w-4 h-4" />,
      action: "Join Live",
    },
    {
      time: "10:00",
      title: "Accounting Principles (ACC130)",
      where: "Room A-110",
      icon: <NotebookPen className="w-4 h-4" />,
      action: "Open Notes",
    },
    {
      time: "13:00",
      title: "Web Tech Lab (CSE331)",
      where: "Lab L-2",
      icon: <Wifi className="w-4 h-4" />,
      action: "View Tasks",
    },
  ];

  const assignments = [
    {
      title: "DSA: Implement Queue ADT",
      course: "CSE210",
      due: "Aug 18, 11:59 PM",
      progress: 60,
      priority: "High",
    },
    {
      title: "Acctg: Ledger Posting #2",
      course: "ACC130",
      due: "Aug 19, 6:00 PM",
      progress: 35,
      priority: "Medium",
    },
    {
      title: "WT: Responsive Layout",
      course: "CSE331",
      due: "Aug 20, 5:00 PM",
      progress: 10,
      priority: "High",
    },
  ];

  const events = [
    {
      name: "AI Club Meetup",
      when: "Today · 5:30 PM",
      where: "Auditorium",
      tag: "Clubs",
    },
    { name: "Hackathon Briefing", when: "Aug 17 · 4:00 PM", where: "Hall C", tag: "Tech" },
    { name: "Career Talk: FinTech", when: "Aug 19 · 2:00 PM", where: "A-301", tag: "Careers" },
  ];

  const buddies = [
    { name: "Aarav S.", course: "CSE210", overlap: "Mon/Wed 2–4 PM" },
    { name: "Maya K.", course: "ACC130", overlap: "Tue/Thu 10–12 AM" },
    { name: "Ravi P.", course: "CSE331", overlap: "Fri 1–3 PM" },
  ];

  const kpis = [
    { label: "GPA", value: "3.72", sub: "+0.08 this term" },
    { label: "Credits", value: "48/72", sub: "Year 3" },
    { label: "Attendance", value: "92%", sub: "This month" },
    { label: "Alerts", value: "2", sub: "Action needed" },
  ];

  // Motion helpers
  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="pt-4 pb-16 min-h-screen  dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              variants={card}
              initial="hidden"
              animate="show"
              className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
            >
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{day}</p>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                      Welcome back, <span className="bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">{user?.username}</span> 👋
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-xl">
                      Here’s your day at a glance. Stay on track with classes, deadlines, and campus events.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <Link href={'/classroom'}><ActionChip icon={<MessageCircle className="w-4 h-4" />} label="Ask AI" /></Link>
                    <ActionChip icon={<FolderOpen className="w-4 h-4" />} label="My Files" />
                    <Link href={'/find-buddy'}><ActionChip icon={<Users className="w-4 h-4" />} label="Find Buddy" /></Link>
                  </div>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.map((k) => (
                    <KPI key={k.label} label={k.label} value={k.value} sub={k.sub} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={card}
              initial="hidden"
              animate="show"
              className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 backdrop-blur-xl shadow-xl p-6"
            >
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Today’s Schedule</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {schedule.map((s, i) => (
                  <li key={i} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3 hover:bg-white/70 dark:hover:bg-zinc-900/70 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono tabular-nums w-14">{s.time}</span>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2">{s.icon}{s.title}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{s.where}</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-1 text-xs font-medium rounded-xl px-3 py-1.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">
                      {s.action}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Main Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid gap-6 lg:grid-cols-3">
          {/* Assignments */}
          <motion.section variants={card} initial="hidden" animate="show" className="lg:col-span-2 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Assignments Due</h3>
              <button className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline">View all</button>
            </div>
            <ul className="mt-4 space-y-4">
              {assignments.map((a, i) => (
                <li key={i} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1"><BookOpen className="w-3 h-3" />{a.course}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />Due {a.due}</span>
                        <PriorityBadge level={a.priority} />
                      </p>
                    </div>
                    <button className="text-xs rounded-xl px-3 py-1.5 bg-zinc-900/90 text-white dark:bg-white/10 dark:text-white hover:bg-zinc-900/80 transition">Open</button>
                  </div>
                  <Progress value={a.progress} />
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Right rail */}
          <div className="space-y-6">
            {/* Events */}
            <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-5 h-5" /> Campus Events</h3>
              <ul className="mt-3 space-y-3">
                {events.map((e, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3">
                    <div>
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{e.when}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{e.where}</span>
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-tr from-amber-500/20 to-fuchsia-500/20 border border-white/20 dark:border-white/10">{e.tag}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-3 w-full text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">Browse all events</button>
            </motion.section>

            {/* Study Buddies */}
            <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Study Buddies</h3>
              <ul className="mt-3 space-y-3">
                {buddies.map((b, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{b.course} · {b.overlap}</p>
                    </div>
                    <button className="text-xs rounded-xl px-3 py-1.5 bg-zinc-900/90 text-white dark:bg-white/10 hover:bg-zinc-900/80">Invite</button>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Quick Help */}
            <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Help & Support</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Ask anything about courses, deadlines, or bookings. Our AI assistant and student mentors are here for you.</p>
              <button onClick={()=>{router.push('/classroom')}} className="mt-3 w-full text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-500 text-white shadow hover:opacity-90">Ask AI now</button>
            </motion.section>
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-3"
            >
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  autoFocus
                  placeholder="Type a command (e.g., ‘create group’, ‘book room’, ‘upload file’)"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="mt-2 divide-y divide-white/20 dark:divide-white/10">
                <PaletteItem icon={<Users className="w-4 h-4" />} title="Create a study group" subtitle="Invite classmates from CSE210" />
                <PaletteItem icon={<Calendar className="w-4 h-4" />} title="Book a room" subtitle="Find available labs and rooms" />
                <PaletteItem icon={<FolderOpen className="w-4 h-4" />} title="Upload a file" subtitle="Add notes to Web Tech Lab" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Small Components ----
function ActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm text-sm">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 blur-2xl" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{sub}</p>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-3">
      <div className="h-2 w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{value}% complete</div>
    </div>
  );
}

function PriorityBadge({ level }: { level: "High" | "Medium" | "Low" | string }) {
  const color =
    level === "High"
      ? "from-rose-500/20 to-amber-500/20"
      : level === "Medium"
      ? "from-amber-500/20 to-indigo-500/20"
      : "from-emerald-500/20 to-sky-500/20";
  return (
    <span className={`inline-flex items-center text-[10px] px-2 py-1 rounded-full bg-gradient-to-tr ${color} border border-white/20 dark:border-white/10`}>
      {level} priority
    </span>
  );
}

function PaletteItem({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow">
        {icon}
      </span>
      <span className="text-left">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</span>
      </span>
    </button>
  );
}

