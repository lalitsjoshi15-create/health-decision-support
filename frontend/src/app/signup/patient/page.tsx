"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [currentDoctor, setCurrentDoctor] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Save to local storage database
      const existingUsers = JSON.parse(localStorage.getItem("health_ai_users") || "[]");
      const newUser = {
        id: Date.now(),
        role: "patient",
        name: name,
        email: email,
        password: password,
        age: age,
        contact: contact,
        address: address,
        currentDoctor: currentDoctor,
        isVerified: true
      };
      existingUsers.push(newUser);
      localStorage.setItem("health_ai_users", JSON.stringify(existingUsers));

      setLoading(false);
      // Redirect to login
      router.push('/login?registered=true');
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--background)] to-blue-50 py-12">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full mb-2">
            Patient Portal
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-gray-600">
            Sign up to use the AI Symptom Checker and book appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Age</label>
              <input required value={age} onChange={e => setAge(e.target.value)} type="number" min="1" className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="35" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">Email Address</label>
              <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Contact Number</label>
              <input required value={contact} onChange={e => setContact(e.target.value)} type="tel" className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="+91 9876543210" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Residential Address</label>
            <textarea required value={address} onChange={e => setAddress(e.target.value)} rows={2} className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="123 Health Street, City" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Current Treating Doctor (Optional)</label>
            <input type="text" value={currentDoctor} onChange={e => setCurrentDoctor(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="Dr. XYZ or leave blank" />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700">Password</label>
             <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="••••••••" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:opacity-90 transition-all hover-lift disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium">
          <p className="text-gray-600">
            Already have an account? <Link href="/login" className="text-[var(--primary)] hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
