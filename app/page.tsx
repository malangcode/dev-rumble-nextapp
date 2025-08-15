"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="dark">
      <div className="pt-4 pb-16 min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <motion.div
            variants={card}
            initial="hidden"
            animate="show"
            className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-8 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              Welcome to Learn-z 🚀
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Learn-z is a next-generation learning platform created for Generation Z students.  
              We make education fun, interactive, and personalized — helping young learners  
              grow skills for the future.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="px-6 py-3 rounded-xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 hover:bg-white/60 dark:hover:bg-zinc-900/60"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Fun & Engaging Lessons",
                desc: "Interactive courses designed for Gen-Z attention spans and learning styles.",
                icon: "🎯",
              },
              {
                title: "Personalized Learning",
                desc: "AI-powered recommendations to guide each student’s learning journey.",
                icon: "🤖",
              },
              {
                title: "Future-Ready Skills",
                desc: "From coding to critical thinking, we help you prepare for tomorrow.",
                icon: "🚀",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={card}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 shadow-lg hover:shadow-xl transition"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
