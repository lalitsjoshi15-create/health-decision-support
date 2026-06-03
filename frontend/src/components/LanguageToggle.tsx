"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex bg-white/50 border border-gray-200 rounded-full p-1 shadow-sm backdrop-blur-md">
      {(["en", "hi", "mr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            lang === l
              ? "bg-[var(--primary)] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
