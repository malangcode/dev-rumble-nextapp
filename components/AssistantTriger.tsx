"use client";

import React from "react";

interface TriggerButtonProps {
  onTrigger: () => void;
  isActive: boolean;
}

const TriggerButton: React.FC<TriggerButtonProps> = ({ onTrigger, isActive }) => {
  return (
    <button
      onClick={onTrigger}
      style={{
        position: "fixed",
        left: 20,
        bottom: 20,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none",
        zIndex: 10000,
      }}
      aria-label="Trigger Assistant"
      title={isActive ? "Assistant is active" : "Activate Assistant"}
    >
      <img
        src="/assistant.gif" // your gif path here
        alt="Assistant"
        style={{
          width: 60,
          height: 60,
          filter: isActive ? "drop-shadow(0 0 5px #0f62fe)" : "none",
          transition: "filter 0.3s ease",
        }}
      />
    </button>
  );
};

export default TriggerButton;
