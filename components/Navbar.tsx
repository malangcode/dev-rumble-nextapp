"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { getAuthStatus, logout, UserAuthStatus } from '@/utils/auth';
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";

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
  HiOutlineCreditCard,
  HiOutlineMenu,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineShieldCheck, // Optional for admin panel icon
} from "react-icons/hi";

const navLinks = [
  { name: "Home", href: "/", icon: HiHome },
  { name: "Menu", href: "/menu", icon: HiOutlineShoppingBag },
  { name: "Notifications", href: "/notifications", icon: HiOutlineBell },
  { name: "Cart", href: "/cart", icon: HiOutlineShoppingCart },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [user, setUser] = useState<UserAuthStatus | null>(null);
  const { user, logout, loading } = useAuth();
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
    logout();
    setIsSidebarOpen(false);
    // setUser(null);
    router.push("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 tracking-tight"
          >
            SmartCanteen
          </Link>

          <div className="hidden md:flex items-center space-x-16">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-blue-600 transition-all duration-200"
                >
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                    )}
                  >
                    <Icon className="text-lg" />
                  </div>
                  <span className="mt-[6px]">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {user ? (
            <img
              src={user.photo ? BASE_URL + user.photo : "/images/profile2.jpg"}
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
      </nav>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-55 md:w-60 lg:w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-blue-700">SmartCanteen</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-red-500"
          >
            <HiX className="text-2xl" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {/* Render only on small screens */}
          {isSmallScreen && (
            <>
              {[
                { href: "/", label: "Home", icon: HiOutlineHome },
                { href: "/menu", label: "Menu", icon: HiOutlineMenu },
                { href: "/cart", label: "Cart", icon: HiOutlineShoppingCart },
                {
                  href: "/notifications",
                  label: "Notifications",
                  icon: HiOutlineBell,
                },
              ].map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href; // Add this
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleSidebar}
                    className="flex items-center space-x-3 px-3 py-2 transition text-gray-700 hover:text-blue-600"
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
          )}

          {/* Always show below options (even on large screens) */}
          <Link
            href="/profile"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 transition"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 transform",
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
            href="/settings"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 transition"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 transform",
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

          {user?.is_superuser && (
            <Link
              href="/admin"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
            >
              <HiOutlineShieldCheck className="text-xl" />
              <span>Admin Panel</span>
            </Link>
          )}

          {user?.is_staff && !user.is_superuser && (
            <Link
              href="/staff/tools"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded bg-purple-100 text-purple-800 hover:bg-purple-200 transition"
            >
              <HiOutlineShieldCheck className="text-xl" />
              <span>Staff Tools</span>
            </Link>
          )}

          <hr className="my-3" />

          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 px-3 py-2 rounded border border-red-600 text-red-600 hover:bg-red-50 transition"
            >
              <HiOutlineLogout className="text-xl" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={toggleSidebar}
                className="flex items-center space-x-3 px-3 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                <HiOutlineLogin className="text-xl" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                onClick={toggleSidebar}
                className="flex items-center space-x-3 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
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
