// components/Notification.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from "react-icons/ai";

type NotificationProps = {
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export default function Notification({ type, message, onClose }: NotificationProps) {
  const [audio] = useState<HTMLAudioElement | null>(
    typeof Audio !== "undefined"
      ? new Audio(type === "success" ? "/cart-add-sound.wav" : "/notification-sound.wav")
      : null
  );

  useEffect(() => {
    audio?.play();
    const timer = setTimeout(onClose, 5000); // auto close in 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "-50%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "-50%" }}
        transition={{ duration: 0.3 }}
        className={`fixed z-50 top-35 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          max-w-85 w-full p-4 rounded-xl shadow-lg border text-white
          ${type === "success" ? "bg-green-500" : "bg-red-500"}
        `}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {type === "success" ? (
              <AiOutlineCheckCircle className="text-2xl mt-1 text-white" />
            ) : (
              <AiOutlineCloseCircle className="text-2xl mt-1 text-white" />
            )}
            <p className="text-sm">{message}</p>
          </div>
          <button onClick={onClose}>
            <AiOutlineClose className="text-xl text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
