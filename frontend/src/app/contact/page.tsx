"use client";

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-br from-[#f8fafc] to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="glass-panel p-10 md:p-14 rounded-[2.5rem] shadow-lg border border-white">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Get in Touch</h1>
            <p className="text-gray-600">Interested in implementing HealthAI at your hospital or clinic? Drop us a message.</p>
          </header>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Dr. Jane Smith" required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital / Clinic Name</label>
              <input type="text" className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="City General Hospital" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="jane@hospital.com" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="How can we help you?" required></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </form>
          
          <div className="text-center mt-8">
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 font-medium">← Return to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
