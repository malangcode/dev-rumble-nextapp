// context/messageContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import Notification from "@/components/messageBox";

type NotificationType = "success" | "error";
type NotificationContextType = {
  showNotification: (type: NotificationType, message: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};
