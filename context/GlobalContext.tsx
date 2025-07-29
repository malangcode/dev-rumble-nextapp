'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { axiosWithCsrf } from '@/lib/axiosWithCsrf';

interface GlobalState {
  unreadNotifications: number;
  cartItemCount: number;
  refreshCounters: () => void;
}

const GlobalContext = createContext<GlobalState | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCounters = async () => {
    try {
      const [notiRes, cartRes] = await Promise.all([
        axiosWithCsrf.get('/api/notifications/unread-count/', { withCredentials: true }),
        axiosWithCsrf.get('/api/cart/items/count/', { withCredentials: true }),
      ]);
      setUnreadNotifications(notiRes.data.count);
      console.log(cartRes.data.count);
      setCartItemCount(cartRes.data.count);
    } catch (err) {
      console.error("Error fetching global counters", err);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  return (
    <GlobalContext.Provider value={{
      unreadNotifications,
      cartItemCount,
      refreshCounters: fetchCounters
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within GlobalProvider");
  return context;
};
