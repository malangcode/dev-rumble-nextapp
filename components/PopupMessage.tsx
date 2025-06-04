"use client";

import { useEffect, useState } from "react";

type PopupMessageProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

const soundUrl = "/cart-add-sound.wav";

const PopupMessage = ({
  message,
  type = "info",
  onClose,
}: PopupMessageProps) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const audio = new Audio(soundUrl);
    audio.play().catch(() => {});

    setVisible(true);

    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const closeTimer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeOut {
          from {opacity: 1; transform: translateY(0);}
          to {opacity: 0; transform: translateY(-10px);}
        }
      `}</style>
      <div
        role="alert"
        aria-live="assertive"
        onClick={() => {
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
          }, 300); // match animation duration
        }}
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white shadow-lg cursor-pointer flex items-center
          ${bgColor}
          ${fadeOut ? "animate-fadeOut" : "animate-fadeIn"}
        `}
        style={{
          animationFillMode: "forwards",
          animationDuration: "300ms",
          animationTimingFunction: "ease-in-out",
        }}
      >
        <span>{message}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setFadeOut(true);
            setTimeout(() => {
              setVisible(false);
              if (onClose) onClose();
            }, 400);
          }}
          aria-label="Close notification"
          className="ml-4 text-white hover:text-gray-300 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default PopupMessage;
