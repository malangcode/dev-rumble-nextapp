"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuthStatus, logout, UserAuthStatus } from "@/utils/auth";

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

  useEffect(() => {
    getAuthStatus().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
