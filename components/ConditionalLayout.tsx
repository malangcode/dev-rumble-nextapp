// app/components/ConditionalLayout.tsx (client component)
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {isAdminRoute ? (
        // For admin routes, render children directly or with a different wrapper
        <div className="min-h-screenp-1">
          {children}
        </div>
      ) : (
        // For non-admin routes, keep your normal main wrapper
        <div className="min-h-screen flex justify-center px-1 pt-3">
          <main className="w-full max-w-[1200px]">{children}</main>
        </div>
      )}

      {!isAdminRoute && <Footer />}
    </>
  );
}
