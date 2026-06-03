"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      
      const existingUsers = JSON.parse(localStorage.getItem("health_ai_users") || "[]");
      const user = existingUsers.find((u: any) => u.email === email && u.password === password && u.role === loginType);

      if (user) {
        login(loginType, user);
        router.push(loginType === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
      } else {
        setError('Invalid credentials or role. Please try again or sign up.');
      }
    }, 800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--background)] to-blue-50">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 space-y-8 shadow-xl">
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'patient' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setLoginType('patient'); setError(''); }}
          >
            Patient
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'doctor' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setLoginType('doctor'); setError(''); }}
          >
            Doctor
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-2">
            Secure Portal
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Back</span>
          </h2>
          <p className="text-sm text-gray-600">
            Sign in to access your {loginType} dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder={loginType === 'doctor' ? 'dr.smith@hospital.com' : 'patient@example.com'} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="••••••••" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:opacity-90 transition-all hover-lift disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm space-y-4">
          <p className="text-gray-600 font-medium">
            Don't have an account?{' '}
            <Link href={loginType === 'doctor' ? "/signup/doctor" : "/signup/patient"} className="text-[var(--primary)] hover:underline font-bold">
              Sign up as {loginType === 'doctor' ? 'Doctor' : 'Patient'}
            </Link>
          </p>
          <Link href="/" className="inline-block font-medium text-gray-400 hover:text-gray-700 transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
