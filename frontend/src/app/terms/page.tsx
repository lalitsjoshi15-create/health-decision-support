import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-br from-[#f8fafc] to-blue-50">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p><strong>Last Updated: October 24, 2024</strong></p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Medical Disclaimer</h2>
            <p>HealthAI is an artificial intelligence decision-support platform designed to assist healthcare professionals and provide preliminary, educational triage information to patients. <strong>HealthAI is NOT a doctor.</strong> It does not provide medical diagnoses, treatment plans, or emergency services. Always consult a qualified medical professional for health concerns.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Data Accuracy</h2>
            <p>While our Machine Learning models are trained on extensive medical datasets, AI is susceptible to hallucinations and errors. You agree to use the predictions, including X-Ray interpretations and vitals monitoring, strictly as secondary supplementary data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Limitation of Liability</h2>
            <p>Under no circumstances shall HealthAI or its developers be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the application.</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
