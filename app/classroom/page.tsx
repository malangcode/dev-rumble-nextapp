"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Paperclip,
  Settings,
  User,
  Edit3,
  Trash2,
  BookOpen,
  Share,
  Download,
  RefreshCw,
  Play,
  Calculator,
  Atom,
  Code,
  Palette,
  Eye,
  EyeOff,
  RotateCcw,
  GraduationCap,
  LogOut,
  FilePlus2,
  ClipboardList,
  BookText,
} from "lucide-react";
import { motion } from "framer-motion";
import { sendToBackend } from "@/utils/aiUtils";
import "highlight.js/styles/github-dark.css";
import TypingEffect from "@/components/TypingEffect";
import Image from "next/image";
import { VoiceRecorder } from "@/utils/voiceRecorder";
import { useRouter } from "next/navigation";

// Types
interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}
interface ChatHistoryItem {
  id: number;
  title: string;
  date: string;
  active: boolean;
}
interface CanvasElement {
  id: number;
  type: "formula" | "explanation";
  x: number;
  y: number;
  content: string;
  opacity: number;
}

const DAILY_CREDITS = 100_000;

const TeachingChatUI: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Welcome! I'm your AI teaching assistant. Let's explore some concepts together!",
      timestamp: new Date(),
    },
  ]);
  const [chatHistory] = useState<ChatHistoryItem[]>([
    {
      id: 1,
      title: "Introduction to Calculus",
      date: "2 hours ago",
      active: false,
    },
    { id: 2, title: "Physics: Wave Motion", date: "1 day ago", active: true },
    { id: 3, title: "Chemistry Basics", date: "3 days ago", active: false },
    { id: 4, title: "Programming Logic", date: "1 week ago", active: false },
  ]);

  // Left sidebar tabs
  const [leftTab, setLeftTab] = useState<"courses" | "chats">("courses");

  // Credits (demo: you can wire these to real usage)
  const [inputCredits, setInputCredits] = useState(8000);
  const [outputCredits, setOutputCredits] = useState(4200);
  const totalCredits = Math.min(DAILY_CREDITS, inputCredits + outputCredits);
  const inputPct = Math.min(
    100,
    Math.round((inputCredits / DAILY_CREDITS) * 100)
  );
  const outputPct = Math.min(
    100,
    Math.round((outputCredits / DAILY_CREDITS) * 100)
  );
  const totalPct = Math.min(
    100,
    Math.round((totalCredits / DAILY_CREDITS) * 100)
  );

  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [animationPlaying, setAnimationPlaying] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recorder = new VoiceRecorder();
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  // layout toggles
  const defaultLayout = {
    showLeft: true,
    showCanvas: true,
    showRight: true,
    showCanvasInput: true,
    showChatInput: true,
  };
  const [layout, setLayout] = useState(defaultLayout);

  // widths (percent) with framer-motion drag handles
  const [leftW, setLeftW] = useState(22); // %
  const [rightW, setRightW] = useState(22); // %
  const minW = 16; // min width % for sidebars
  const maxW = 40;

  // Drag handlers
  const onDragLeft = (_: any, info: { delta: { x: number } }) => {
    const parent = document.getElementById("layout-root");
    if (!parent) return;

    const totalPx = parent.getBoundingClientRect().width;
    const deltaPct = (info.delta.x / totalPx) * 100;

    // Increase leftW when dragging right, decrease when dragging left
    setLeftW((prev) => {
      const next = Math.max(16, Math.min(40, prev + deltaPct));
      return next;
    });
  };

  const onDragRight = (_: any, info: { delta: { x: number } }) => {
    const parent = document.getElementById("layout-root");
    if (!parent) return;

    // Use bounding box each time to avoid stale widths
    const totalPx = parent.getBoundingClientRect().width;

    // Convert delta (px) -> % shrink of right pane
    const deltaPct = (info.delta.x / totalPx) * 100;

    // Decrease right width when dragging to the right, increase when left
    setRightW((prev) => {
      const next = Math.max(16, Math.min(40, prev - deltaPct));
      return next;
    });
  };

  // canvas animation
  useEffect(() => {
    if (animationPlaying) {
      const interval = setInterval(() => {
        setCanvasElements((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "formula",
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
            content: ["f(x) = x²", "E = mc²", "a² + b² = c²", "F = ma"][
              Math.floor(Math.random() * 4)
            ],
            opacity: 1,
          },
        ]);
      }, 2000);
      const stopTimeout = setTimeout(() => {
        setAnimationPlaying(false);
        clearInterval(interval);
      }, 10000);
      return () => {
        clearInterval(interval);
        clearTimeout(stopTimeout);
      };
    }
  }, [animationPlaying]);

  // lesson video placeholder + docs panel
  const [lessonPlaying, setLessonPlaying] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleReplay = () => {
    if (!lessonPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }
      setLessonPlaying(true);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setLessonPlaying(false);
    }
  };

  // autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add Context in chat input
  const [showContext, setShowContext] = useState(false);
  const [contextText, setContextText] = useState("");

  const sendMessage = async () => {
    if (!message.trim() && !contextText.trim()) return;

    const composed =
      contextText.trim().length > 0
        ? `Context:\n${contextText}\n\nUser:\n${message}`
        : message;

    const newMessage: Message = {
      id: Date.now(),
      type: "user",
      content: composed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setContextText("");

    const typingId = Date.now() + 1;
    const typingMessage: Message = {
      id: typingId,
      type: "ai",
      content: "typing...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const res = await sendToBackend(undefined, composed);
      const aiText = res.ai_text || "Sorry, I couldn't process that.";
      const audio = new Audio(`data:audio/mpeg;base64,${res.ai_audio}`);
      audio.play();
      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { ...m, content: aiText } : m))
      );

      // demo: update credits consumption (fake increments)
      setInputCredits((v) => Math.min(DAILY_CREDITS, v + 1500));
      setOutputCredits((v) => Math.min(DAILY_CREDITS, v + 1200));
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? { ...m, content: "Error: Unable to get AI response." }
            : m
        )
      );
    }

    setTimeout(() => {
      setCanvasElements((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "explanation",
          x: 250,
          y: 150,
          content: "Here's a visual explanation of your question.",
          opacity: 1,
        },
      ]);
    }, 800);
  };

  const clearCanvas = () => setCanvasElements([]);

  const handleMicClick = async () => {
    if (recorder.isRecording()) {
      const audioBlob = await recorder.stopRecording();
      setIsRecording(false);
      if (audioBlob) {
        const data = await sendToBackend(audioBlob);
        const aiMsg: Message = {
          id: Date.now(),
          type: "ai",
          content: data.text || "Processed your audio.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        const audio = new Audio(`data:audio/mpeg;base64,${data.ai_audio}`);
        audio.play();
      }
    } else {
      await recorder.startRecording();
      setIsRecording(true);
    }
  };

  return (
    <div className="w-full h-screen overflow-x-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-sky-50 text-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-white/50 bg-white/40 backdrop-blur-2xl shadow-[0_12px_60px_rgba(99,102,241,0.18)]">
        <div className="px-4 py-2 flex items-center justify-between w-full">
          <div className="flex items-center py-2 gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 ring-1 ring-white/60 shadow-[0_8px_30px_rgba(99,102,241,0.35)]" />
            <span className="font-semibold tracking-tight mr-4">
              Learn-Z Classroom
            </span>

            {/* View toggles */}
            <div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setLayout((s) => ({ ...s, showLeft: !s.showLeft }))
                  }
                  className="rounded-xl px-3 py-1.5 bg-white/50 ring-1 ring-white/60 hover:bg-white/70 transition inline-flex items-center gap-2"
                >
                  {layout.showLeft ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Sidebar
                </button>
                <button
                  onClick={() =>
                    setLayout((s) => ({ ...s, showCanvas: !s.showCanvas }))
                  }
                  className="rounded-xl px-3 py-1.5 bg-white/50 ring-1 ring-white/60 hover:bg-white/70 transition inline-flex items-center gap-2"
                >
                  {layout.showCanvas ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Canvas
                </button>
                <button
                  onClick={() =>
                    setLayout((s) => ({ ...s, showRight: !s.showRight }))
                  }
                  className="rounded-xl px-3 py-1.5 bg-white/50 ring-1 ring-white/60 hover:bg-white/70 transition inline-flex items-center gap-2"
                >
                  {layout.showRight ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Chat
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLayout(defaultLayout)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 bg-white/60 ring-1 ring-white/60 hover:bg-white/80 transition"
              title="Reset Layout"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-700 bg-white/60 ring-1 ring-white/60 hover:bg-white/80 transition"
              title="Exit Class"
            >
              <LogOut className="h-4 w-4" /> Exit
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        id="layout-root"
        className="flex flex-1 overflow-hidden w-full px-3 py-3 gap-3"
      >
        {/* Left Sidebar */}
        {layout.showLeft && (
          <div
            className="bg-white/50 backdrop-blur-2xl min-w-[20%] ring-1 ring-white/60 rounded-2xl shadow-[0_20px_80px_rgba(99,102,241,0.18)] flex flex-col"
            style={{ width: `${leftW}%` }}
          >
            {/* Header with credits */}
            <div className="p-4 border-b border-white/60">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Workspace</h2>
                <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 shadow-[0_10px_36px_rgba(99,102,241,0.45)]">
                  <GraduationCap className="h-4 w-4 inline mr-1" />
                  New Course
                </button>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">
                      Input Credits
                    </span>
                    <span className="text-slate-600">
                      {inputCredits.toLocaleString()} /{" "}
                      {DAILY_CREDITS.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/70 ring-1 ring-white/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
                      style={{ width: `${inputPct}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">
                      Output Credits
                    </span>
                    <span className="text-slate-600">
                      {outputCredits.toLocaleString()} /{" "}
                      {DAILY_CREDITS.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/70 ring-1 ring-white/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
                      style={{ width: `${outputPct}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">
                      Total Credits
                    </span>
                    <span className="text-slate-600">
                      {totalCredits.toLocaleString()} /{" "}
                      {DAILY_CREDITS.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/70 ring-1 ring-white/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
                      style={{ width: `${totalPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLeftTab("courses")}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ring-1 ring-white/60 ${
                    leftTab === "courses"
                      ? "text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 shadow-[0_10px_36px_rgba(99,102,241,0.45)]"
                      : "bg-white/70 text-slate-800 hover:bg-white"
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setLeftTab("chats")}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ring-1 ring-white/60 ${
                    leftTab === "chats"
                      ? "text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 shadow-[0_10px_36px_rgba(99,102,241,0.45)]"
                      : "bg-white/70 text-slate-800 hover:bg-white"
                  }`}
                >
                  Chat History
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-3">
              {leftTab === "courses" ? (
                <div className="space-y-2">
                  {[
                    "HTML & CSS",
                    "JavaScript Basics",
                    "React 101",
                    "Next.js App Router",
                    "Tailwind CSS",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/60 ring-1 ring-white/60 hover:bg-white/80 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{c}</div>
                        <BookText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Premium course
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-xl transition cursor-pointer ${
                        chat.active
                          ? "bg-indigo-200/60 ring-1 ring-indigo-300/60"
                          : "bg-white/60 ring-1 ring-white/60 hover:bg-white/80"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm truncate">
                          {chat.title}
                        </h3>
                        <div className="flex gap-1">
                          <Edit3 className="h-4 w-4 text-slate-600 hover:text-slate-900" />
                          <Trash2 className="h-4 w-4 text-rose-500/80 hover:text-rose-600" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{chat.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer icons */}
            <div className="p-4 border-t border-white/60">
              <div className="flex justify-between text-slate-700">
                <Settings className="h-5 w-5 hover:text-slate-900" />
                <User className="h-5 w-5 hover:text-slate-900" />
                <BookOpen className="h-5 w-5 hover:text-slate-900" />
              </div>
            </div>
          </div>
        )}

        {/* Left drag handle (stable, non-moving) */}
        {layout.showLeft && layout.showCanvas && (
          <motion.div
            className="relative select-none cursor-col-resize"
            style={{ width: 12 }} // hit area
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{ left: 0, right: 0 }} // pinned in place
            onDrag={onDragLeft}
          >
            {/* Visual 1px line centered */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-white/60 hover:bg-white transition" />
          </motion.div>
        )}

        {/* Canvas */}
        {layout.showCanvas && (
          <div className="flex-1 flex flex-col bg-white/50 backdrop-blur-2xl ring-1 ring-white/60 rounded-2xl shadow-[0_20px_120px_rgba(99,102,241,0.18)] overflow-hidden">
            {/* Canvas controls / placeholder header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/60">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 ring-1 ring-white/60" />
                <span className="font-semibold">Current Lesson</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReplay}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 shadow-[0_10px_36px_rgba(99,102,241,0.45)] inline-flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {lessonPlaying ? "Stop" : "Replay"}
                </button>
                <button
                  onClick={() => setShowDocs((s) => !s)}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-white/70 ring-1 ring-white/60 hover:bg-white inline-flex items-center gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  Docs
                </button>
                <button
                  onClick={clearCanvas}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-700 bg-white/70 ring-1 ring-white/60 hover:bg-white inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>

            {/* Video placeholder + docs panel */}
            <div className="flex-1 grid grid-rows-[auto,1fr]">
              <div className="relative">
                <div className="aspect-video w-full">
                  <div className="h-full w-full relative bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20">
                    {/* Faux shimmer */}
                    <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.30),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.25),transparent_45%)]" />
                    {/* Play */}
                    <button
                      type="button"
                      className="absolute inset-0 m-auto h-16 w-16 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:bg-white transition"
                      title="Preview"
                      onClick={handleReplay}
                    >
                      <Play className="h-7 w-7 text-indigo-600" />
                    </button>
                    <video
                      ref={videoRef}
                      src="/video/wave.mp4"
                      playsInline
                      muted={false}
                      style={{ display: lessonPlaying ? "block" : "none" }}
                      className="absolute inset-0 m-auto rounded-xl ring-1 ring-white/60 shadow-[0_16px_80px_rgba(99,102,241,0.3)] max-w-full max-h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden">
                {/* Docs panel */}
                {showDocs ? (
                  <div className="h-full overflow-y-auto p-4 border-t border-white/60 bg-white/60">
                    <h3 className="font-semibold mb-2">Lesson Docs</h3>
                    <p className="text-sm text-slate-700">
                      Here are the notes, outline, and references for this
                      video. You can render markdown or attach files here.
                    </p>
                    <ul className="list-disc pl-6 mt-3 text-sm text-slate-700 space-y-1">
                      <li>Key Concepts: State, Props, Components</li>
                      <li>Examples: Basic Counter, Todo App Skeleton</li>
                      <li>Further Reading: Official React Docs</li>
                    </ul>
                  </div>
                ) : (
                  <div ref={canvasRef} className="w-full h-full relative p-6">
                    {/* light grid + floating elements */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                      <div className="grid grid-cols-20 grid-rows-15 w-full h-full">
                        {Array.from({ length: 300 }).map((_, i) => (
                          <div key={i} className="border border-white/60" />
                        ))}
                      </div>
                    </div>

                    {canvasElements.map((el) => (
                      <div
                        key={el.id}
                        className={`absolute transition-all duration-1000 ${
                          el.type === "formula"
                            ? "text-xl md:text-2xl font-bold text-indigo-600"
                            : "text-lg md:text-xl text-violet-600"
                        }`}
                        style={{
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          opacity: el.opacity,
                        }}
                      >
                        {el.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

           
          </div>
        )}

        {/* Right drag handle (stable, non-moving) */}
        {layout.showCanvas && layout.showRight && (
          <motion.div
            // Bigger hitbox with a 1px visual line
            className="relative select-none cursor-col-resize"
            style={{ width: 12 }} // hit area
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{ left: 0, right: 0 }} // <- keep handle in place
            onDrag={onDragRight} // your width logic
            onDragEnd={(e, info) => {
              // optional: noop; since constraints pin x=0, no drift remains
            }}
          >
            {/* Visual 1px line centered in the 12px hit area */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-white/60 hover:bg-white transition" />
          </motion.div>
        )}

        {/* Right Chat */}
        {layout.showRight && (
          <div
            className="bg-white/50 min-w-[30%] backdrop-blur-2xl ring-1 ring-white/60 rounded-2xl shadow-[0_20px_80px_rgba(99,102,241,0.18)] flex flex-col"
            style={{ width: `${rightW}%` }}
          >
            <div className="p-4 border-b border-white/60 flex items-center justify-between">
              <Image
                height={110}
                width={110}
                src={"/icons/learnz.png"}
                alt="logo"
              />
              <div className="flex gap-2">
                <Share className="h-5 w-5 text-slate-700 hover:text-slate-900 cursor-pointer" />
                <Download className="h-5 w-5 text-slate-700 hover:text-slate-900 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-full p-3 rounded-xl ring-1 ${
                      msg.type === "user"
                        ? "text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 ring-white/40 shadow-[0_12px_48px_rgba(99,102,241,0.45)]"
                        : "bg-white/70 ring-white/60 text-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.type === "ai" && (
                        <Image
                          height={40}
                          width={40}
                          src={"/icons/learnz-logo.png"}
                          alt="logo"
                          className="rounded-md ring-1 ring-white/60"
                        />
                      )}
                      <div className="overflow-auto max-w-full">
                        {msg.content === "typing..." ? (
                          <span className="opacity-70">typing…</span>
                        ) : (
                          <>
                            <TypingEffect content={msg.content} />
                            <p className="text-xs opacity-60 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input (can be hidden via toggle) */}
            {layout.showChatInput && (
              <div className="p-3 border-t border-white/60">
                <div className="flex flex-col gap-2 bg-white/60 backdrop-blur-2xl rounded-2xl ring-1 ring-white/60 px-4 py-3 shadow-[0_14px_60px_rgba(99,102,241,0.18)]">
                  {/* Add Context toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowContext((s) => !s)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-700 bg-white/80 ring-1 ring-white/60 hover:bg-white inline-flex items-center gap-2"
                      title="Add context to next message"
                    >
                      <FilePlus2 className="h-4 w-4" />
                      Add Context
                    </button>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <Paperclip className="h-4 w-4" />
                      <span>Attach (disabled demo)</span>
                      <input type="file" className="hidden" disabled />
                    </label>
                  </div>

                  {showContext && (
                    <textarea
                      value={contextText}
                      onChange={(e) => setContextText(e.target.value)}
                      placeholder="Paste notes, instructions, or metadata for this chat…"
                      rows={3}
                      className="w-full bg-white/80 rounded-xl ring-1 ring-white/60 p-3 outline-none text-[9px]"
                    />
                  )}

                  <div className="flex items-end gap-3">
                    {/* 👇 textarea expands up to 3× height then scrolls */}
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // Enter sends
                          sendMessage();
                        }
                      }}
                      placeholder="Ask me to explain any concept..."
                      rows={1}
                      className="flex-1 resize-none bg-transparent text-slate-900 placeholder-slate-500 outline-none text-base leading-relaxed
                     min-h-[44px] max-h-[132px] overflow-y-auto"
                    />
                    <button
                      onClick={handleMicClick}
                      className="p-2 rounded-lg hover:scale-105 transition"
                      title="Hold to record"
                    >
                      <Mic
                        className={`h-6 w-6 ${
                          isRecording ? "text-rose-500" : "text-emerald-600"
                        }`}
                      />
                    </button>
                    <button
                      onClick={sendMessage}
                      className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 shadow-[0_12px_48px_rgba(99,102,241,0.45)] hover:shadow-[0_14px_56px_rgba(99,102,241,0.6)] transition"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile responsiveness helpers */}
      <style>{`
        @media (max-width: 1024px) {
          #layout-root { flex-direction: column; }
          #layout-root > div[style*="width"] { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default TeachingChatUI;
