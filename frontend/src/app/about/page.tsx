import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-br from-[#f8fafc] to-blue-50">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">About Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI</span></h1>
          <p className="text-xl text-gray-600">Bridging the gap between rural patients and elite medical care.</p>
        </header>

        <section className="glass-panel p-10 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            In many rural areas, access to top-tier specialists is limited, leading to delayed diagnoses and poor health outcomes. HealthAI was built with a singular vision: to use advanced Artificial Intelligence to democratize healthcare.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By allowing patients to communicate in their native languages (English, Hindi, Marathi) and using Machine Learning to instantly triage their symptoms, we ensure that critical emergencies are flagged immediately, and routine cases are efficiently routed to the right specialists.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Accessibility</h3>
            <p className="text-gray-600">We break language barriers with state-of-the-art NLP translation, ensuring every patient is understood.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant AI Triage</h3>
            <p className="text-gray-600">Our Machine Learning models evaluate symptom severity in milliseconds, potentially saving lives.</p>
          </div>
        </section>

        <div className="text-center pt-8">
          <Link href="/signup/patient" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors text-lg">
            Join the Platform Today
          </Link>
        </div>
      </div>
    </main>
  );
}
