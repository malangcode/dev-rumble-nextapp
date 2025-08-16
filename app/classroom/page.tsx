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
  Bot,
  Eye,
  EyeOff,
  RotateCcw,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { sendToBackend, speakText } from "@/utils/aiUtils";
import "highlight.js/styles/github-dark.css"; // or any theme
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

const TeachingChatUI: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [aiText, setAiText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Welcome! I'm your AI teaching assistant. Let's explore some concepts together!",
      timestamp: new Date(),
    },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
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
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [animationPlaying, setAnimationPlaying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [transcript, setTranscript] = useState("");
  const recorder = new VoiceRecorder();
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  // for top bar
  const defaultLayout = {
    showHistory: true,
    showCanvas: true,
    showChat: true,
    showCanvasInput: true,
    showChatInput: true,
  };

  const [layout, setLayout] = useState(defaultLayout);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("teachingChatUILayout");
    if (saved) {
      setLayout(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("teachingChatUILayout", JSON.stringify(layout));
  }, [layout]);

  const toggleSection = (section: keyof typeof defaultLayout) => {
    setLayout((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
  };

  // Canvas animation for teaching
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

  const playWaveVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false; // play with sound
      videoRef.current.currentTime = 0; // restart video
      videoRef.current.play().catch(console.error);
    }
  };

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // // If message contains 'wave', play video
    // if (message.toLowerCase().includes("wave")) {
    //   playWaveVideo();
    // }

    const newMessage: Message = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // AI typing placeholder
    const typingId = Date.now() + 1;
    const typingMessage: Message = {
      id: typingId,
      type: "ai",
      content: "typing...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    // Get backend response
    try {
      const res = await sendToBackend(undefined, message);
      const aiText = res.ai_text || "Sorry, I couldn't process that.";
      // speakText(aiText);
      // Play AI voice
      const audio = new Audio(`data:audio/mpeg;base64,${res.ai_audio}`);
      console.log("AI audio response:", res.ai_audio);
      audio.play();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId ? { ...msg, content: aiText } : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? { ...msg, content: "Error: Unable to get AI response." }
            : msg
        )
      );
    }

    // setMessages((prev) => [...prev, newMessage]);
    // setMessage("");

    // Simulate AI response
    setTimeout(() => {
      //   const aiResponse: Message = {
      //     id: Date.now() + 1,
      //     type: "ai",
      //     content: aiText,
      //     timestamp: new Date(),
      //   };
      //   setMessages((prev) => [...prev, aiResponse]);

      // Add teaching elements to canvas
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
    }, 1000);
  };

  const [lessonPlaying, setLessonPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleStartLesson = () => {
    if (!lessonPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play().catch((err) => {
          console.warn("Autoplay with sound blocked:", err);
        });
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

  const startTeachingAnimation = () => {
    setAnimationPlaying(true);
    setCanvasElements([]);
  };

  const clearCanvas = () => {
    setCanvasElements([]);
  };

  const handleMicClick = async () => {
    if (recorder.isRecording()) {
      const audioBlob = await recorder.stopRecording();
      setIsRecording(false);
      if (audioBlob) {
        const data = await sendToBackend(audioBlob); // only send audio
        setTranscript(data.text || "");
        console.log(data.text || "");
        const audio = new Audio(`data:audio/mpeg;base64,${data.ai_audio}`);
        audio.play();
      }
    } else {
      await recorder.startRecording();
      setIsRecording(true);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col overflow-hidden">
      {/* VS Code Style Top Bar */}
      <div className="bg-gray-800 text-white flex items-center px-4 py-2 gap-4 border-b border-gray-700 justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSection("showHistory")}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded"
          >
            {layout.showHistory ? <Eye size={16} /> : <EyeOff size={16} />}
            History
          </button>
          <button
            onClick={() => toggleSection("showCanvas")}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded"
          >
            {layout.showCanvas ? <Eye size={16} /> : <EyeOff size={16} />}
            Canvas
          </button>
          {layout.showCanvas && (
            <button
              onClick={() => toggleSection("showCanvasInput")}
              className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded"
            >
              {layout.showCanvasInput && layout.showCanvas ? (
                <Eye size={16} />
              ) : (
                <EyeOff size={16} />
              )}
              Canvas Input
            </button>
          )}
          <button
            onClick={() => toggleSection("showChat")}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded"
          >
            {layout.showChat ? <Eye size={16} /> : <EyeOff size={16} />}
            Chat
          </button>
          <button
            onClick={() => toggleSection("showChatInput")}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded"
          >
            {layout.showChatInput ? <Eye size={16} /> : <EyeOff size={16} />}
            Chat Input
          </button>
        </div>

        <div className="flex gap-3 flex-end items-center">
          <button
            onClick={resetLayout}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded ml-auto text-red-400"
          >
            <RotateCcw size={16} /> Reset Layout
          </button>
          <button
            onClick={() => {
              router.push("/dashboard"); // Redirect to home or logout
            }}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded ml-auto text-red-400"
          >
            <LogOut size={16} /> Exit Class
          </button>
        </div>
      </div>

      {/* Left Sidebar - Chat History */}
      <div className="flex flex-1 overflow-hidden">
        {layout.showHistory && (
          <div className="w-1/5 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-2">
                Course History
              </h2>
              <button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 flex items-center gap-2">
                <GraduationCap size={28} />
                New Course
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700/50 ${
                    chat.active
                      ? "bg-purple-600/30 border-l-4 border-purple-500"
                      : "bg-gray-700/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-medium text-sm truncate">
                      {chat.title}
                    </h3>
                    <div className="flex gap-1">
                      <Edit3 className="text-gray-400 text-xs cursor-pointer hover:text-white" />
                      <Trash2 className="text-gray-400 text-xs cursor-pointer hover:text-red-400" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">{chat.date}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700/50">
              <div className="flex justify-between text-gray-400">
                <Settings className="cursor-pointer hover:text-white transition-colors" />
                <User className="cursor-pointer hover:text-white transition-colors" />
                <BookOpen className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {layout.showCanvas && (
          <div className="flex-1 flex flex-col">
            {/* Canvas Area - Digital Teaching Board */}
            <div className="flex-1 relative bg-gradient-to-b from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 m-2 rounded-xl overflow-hidden">
              {/* Canvas Controls */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {/* <button
                  onClick={startTeachingAnimation}
                  className="bg-green-600/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="text-sm" />
                  Teach
                </button> */}
                <button
                  className="bg-green-600/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                  onClick={handleStartLesson}
                >
                  ▶ {lessonPlaying ? "Stop Lesson" : "Start Lesson"}
                </button>
                <button
                  onClick={clearCanvas}
                  className="bg-red-600/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2"
                >
                  <RefreshCw className="text-sm" />
                  Clear
                </button>
              </div>

              {/* Subject Icons */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Calculator className="text-blue-400 text-2xl cursor-pointer hover:text-blue-300 transition-colors" />
                <Atom className="text-green-400 text-2xl cursor-pointer hover:text-green-300 transition-colors" />
                <Code className="text-purple-400 text-2xl cursor-pointer hover:text-purple-300 transition-colors" />
                <Palette className="text-pink-400 text-2xl cursor-pointer hover:text-pink-300 transition-colors" />
              </div>

              {/* Canvas Content */}
              <div className="w-full h-full relative p-8">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-20 grid-rows-15 w-full h-full">
                    {Array.from({ length: 300 }).map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>
                </div>

                {/* Animated Teaching Elements */}
                {canvasElements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute transition-all duration-1000 transform ${
                      element.type === "formula"
                        ? "text-2xl font-bold text-cyan-400 animate-pulse"
                        : "text-xl text-yellow-400"
                    }`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      opacity: element.opacity,
                    }}
                  >
                    {element.content}
                  </div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center m-8 mt-15">
                  <video
                    ref={videoRef}
                    src="/video/wave.mp4"
                    playsInline
                    muted={false}
                    style={{ display: lessonPlaying ? "block" : "none" }}
                    className="rounded-lg shadow-lg max-w-full max-h-full"
                  />
                </div>
              </div>
            </div>

            {/* Input Area */}
            {layout.showCanvasInput && (
              <div className="p-4">
                <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 px-4 py-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask me to explain any concept..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
                  />
                  <div className="flex items-center gap-3 ml-4">
                    <Paperclip className="text-gray-400 text-xl cursor-pointer hover:text-white transition-colors" />

                    <button
                      onClick={handleMicClick}
                      className=" text-white p-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 hover:scale-105"
                    >
                      {isRecording ? (
                        <Mic size={24} className="text-red-500" />
                      ) : (
                        <Mic size={24} className="text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 hover:scale-105"
                    >
                      <Send className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Sidebar - Current Chat */}
        {layout.showChat && (
          <div
            className={`${
              layout.showCanvas ? "w-1/5" : "w-full px-6 "
            } bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 flex flex-col`}
          >
            <div className="p-4 py-1 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                {/* <h2 className="text-xl font-bold text-white">Teaching Chat</h2> */}
                <Image
                  height={110}
                  width={110}
                  src={"/icons/learnz.png"}
                  alt="logo"
                ></Image>
                <div className="flex gap-2">
                  <Share className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                  <Download className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-4`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-full p-3 rounded-xl ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                        : "bg-gray-700/50 text-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.type === "ai" && (
                        // <Bot className="text-cyan-400 text-lg mt-1 flex-shrink-0" />
                        <Image
                          height={40}
                          width={40}
                          src={"/icons/learnz-logo.png"}
                          alt="logo"
                        ></Image>
                      )}
                      <div className={`overflow-auto max-w-full`}>
                        {msg.content === "typing..." ? (
                          <span className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </span>
                        ) : (
                          <>
                            <TypingEffect content={msg.content} />
                            <p className="text-xs opacity-70 mt-1">
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
            {/* Input Area */}
            {layout.showChatInput && (
              <div className="p-4">
                <div className="w-full flex items-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 px-4 py-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask me to explain any concept..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 hover:scale-105"
                    >
                      <Send className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingChatUI;
