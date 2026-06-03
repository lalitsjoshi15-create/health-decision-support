import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientNavbar from "@/components/ClientNavbar";
import HealthChatbot from "@/components/HealthChatbot";
import GlobalFooter from "@/components/GlobalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthAI Decision Support Systems",
  description: "Rural healthcare triage and AI diagnostic assistance.",
  verification: {
    google: "pkqNyiBqh938PjjmPe-G0wmJu2LBH8YkMCj6D32DCtQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <ClientNavbar />
            
            {/* Main Content */}
            <div className="flex-grow flex flex-col">
              {children}
            </div>
            
            <GlobalFooter />
            <HealthChatbot />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
