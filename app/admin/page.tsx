"use client";

import { useEffect, useState } from "react";
import {
  Home,
  ShoppingCart,
  ClipboardList,
  Users,
  Settings,
  Receipt,
  Banknote,
  Table2,
  BarChart2,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AdminOrdersComponent from "@/adminComponents/orders/orderComponent";

// Media Query Hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

// Utility function for class names
function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { label: "Dashboard", icon: <Home size={18} />, key: "dashboard" },
  { label: "Orders", icon: <ClipboardList size={18} />, key: "orders" },
  { label: "Menu", icon: <ShoppingCart size={18} />, key: "menu" },
  { label: "Tables", icon: <Table2 size={18} />, key: "tables" },
  { label: "Payments", icon: <Banknote size={18} />, key: "payments" },
  { label: "Reports", icon: <BarChart2 size={18} />, key: "reports" },
  { label: "Users", icon: <Users size={18} />, key: "users" },
  { label: "Settings", icon: <Settings size={18} />, key: "settings" },
];

export default function AdminPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Get the active nav item
  const activeNavItem = navItems.find((item) => item.key === activePage);

  const handleTouchStart = (e: TouchEvent) =>
    setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile) return;
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX < 50 && touchEndX - touchStartX > 100) setSidebarOpen(true);
    else if (touchStartX > 100 && touchStartX - touchEndX > 100)
      setSidebarOpen(false);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStartX, isMobile]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              Dashboard Overview
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Total Orders",
                  value: "1,542",
                  icon: <ClipboardList className="h-6 w-6 text-blue-600" />,
                },
                {
                  title: "Total Sales",
                  value: "Rs. 2,48,000",
                  icon: <Banknote className="h-6 w-6 text-green-600" />,
                },
                {
                  title: "Active Tables",
                  value: "18",
                  icon: <Table2 className="h-6 w-6 text-purple-600" />,
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "orders":
        return <AdminOrdersComponent />;
      default:
        return (
          <div className="text-gray-700 text-xl font-semibold">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative bg-gray-100">
      {/* Toggle Button with Active Icon */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-40 bg-white shadow-lg rounded-r-full p-3 hover:shadow-xl transition-shadow"
        animate={{
          x: sidebarOpen && !isMobile ? 256 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.div
          className="p-2 bg-blue-600 rounded-full text-white"
          animate={{
            rotate: sidebarOpen ? 180 : 0,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 0.3 },
            scale: {
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              repeatType: "reverse",
            },
          }}
        >
          {activeNavItem?.icon || <Home size={18} />}
        </motion.div>
      </motion.button>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-64 h-full bg-white shadow-lg p-5 flex flex-col justify-between z-30",
              isMobile ? "fixed" : "relative"
            )}
          >
            <div>
              <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2 mb-8">
                🍽️ Admin Panel
              </h2>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={cn(
                      "flex items-center w-full gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 relative",
                      activePage === item.key
                        ? "text-blue-700 font-semibold bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => {
                      setActivePage(item.key);
                      if (isMobile) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full transition-all duration-200",
                        activePage === item.key
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {activePage === item.key && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} /> Logout
            </Button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 p-6 transition-all duration-300 overflow-y-auto",
          sidebarOpen && !isMobile ? "ml-0" : "ml-0"
        )}
      >
        {renderContent()}
      </main>
    </div>
  );
}
