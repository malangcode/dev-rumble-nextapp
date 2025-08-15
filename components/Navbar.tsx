"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
// import { getAuthStatus, logout, UserAuthStatus } from '@/utils/auth';
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IoWalletOutline } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";

import {
  HiHome,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiX,
  HiOutlineCog,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineMenu,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineShieldCheck, // Optional for admin panel icon
} from "react-icons/hi";
import Logo from "./LogoSwitcher";
import {
  Bell,
  CalendarDays,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  Moon,
  School,
  Search,
  Sparkles,
  Sun,
  UsersRound,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: HiHome },
  { name: "Menu", href: "/menu", icon: HiOutlineShoppingBag },
  { name: "Wallet", href: "/wallet", icon: IoWalletOutline },
  { name: "Notifications", href: "/notifications", icon: HiOutlineBell },
  { name: "Cart", href: "/cart", icon: HiOutlineShoppingCart },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [user, setUser] = useState<UserAuthStatus | null>(null);
  const { user, logout } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const authData = await getAuthStatus();
  //     setUser(authData);
  //   };
  //   fetchUser();
  // }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await logout();
    setIsSidebarOpen(false);
    window.location.href = "/login";
  };

  return (
    <>
      {/* <nav
        className=" shadow-md sticky top-0 z-50"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-1 sm:py-2 flex justify-between items-center">
          <Logo />

          <div className="hidden md:flex items-center space-x-16">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center text-xs font-medium text-[var(--text-secondary)] hover:text-blue-600 transition-all duration-200"
                >
                  <div
                    className={cn(
                      "w-10 relative h-10 flex items-center justify-center rounded-full transition-all duration-200",
                      isActive
                        ? "bg-[var(--color-primary)] text-white shadow"
                        : "bg-[var(--bg-icon)] text-[var(--text-secondary)] hover:bg-blue-100 hover:text-blue-600"
                    )}
                  >
                    <Icon className="text-lg" />
                   
                  </div>
                  <span className="mt-[6px]">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <ThemeToggle />

          {user ? (
            <img
              src="/images/profile2.jpg"
              alt="Profile"
              onClick={toggleSidebar}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-full cursor-pointer object-cover shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg border-2 border-white"
            />
          ) : (
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition duration-200 flex items-center justify-center"
            >
              <HiOutlineUserCircle className="text-xl" />
            </button>
          )}
        </div>
      </nav> */}
      {/* Top Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/40 dark:bg-zinc-950/40 border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow-md">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-lg tracking-tight">
              Campus<span className="text-indigo-500">X</span>
            </span>
          </span>

          {/* Search */}
          <div className="flex-1 hidden md:flex">
            <label className="w-full">
              <div className="group relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  aria-label="Search"
                  // value={query}
                  // onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, files, people… (Ctrl/Cmd + K)"
                  className="w-full rounded-2xl pl-9 pr-4 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none focus:ring-2 ring-indigo-400/60 shadow-sm"
                />
                <kbd className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-zinc-900/90 text-white/80 dark:bg-white/10">
                  ⌘K
                </kbd>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              // onClick={() => setPaletteOpen(true)}
              className="hidden md:inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
              aria-label="Open Command Palette"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Actions</span>
            </button>

            <ThemeToggle />

            <button
              className="relative rounded-xl p-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_0_2px_rgba(255,255,255,0.75)] dark:shadow-[0_0_0_2px_rgba(24,24,27,1)]" />
            </button>

            {user ? (
              <button
                className="flex items-center gap-2 rounded-2xl pl-1 pr-3 py-1 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
                aria-label="Open profile"
                onClick={toggleSidebar}
              >
                <img
                  src="/images/profile2.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-xl object-cover cursor-pointer shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg border-2 border-white"
                />
                <div className="text-left leading-tight">
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    Student
                  </span>
                  <span className="block text-sm font-medium">John Doe</span>
                </div>
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 rounded-2xl pl-1 pr-3 py-1 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
                aria-label="Open profile"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-500" />
                  <span className="absolute -bottom-1 -right-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                    S
                  </span>
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    Student
                  </span>
                  <span className="block text-sm font-medium">Laxmi S.</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-55 md:w-60 lg:w-64 backdrop-blur-xl bg-white/40 dark:bg-zinc-950/40 border-l border-white/20 dark:border-white/10 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/20 dark:border-white/10">
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow-md">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-lg tracking-tight">
              Campus<span className="text-indigo-500">X</span>
            </span>
          </span>
          <button
            onClick={toggleSidebar}
            className="rounded-xl p-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm text-gray-600 hover:text-red-500"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2">
          {/* {isSmallScreen && (
            <>
              {[
                { href: "/", label: "Home", icon: HiOutlineHome },
                { href: "/menu", label: "Menu", icon: HiOutlineMenu },
                { href: "/wallet", label: "Wallet", icon: IoWalletOutline },
                { href: "/cart", label: "Cart", icon: HiOutlineShoppingCart },
                {
                  href: "/notifications",
                  label: "Notifications",
                  icon: HiOutlineBell,
                },
              ].map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleSidebar}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm text-gray-700 hover:text-blue-600"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                        isActive
                          ? "bg-blue-600 text-white shadow"
                          : "bg-gray-100 hover:bg-blue-100 hover:text-blue-600"
                      )}
                    >
                      <Icon className="text-xl" />
                    </div>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </>
          )} */}

          <Link
            href="/dashboard"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/profile"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <LayoutDashboard className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/profile"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              Dashboard
            </span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/profile"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <HiOutlineUserCircle className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/profile"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              My Profile
            </span>
          </Link>

          <Link
            href="/events"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/settings"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <CalendarDays className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              Events
            </span>
          </Link>
          <Link
            href="/find-buddy"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/settings"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <Handshake className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              Find Buddy
            </span>
          </Link>
          <Link
            href="/group"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/settings"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <UsersRound className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              Group
            </span>
          </Link>
          <Link
            href="/classroom"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/settings"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <School className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              ClassRoom
            </span>
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/settings"
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110"
              )}
            >
              <HiOutlineCog className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              Settings
            </span>
          </Link>

          {/* Role-specific Links */}
          {user?.is_superuser && (
            <Link
              href="/admin"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
            >
              <HiOutlineShieldCheck className="text-xl" />
              <span>Admin Panel</span>
            </Link>
          )}

          {user?.is_staff && !user.is_superuser && (
            <Link
              href="/staff/tools"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 transition"
            >
              <HiOutlineShieldCheck className="text-xl" />
              <span>Staff Tools</span>
            </Link>
          )}

          <hr className="my-3 border-white/20 dark:border-white/10" />

          {/* Auth */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition shadow-sm"
            >
              <HiOutlineLogout className="text-xl" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={toggleSidebar}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition shadow-sm"
              >
                <HiOutlineLogin className="text-xl" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                onClick={toggleSidebar}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                <HiOutlineUserAdd className="text-xl" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40" onClick={toggleSidebar} />
      )}
    </>
  );
}
