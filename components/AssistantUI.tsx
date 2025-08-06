"use client";

import React, { useState } from "react";
import TriggerButton from "./AssistantTriger";
import Assistant from "./AssistantComponent";

export default function AssistantWrapper({ children }: { children: React.ReactNode }) {
  const [assistantActive, setAssistantActive] = useState(false);

  const toggleAssistant = () => setAssistantActive((prev) => !prev);

  return (
    <>
      {children}

      <TriggerButton onTrigger={toggleAssistant} isActive={assistantActive} />
      <Assistant isActive={assistantActive} onFinish={() => setAssistantActive(false)} />
    </>
  );
}
