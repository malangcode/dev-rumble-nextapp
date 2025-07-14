"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getAuthStatus, logout, UserAuthStatus } from "@/utils/auth";
import axios from "axios";

interface AuthContextType {
  user: UserAuthStatus | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 👇 Refresh access token
  const refreshAccessToken = async () => {
    try {
      await axios.post("https://rahis.pythonanywhere.com/token/refresh/", {}, {
        withCredentials: true,
      });

      console.log("🔄 Access token refreshed");

      // Fetch updated auth status after refresh
      const data = await getAuthStatus();
      setUser(data);

      if (data?.exp) {
        startRefreshTimer(data.exp);
      }
    } catch (err) {
      console.error("❌ Token refresh failed. Logging out...");
      logout();
    }
  };

  // 👇 Start timer to auto-refresh before token expires
  const startRefreshTimer = (exp: number) => {
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const refreshDelay = (exp - now - 60) * 1000; // 1 min before expiry

    if (refreshDelay <= 0) {
      refreshAccessToken(); // Immediate refresh if already expired
      return;
    }

    console.log(`⏳ Scheduling token refresh in ${Math.round(refreshDelay / 1000)} seconds`);

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshDelay);
  };

  useEffect(() => {
    getAuthStatus().then((data) => {
      setUser(data);
      setLoading(false);

      if (data?.exp) {
        startRefreshTimer(data.exp);
      }
    });

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
