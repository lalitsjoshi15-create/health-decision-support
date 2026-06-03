import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-br from-[#f8fafc] to-blue-50">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p><strong>Last Updated: October 24, 2024</strong></p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Data Collection</h2>
            <p>We take your medical privacy seriously. When you use HealthAI, we collect the symptoms you input, audio recordings for speech-to-text, and uploaded medical reports (e.g., X-Rays) strictly for the purpose of running them through our AI inference engine.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Data Storage & HIPAA Compliance</h2>
            <p>During this prototype phase, all patient data is stored locally on your device (`localStorage`) or processed statelessly by the Gemini AI API. We do not permanently store your biometric vitals or medical images on external database servers without explicit consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Third-Party Services</h2>
            <p>We utilize the Google Gemini API to process multimodal inputs (text, voice, and vision). By using this platform, you acknowledge that anonymized prompt data is sent to these third-party services for inference.</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
