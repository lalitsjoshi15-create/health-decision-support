"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "./LanguageToggle";

export default function ClientNavbar() {
  const { t } = useLanguage();
  const { role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
      <div className="font-bold text-2xl text-[var(--primary-dark)] tracking-tight">
        <Link href="/">Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">AI</span></Link>
      </div>
      
      <div className="flex items-center space-x-4 md:space-x-6 flex-wrap justify-center">
        <LanguageToggle />
        
        {/* Conditional Navigation based on Auth State */}
        {role === "none" && (
          <>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-[var(--primary)] transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-[var(--primary)] transition-colors">About Us</Link>
            <Link href="/features" className="text-sm font-semibold text-gray-600 hover:text-[var(--primary)] transition-colors">Features</Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-600 hover:text-[var(--primary)] transition-colors">Contact</Link>
            <Link href="/login" className="px-5 py-2 text-sm font-bold text-[var(--primary)] bg-white border border-[var(--primary)] rounded-full hover:bg-blue-50 transition-colors shadow-sm hover-lift">
              {t("nav_doctor_login")}
            </Link>
            <Link href="/signup/patient" className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full shadow-md hover-lift transition-all">
              Sign Up
            </Link>
          </>
        )}

        {role === "patient" && (
          <>
            <Link href="/patient/dashboard" className="text-sm font-bold text-gray-700 hover:text-[var(--primary)] transition-colors">
              {t("nav_patient")}
            </Link>
            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
              {t("nav_logout")}
            </button>
          </>
        )}

        {role === "doctor" && (
          <>
            <Link href="/doctor/dashboard" className="text-sm font-bold text-gray-700 hover:text-[var(--primary)] transition-colors">
              {t("nav_dashboard")}
            </Link>
            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
              {t("nav_logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
