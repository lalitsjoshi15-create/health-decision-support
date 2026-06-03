"use client";

import React, { useState } from 'react';
import SymptomChecker from '@/components/SymptomChecker';
import ReportUpload from '@/components/ReportUpload';
import VitalsMonitor from '@/components/VitalsMonitor';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const getSpecialtyForDisease = (disease: string): string => {
  const d = disease.toLowerCase();
  if (d.includes('heart') || d.includes('hypertension')) return 'Cardiologist';
  if (d.includes('skin') || d.includes('fungal') || d.includes('acne') || d.includes('psoriasis') || d.includes('impetigo')) return 'Dermatologist';
  if (d.includes('stomach') || d.includes('gerd') || d.includes('ulcer') || d.includes('gastro')) return 'Gastroenterologist';
  if (d.includes('liver') || d.includes('jaundice') || d.includes('hepatitis') || d.includes('cholestasis')) return 'Hepatologist';
  if (d.includes('lung') || d.includes('asthma') || d.includes('tuberculosis') || d.includes('pneumonia')) return 'Pulmonologist';
  if (d.includes('brain') || d.includes('migraine') || d.includes('paralysis')) return 'Neurologist';
  if (d.includes('bone') || d.includes('arthritis') || d.includes('spondylosis') || d.includes('osteo')) return 'Orthopedist';
  if (d.includes('diabetes') || d.includes('thyroid') || d.includes('hypoglycemia')) return 'Endocrinologist';
  if (d.includes('urine') || d.includes('urinary')) return 'Urologist';
  if (d.includes('allergy') || d.includes('drug reaction')) return 'Allergist';
  if (d.includes('vertigo')) return 'ENT Specialist';
  if (d.includes('vein')) return 'Vascular Surgeon';
  if (d.includes('fever') || d.includes('malaria') || d.includes('dengue') || d.includes('typhoid') || d.includes('aids')) return 'Infectious Disease Specialist';
  return 'General Physician';
};

const MOCK_DOCTORS_DB = [
  { id: 1, name: "Dr. Smith Johnson", specialty: "Cardiologist", rating: 4.9, experience: 15, hospital: "City General Hospital" },
  { id: 2, name: "Dr. Priya Patel", specialty: "Dermatologist", rating: 4.8, experience: 8, hospital: "Skin Care Clinic" },
  { id: 3, name: "Dr. Robert Lee", specialty: "Gastroenterologist", rating: 4.7, experience: 12, hospital: "Metro Health Center" },
  { id: 4, name: "Dr. Anita Desai", specialty: "General Physician", rating: 4.9, experience: 10, hospital: "Rural Care Clinic" },
  { id: 5, name: "Dr. Vikram Singh", specialty: "Pulmonologist", rating: 4.6, experience: 14, hospital: "Lung & Chest Hospital" },
  { id: 6, name: "Dr. Emily Chen", specialty: "Neurologist", rating: 4.9, experience: 9, hospital: "Brain Institute" },
  { id: 7, name: "Dr. Ahmed Khan", specialty: "Orthopedist", rating: 4.8, experience: 11, hospital: "Bone & Joint Center" },
  { id: 8, name: "Dr. Sarah Miller", specialty: "Endocrinologist", rating: 4.7, experience: 7, hospital: "Diabetes Care" },
  { id: 9, name: "Dr. Deepak Sharma", specialty: "Infectious Disease Specialist", rating: 4.9, experience: 16, hospital: "City General Hospital" }
];

export default function PatientDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'symptoms'|'reports'|'doctors'>('symptoms');
  const [liveVitals, setLiveVitals] = useState<{ bpm: number; spo2: number } | null>(null);
  const [targetSpecialty, setTargetSpecialty] = useState<string | null>(null);

  const handleBookAppointment = (doc: any) => {
    const allApts = JSON.parse(localStorage.getItem('health_ai_appointments') || '[]');
    const newApt = {
      id: Date.now(),
      doctorName: doc.name,
      patientName: user?.name || "John Doe",
      patientContact: "+91 9876543210",
      time: "10:00 AM",
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      symptoms: "AI Predicted Symptoms",
      status: "pending"
    };
    allApts.push(newApt);
    localStorage.setItem('health_ai_appointments', JSON.stringify(allApts));
    alert(`Appointment request sent to ${doc.name}! Check your dashboard later for confirmation.`);
  };

  const handlePredictionComplete = (disease: string) => {
    const specialty = getSpecialtyForDisease(disease);
    setTargetSpecialty(specialty);
  };

  const displayedDoctors = targetSpecialty 
    ? MOCK_DOCTORS_DB.filter(d => d.specialty === targetSpecialty).sort((a, b) => b.rating - a.rating)
    : MOCK_DOCTORS_DB.sort((a, b) => b.rating - a.rating);

  return (
    <main className="min-h-screen p-4 md:p-12 bg-gradient-to-br from-[#f8fafc] to-blue-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center bg-white/50 p-6 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("patient_dashboard_title")}</h1>
            <p className="text-sm text-gray-600">{t("welcome_back")}, {user?.name || "John Doe"}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('symptoms')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'symptoms' ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>{t("tab_symptoms")}</button>
            <button onClick={() => setActiveTab('doctors')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'doctors' ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>{t("tab_doctors")}</button>
            <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>{t("tab_reports")}</button>
          </div>
        </header>

        {activeTab === 'symptoms' && (
          <section className="animate-in fade-in zoom-in duration-300">
             <VitalsMonitor onVitalsUpdate={setLiveVitals} />
             <SymptomChecker vitals={liveVitals} onPredictionComplete={handlePredictionComplete} />
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="animate-in fade-in zoom-in duration-300">
             <ReportUpload />
          </section>
        )}

        {activeTab === 'doctors' && (
          <section className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
               <div>
                 <h2 className="text-2xl font-bold text-gray-800">{t("available_doctors")}</h2>
                 {targetSpecialty && (
                    <p className="text-sm text-blue-600 font-bold mt-1">
                      AI Filter: Showing {targetSpecialty}s based on your symptoms
                    </p>
                 )}
               </div>
               <div className="text-sm text-gray-500">Top-Rated Specialists Based on AI Match</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedDoctors.map(doc => (
                <div key={doc.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover-lift border-2 hover:border-[var(--primary)] transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                       <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                         ⭐ {doc.rating.toFixed(1)}
                       </span>
                    </div>
                    <p className="text-[var(--primary-dark)] font-medium mb-1">{doc.specialty}</p>
                    <div className="text-sm text-gray-600 space-y-1 mb-6">
                      <p>🏥 {t("hospital")}: {doc.hospital}</p>
                      <p>⏱️ {t("experience")}: {doc.experience} {t("years")}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBookAppointment(doc)}
                    className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-sm"
                  >
                    {t("book_appointment")}
                  </button>
                </div>
              ))}
              
              {displayedDoctors.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                   No doctors found for this specific specialty. 
                   <button onClick={() => setTargetSpecialty(null)} className="ml-2 text-blue-600 font-bold underline">Show all doctors</button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
