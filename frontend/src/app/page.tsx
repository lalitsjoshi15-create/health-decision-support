"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-br from-[var(--background)] to-blue-50">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 mt-10">
          <div className="inline-block px-4 py-1 bg-blue-100 text-[var(--primary-dark)] font-bold rounded-full text-sm mb-2 shadow-sm animate-pulse">
            🌐 Now Available in English, Hindi & Marathi
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
            {t("hero_title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("hero_subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
             <Link href="/signup/patient" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover-lift text-lg">
               {t("join_patient")}
             </Link>
             <Link href="/signup/doctor" className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--primary)] font-bold border-2 border-[var(--primary)] rounded-full shadow-md hover:bg-blue-50 transition-all hover-lift text-lg">
               {t("register_doctor")}
             </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="glass-panel p-8 rounded-3xl text-center hover-lift">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-2xl font-bold mb-2">{t("card_hospitals")}</h3>
            <p className="text-gray-600">{t("card_hospitals_desc")}</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center hover-lift border-t-4 border-[var(--accent)]">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-2">{t("card_ai")}</h3>
            <p className="text-gray-600">{t("card_ai_desc")}</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center hover-lift">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-2xl font-bold mb-2">{t("card_specialists")}</h3>
            <p className="text-gray-600">{t("card_specialists_desc")}</p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl shadow-sm max-w-4xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-2xl mt-1">⚠️</div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-yellow-800">{t("disclaimer_title")}</h3>
              <div className="mt-2 text-yellow-700">
                <p>{t("disclaimer_text")}</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center pt-12 pb-6 border-t border-gray-200">
          <p className="text-gray-500 font-medium">
             Healthcare AI System &copy; {new Date().getFullYear()} • Secure & Private
          </p>
        </footer>
      </div>
    </main>
  );
}
