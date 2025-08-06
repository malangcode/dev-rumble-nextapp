// app/layout.tsx (server component, no 'use client')
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NotificationProvider } from "@/context/messageContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import { AuthProvider } from "@/context/AuthContext";
// import ClientLayout from '@/components/loader/LoaderclitentLayout';
import { RoleProvider } from "@/context/RoleProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GlobalProvider } from "@/context/GlobalContext";
import AssistantWrapper from "@/components/AssistantUI";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartCanteen",
  description: "Modern canteen management system for colleges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* <ClientLayout> */}
        <GoogleOAuthProvider clientId="814532111461-ftsc18otheakopmd1c2kilosqqfcqvdi.apps.googleusercontent.com">
          <AuthProvider>
            <RoleProvider>
              <GlobalProvider>
                <NotificationProvider>
                  <ToastContainer /> {/* toast alert  */}
                  <AssistantWrapper>
                  <ConditionalLayout>{children}</ConditionalLayout>
                  </AssistantWrapper>
                </NotificationProvider>
              </GlobalProvider>
            </RoleProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
        {/* </ClientLayout> */}
      </body>
    </html>
  );
}
