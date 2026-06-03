"use client";

import React from 'react';
import Link from 'next/link';

export default function GlobalFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900">
            Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">AI</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} HealthAI Decision Support Systems. All rights reserved.</p>
        </div>
        
        <div className="flex gap-6 text-sm font-semibold text-gray-600">
          <Link href="/terms" className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-[var(--primary)] transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}
