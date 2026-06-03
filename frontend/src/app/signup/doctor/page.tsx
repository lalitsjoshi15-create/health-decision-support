"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerificationStep("Scanning Document via AI OCR...");

    // Simulate AI OCR Verification
    setTimeout(() => {
      setVerificationStep("Validating Medical Degree Database...");
      setTimeout(() => {
        setVerificationStep("Credentials Verified. Approving Account...");
        setTimeout(() => {
          // Save to local storage database
          const existingUsers = JSON.parse(localStorage.getItem("health_ai_users") || "[]");
          const newUser = {
            id: Date.now(),
            role: "doctor",
            name: name,
            email: email,
            password: password, // Note: storing raw pass for frontend prototype only
            specialty: specialty,
            isVerified: true
          };
          existingUsers.push(newUser);
          localStorage.setItem("health_ai_users", JSON.stringify(existingUsers));

          setLoading(false);
          setVerificationStep(null);
          // Redirect to login
          router.push('/login?registered=true');
        }, 1000);
      }, 1500);
    }, 1500);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-[var(--background)] to-blue-50 py-12">
      
      {/* Verification Overlay */}
      {loading && verificationStep && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center max-w-sm text-center shadow-2xl animate-in zoom-in">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Verification</h3>
            <p className="text-blue-600 font-medium">{verificationStep}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl glass-panel rounded-3xl p-8 shadow-xl border-t-8 border-[var(--primary)]">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-2">
            Clinical Portal
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Doctor Registration
          </h2>
          <p className="mt-2 text-gray-600">
            Join the network to manage appointments and receive AI-triaged patients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="bg-white/50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-lg text-[var(--primary-dark)] mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">Dr. Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} type="text" className="mt-1 block w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="Smith Johnson" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Professional Email</label>
                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 block w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="dr.smith@hospital.com" />
              </div>
            </div>
          </div>

          {/* Professional Details & Verification */}
          <div className="bg-white/50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-lg text-[var(--primary-dark)] mb-4">Professional Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">Specialist Category</label>
                <select required value={specialty} onChange={e => setSpecialty(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none">
                  <option value="">Select Category</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Highest Degree</label>
                <select required className="mt-1 block w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none">
                  <option value="">Select Degree</option>
                  <option value="MBBS">MBBS</option>
                  <option value="MD">MD</option>
                  <option value="DO">DO</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
            
            {/* ID / Degree Upload */}
            <div className="p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50">
               <label className="block text-sm font-bold text-gray-700 mb-2">Upload Medical Degree or ID Photo</label>
               <input required type="file" accept="image/*,.pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all"/>
               <p className="text-xs text-gray-500 mt-2">Required for instant AI verification and profile approval.</p>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700">Password</label>
             <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 block w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="••••••••" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-[var(--primary-dark)] bg-blue-100 hover:bg-blue-200 transition-all hover-lift disabled:opacity-50"
          >
            Submit for AI Verification
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium">
          <p className="text-gray-600">
            Already verified? <Link href="/login" className="text-[var(--primary)] hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
