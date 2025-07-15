"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getAuthStatus, UserAuthStatus } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

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
  const [isManuallyLoggedOut, setIsManuallyLoggedOut] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const PUBLIC_PATHS = ["/", "/login", "/signup", "/change-password"];

  // 🔁 Refresh access token
  const refreshAccessToken = async () => {
    try {
      await axios.post(
        "https://rahis.pythonanywhere.com/token/refresh/",
        {},
        { withCredentials: true }
      );

      console.log("🔄 Access token refreshed");

      const data = await getAuthStatus();
      setUser(data);
      setIsManuallyLoggedOut(false); // Allow re-auth again

      if (data?.exp) {
        startRefreshTimer(data.exp);
      }
    } catch (err) {
      console.error("❌ Token refresh failed. Logging out...");
      logout();
    }
  };

  // 🕒 Start refresh timer before expiry
  const startRefreshTimer = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const refreshDelay = (exp - now - 60) * 1000;

    if (refreshDelay <= 0) {
      refreshAccessToken();
      return;
    }

    console.log(`⏳ Scheduling token refresh in ${Math.round(refreshDelay / 1000)}s`);

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshDelay);
  };

  // 🔒 Check authentication once
  useEffect(() => {
    if (isManuallyLoggedOut) {
      setLoading(false);
      return;
    }

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
  }, [isManuallyLoggedOut]);

  // 🔁 Redirect if not authenticated and trying to access private route
  useEffect(() => {
    if (!loading && !user && !PUBLIC_PATHS.includes(pathname)) {
      console.log("🔐 Not authenticated, redirecting to /login");
      router.push("/login");
    }
  }, [loading, user, pathname]);

  // 🚪 Logout function
  const logout = async () => {
    try {
      await axios.post(
        "https://rahis.pythonanywhere.com/auth/logout/",
        {},
        { withCredentials: true }
      );

      setUser(null);
      setIsManuallyLoggedOut(true); // Prevent re-auth
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      console.log("✅ Logged out successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
