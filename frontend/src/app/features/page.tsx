import React from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-br from-[#f8fafc] to-blue-50">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Platform Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover how our industry-leading AI tools empower both patients and doctors.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Feature 1 */}
          <div className="glass-panel p-10 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
              🤖
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Chat Assistant</h3>
            <p className="text-gray-600 leading-relaxed">
              A 24/7 intelligent floating chatbot powered by Gemini API. Patients can ask health questions in multiple regional languages and receive professional, empathetic medical guidance instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-10 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
              🩻
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">X-Ray & MRI Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              Upload medical images like X-Rays or MRIs. Our Multimodal Vision AI physically analyzes the image and provides a preliminary radiologist-style summary, detecting potential fractures or abnormalities.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-10 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
              ⌚
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Vitals Streaming</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect a smartwatch to stream live Heart Rate (BPM) and SpO2 data. If the AI detects a dangerous drop in oxygen or a spike in heart rate alongside reported symptoms, it instantly triggers a Critical Emergency alert.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel p-10 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
              📝
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Prescriptions</h3>
            <p className="text-gray-600 leading-relaxed">
              Doctors can automate their workflow. With a single click, the AI reads the patient's symptoms and drafts a fully-formatted, professional medical prescription ready for review and printing.
            </p>
          </div>
        </div>
        
        <div className="text-center pt-8">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
