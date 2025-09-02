"use client";

import React, { useMemo, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string; // full YouTube URL
};

const ALL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Intro to HTML & CSS",
    description:
      "Start your web journey with the building blocks of the web—HTML tags, CSS selectors, and layouts.",
    category: "Web Dev",
    url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
  },
  {
    id: "v2",
    title: "JavaScript Basics Crash Course",
    description:
      "Variables, functions, loops, and DOM intro to kickstart your JS fundamentals.",
    category: "Web Dev",
    url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
  },
  {
    id: "v3",
    title: "React in 100 Minutes",
    description:
      "Modern React concepts: hooks, components, props/state, and mental models.",
    category: "Frontend",
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
  },
  {
    id: "v4",
    title: "Next.js App Router Guide",
    description:
      "Routing, layouts, server vs client components—see how Next.js 13+ levels up DX.",
    category: "Frontend",
    url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
  },
  {
    id: "v5",
    title: "Tailwind CSS Mastery",
    description:
      "From utility-first basics to responsive design and glassmorphism with Tailwind.",
    category: "Design",
    url: "https://www.youtube.com/watch?v=mr15Xzb1Ook",
  },
];

function extractYouTubeId(link: string) {
  // Handles youtu.be/VIDEOID and youtube.com/watch?v=VIDEOID and more
  try {
    const url = new URL(link);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      // Fallback for /embed/VIDEOID or /shorts/VIDEOID
      const parts = url.pathname.split("/");
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    // If it's not a valid URL, assume it's already an ID
    return link;
  }
  return link;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [myClassroom, setMyClassroom] = useState<string[]>([]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ALL_VIDEOS.map((v) => v.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_VIDEOS.filter((v) => {
      const matchesCategory = category === "All" || v.category === category;
      const matchesQuery =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleAddToClassroom(id: string) {
    setMyClassroom((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen w-full text-slate-900 bg-white/40 backdrop-blur-2xl">
      {/* Top Bar */}
      {/* <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/30 border-b border-white/40 shadow-lg">
       
      </header> */}

      <div className="mx-auto  max-w-7xl px-4 pt-10 ">
         <div className="rounded-3xl flex px-8 py-4 md:py-6 bg-white/40 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_20px_120px_rgba(168,85,247,0.35)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40" />
            <h1 className="text-xl font-semibold tracking-tight">
              Freemium Classroom
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 rounded-2xl px-3 py-2 backdrop-blur-xl bg-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)] ring-1 ring-white/40 border border-black/10">
              <svg
                aria-hidden
                className="h-5 w-5 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.1-4.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, topics…"
                className="bg-transparent outline-none placeholder:text-slate-600/70 w-72"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl px-3 py-2 backdrop-blur-xl bg-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-black/10 ring-1 ring-white/40"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="hidden sm:block rounded-xl px-3 py-2 backdrop-blur-xl bg-white/60 border border-black/10 ring-1 ring-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
              <span className="text-sm font-medium">
                My Classroom: {myClassroom.length}
              </span>   
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-3xl p-8 md:p-12 bg-white/40 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_20px_120px_rgba(168,85,247,0.35)]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Learn with curated, ad-free YouTube courses.
            </h2>
            <p className="mt-3 text-slate-700 md:max-w-3xl">
              Explore freemium lessons with a clean, distraction-free player,
              searchable catalog, and a one-click <em>Add to Classroom</em> to
              keep everything organized.
            </p>
            {/* Mobile Search */}
            <div className="mt-6 flex gap-3 md:hidden">
              <div className="flex items-center gap-2 rounded-2xl px-3 py-2 backdrop-blur-xl bg-white/60 ring-1 ring-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)] w-full">
                <svg
                  aria-hidden
                  className="h-5 w-5 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.1-4.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, topics…"
                  className="bg-transparent outline-none placeholder:text-slate-600/70 w-full"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-2xl px-3 py-2 backdrop-blur-xl bg-white/60 ring-1 ring-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_12px_80px_rgba(0,0,0,0.08)]">
            <p className="text-slate-700">
              No courses matched your search. Try another keyword or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
            {filtered.map((v) => {
              const vid = extractYouTubeId(v.url);
              return (
                <article
                  key={v.id}
                  className="group rounded-3xl overflow-hidden ring-1 ring-white/50 backdrop-blur-2xl bg-white/50 shadow-[0_24px_120px_rgba(236,72,153,0.25)] hover:shadow-[0_28px_140px_rgba(168,85,247,0.35)] transition-shadow"
                >
                  <div className="relative">
                    <div className="aspect-video w-full overflow-hidden">
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${vid}`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>

                    {/* soft gradient sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-white/10" />
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-200/60 ring-1 ring-indigo-300/60">
                      {v.category}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold leading-snug">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm md:text-[15px] text-slate-700">
                      {v.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={() => handleAddToClassroom(v.id)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 shadow-[0_12px_48px_rgba(168,85,247,0.55)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.65)] active:scale-[0.98] transition cursor-pointer"
                      >
                        {myClassroom.includes(v.id)
                          ? "Added ✓"
                          : "Add to Classroom"}
                      </button>

                      <a
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-indigo-500 hover:underline"
                        title="Open on YouTube" 
                      >
                        Open on YouTube →
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}
