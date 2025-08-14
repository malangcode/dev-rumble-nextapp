"use client";

import { JSX, useEffect, useState } from "react";
import {
  Home,
  ShoppingCart,
  ClipboardList,
  Users,
  Settings,
  Banknote,
  Table2,
  BarChart2,
  LogOut,
  Package,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
// import UserRoleManagement from "@/adminComponents/users/Users";
import ThemeToggle from "@/components/ThemeToggle";
import ForbiddenPage from "@/components/ForbiddenPage";
import AdminLandingPage from "@/adminComponents/landing/AdminLandingPage";

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

type NavItem = {
  label: string;
  icon: JSX.Element;
  key: string;
};

export default function AdminPage() {
  const [activePage, setActivePage] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);

  const isMobile = useMediaQuery("(max-width: 768px)");


  const navItems = [
  {
      label: "Dashboard",
      icon: <Home size={18} />,
      key: "dashboard",
    },
 {
      label: "Orders",
      icon: <ClipboardList size={18} />,
      key: "orders",
    },
   {
      label: "Menu",
      icon: <ShoppingCart size={18} />,
      key: "menu",
    },
 {
      label: "Tables",
      icon: <Table2 size={18} />,
      key: "tables",
    },
 {
      label: "Payments",
      icon: <Banknote size={18} />,
      key: "payments",
    },
   {
      label: "Inventory",
      icon: <Package size={18} />,
      key: "inventory",
    },
{
      label: "Reports",
      icon: <BarChart2 size={18} />,
      key: "reports",
    },
{
      label: "Users",
      icon: <Users size={18} />,
      key: "users",
    },
 {
      label: "Settings",
      icon: <Settings size={18} />,
      key: "settings",
    },
  ].filter(Boolean) as NavItem[];



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
  }, [touchStartX, isMobile, handleTouchEnd]);

  const renderContent = () => {
    switch (activePage) {
      case "admin":
        return <AdminLandingPage />;

      case "dashboard":
        return <ForbiddenPage />;

      case "dashboard":
        return <p>hello</p>;

      case "orders":
        return <p>orders</p>;

      case "menu":
        return <p>hello</p>;

      case "tables":
        return <p>tables</p>;

      case "reports":
        return <p>reports</p>;

      case "users":
        return <p>users</p>;

      case "payments":
        return <p>payments</p>;

      case "inventory":
        return <p>inventory</p>;

      case "settings":
        return <p>settings</p>;

      default:
        return (
          <div className="text-[var(--text-primary)] text-xl font-semibold">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative bg-[var(--bg-icon)] ">
     
      {/* Toggle Button with Active Icon */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-40 bg-[var(--bg-card)] shadow-lg rounded-r-full p-3 hover:shadow-xl transition-shadow"
        animate={{
          x: sidebarOpen && !isMobile ? 256 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.div
          className="p-2 bg-[var(--color-primary)] rounded-full text-white"
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
              "w-64 h-full bg-[var(--bg-card)] overflow-y-auto custom-scrollbar shadow-lg p-5 flex flex-col justify-between z-30",
              isMobile ? "fixed" : "relative"
            )}
          >
            <div>
              <span className="flex items-center mb-5 pb-2 border-b-[2px] border-[var(--gray-200)] ">
                {/* theme toggle overlay    */}
                <div className="absolute left-[165px] top-[15px] z-50">
                  <ThemeToggle />
                </div>
                <Image
                  src="/images/texas-logo.png"
                  height={500}
                  width={500}
                  className="w-[200px] md:w-[300px]"
                  alt={"logo"}
                ></Image>
              </span>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={cn(
                      "flex items-center w-full gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 relative",
                      activePage === item.key
                        ? "text-[var(--color-primary)] font-semibold bg-[var(--blue-50)] "
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-component)]"
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
                          ? "bg-[var(--color-primary)] text-white shadow-md"
                          : "bg-[var(--bg-icon)] text-[var(--text-secondary)] "
                      )}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {activePage === item.key && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 w-2 h-2 bg-[var(--color-primary)] rounded-full"
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
              className="w-full flex items-center mt-4 mb-2 justify-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} /> Logout
            </Button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 p-1 md:p-2 lg:p-4 xl:p-6 transition-all duration-300 overflow-y-auto",
          sidebarOpen && !isMobile ? "ml-0" : "ml-0"
        )}
      >
        {renderContent()}
      </main>
    </div>
  );
}
