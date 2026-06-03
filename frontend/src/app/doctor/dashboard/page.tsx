"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function DoctorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth(); // dynamically fetched logged-in user
  
  const [activeTab, setActiveTab] = useState<'appointments'|'patients'|'profile'>('appointments');

  const [appointments, setAppointments] = useState<any[]>([]);
  const [myPatientsList, setMyPatientsList] = useState<any[]>([]);
  
  // New State for Smart Prescription
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const [generatingPrescription, setGeneratingPrescription] = useState(false);

  React.useEffect(() => {
    const allApts = JSON.parse(localStorage.getItem('health_ai_appointments') || '[]');
    const myApts = allApts.filter((a: any) => a.doctorName === user?.name);
    setAppointments(myApts.reverse());
    
    const confirmed = myApts.filter((a: any) => a.status === 'confirmed');
    const uniquePatients: any[] = [];
    const seen = new Set();
    for (const apt of confirmed) {
      if (!seen.has(apt.patientName)) {
        seen.add(apt.patientName);
        uniquePatients.push({
           id: apt.id,
           name: apt.patientName,
           age: 35, 
           contact: apt.patientContact || "+91 XXXXX XXXXX",
           lastVisit: apt.date,
           symptoms: apt.symptoms,
           status: "Active Treatment"
        });
      }
    }
    setMyPatientsList(uniquePatients);
  }, [user]);

  const handleAccept = (id: number) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: "confirmed" } : apt));
    const allApts = JSON.parse(localStorage.getItem('health_ai_appointments') || '[]');
    const updatedApts = allApts.map((apt: any) => apt.id === id ? { ...apt, status: "confirmed" } : apt);
    localStorage.setItem('health_ai_appointments', JSON.stringify(updatedApts));
  };

  const handleGeneratePrescription = async (patient: any) => {
    setGeneratingPrescription(true);
    setShowPrescriptionModal(true);
    setPrescriptionData(null);
    try {
      const res = await fetch('http://localhost:8000/api/generate-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_name: patient.name, symptoms: patient.symptoms })
      });
      const data = await res.json();
      setPrescriptionData({ text: data.prescription, patientName: patient.name });
    } catch (e) {
      setPrescriptionData({ text: "Error generating prescription.", patientName: patient.name });
    } finally {
      setGeneratingPrescription(false);
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <main className="min-h-screen p-4 md:p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 relative">
      {/* PRESCRIPTION MODAL */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
               <h3 className="font-bold text-xl flex items-center gap-2">📝 AI Smart Prescription</h3>
               <button onClick={() => setShowPrescriptionModal(false)} className="hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-8 min-h-[300px]">
               {generatingPrescription ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 mt-12">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="font-medium animate-pulse">Gemini is drafting the prescription...</p>
                 </div>
               ) : (
                 <div>
                    <div className="flex justify-between border-b pb-4 mb-4">
                       <div>
                         <p className="font-bold text-lg">{user?.name}</p>
                         <p className="text-sm text-slate-500">{user?.specialty}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-lg">Patient: {prescriptionData?.patientName}</p>
                         <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="prose prose-blue max-w-none whitespace-pre-wrap font-serif text-slate-800 bg-blue-50 p-6 rounded-xl border border-blue-100">
                      {prescriptionData?.text}
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                      <button className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors">Edit Manually</button>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors flex gap-2 items-center">🖨️ Print PDF</button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{t("clinical_dashboard")}</h1>
              {user?.isVerified && (
                <span className="bg-green-100/10 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                  <span>⚕️</span> AI Verified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              {user?.name || "Dr. Smith Johnson"} • {user?.specialty || "Cardiologist"}
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button onClick={() => setActiveTab('appointments')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-[var(--accent)] text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}>{t("tab_appointments")}</button>
            <button onClick={() => setActiveTab('patients')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'patients' ? 'bg-[var(--accent)] text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}>{t("tab_patients")}</button>
            <button onClick={() => setActiveTab('profile')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-[var(--accent)] text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}>{t("tab_profile")}</button>
          </div>
        </header>

        {/* Analytics Summary */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{t("total_appointments")}</p>
                <p className="text-4xl font-bold text-white mt-2">{appointments.length}</p>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-3/4"></div></div>
           </div>
           <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{t("pending_approvals")}</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{pendingCount}</p>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-1/4"></div></div>
           </div>
           <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{t("active_patients")}</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{myPatientsList.length}</p>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-1/2"></div></div>
           </div>
           
           {/* Mini CSS Bar Chart for Patient Traffic */}
           <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md">
              <p className="text-slate-400 text-sm font-medium mb-3">Weekly Traffic</p>
              <div className="flex items-end justify-between h-16 gap-1">
                 {[40, 70, 45, 90, 60, 100, 30].map((h, i) => (
                    <div key={i} className="w-full bg-gradient-to-t from-[var(--primary)] to-[var(--accent)] rounded-t-sm opacity-80 hover:opacity-100 transition-all cursor-pointer" style={{height: `${h}%`}}></div>
                 ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase font-bold">
                 <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
           </div>
        </section>

        {activeTab === 'appointments' && (
          <section className="bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
               <h2 className="text-xl font-bold text-white">{t("upcoming_appointments")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-slate-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">{t("th_patient_name")}</th>
                    <th className="p-4 font-medium">{t("th_date_time")}</th>
                    <th className="p-4 font-medium">{t("th_symptoms")}</th>
                    <th className="p-4 font-medium">{t("th_status")}</th>
                    <th className="p-4 font-medium text-right">{t("th_actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {appointments.length > 0 ? appointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-bold text-white">{apt.patientName}</td>
                      <td className="p-4 text-slate-300">{apt.date} • {apt.time}</td>
                      <td className="p-4 text-slate-400 truncate max-w-xs">{apt.symptoms}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'}`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {apt.status === 'pending' && (
                          <button onClick={() => handleAccept(apt.id)} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors">{t("btn_accept")}</button>
                        )}
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors">{t("btn_view_details")}</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        {t("no_appointments")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* NEW "MY PATIENTS" TAB WITH SMART PRESCRIPTION & TELEMEDICINE */}
        {activeTab === 'patients' && (
          <section className="bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
               <h2 className="text-xl font-bold text-white">Active Patient Directory</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
               {myPatientsList.map(patient => (
                 <div key={patient.id} className="bg-slate-900/50 border border-slate-700 p-5 rounded-xl hover:border-slate-500 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                         <h3 className="font-bold text-lg text-white">{patient.name}</h3>
                         <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{patient.age} yrs</span>
                      </div>
                      <div className="space-y-2 text-sm text-slate-400 mb-4">
                         <p>📞 {patient.contact}</p>
                         <p>📅 Last Visit: {patient.lastVisit}</p>
                         <p>⚕️ Status: <span className="text-[var(--accent)] font-medium">{patient.status}</span></p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleGeneratePrescription(patient)}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        ✨ Generate Prescription
                      </button>
                      <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-green-400 border border-green-900 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                        🎥 Start Consultation
                      </button>
                    </div>
                 </div>
               ))}
               {myPatientsList.length === 0 && (
                 <div className="col-span-3 text-center text-slate-500 py-12">No active patients yet. Accept pending appointments first!</div>
               )}
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl animate-in fade-in zoom-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold text-white mb-6">{t("profile_settings")}</h2>
             <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t("availability_status")}</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[var(--accent)] outline-none">
                    <option>Available for Appointments</option>
                    <option>On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t("consultation_fee")} (₹)</label>
                  <input type="number" defaultValue={500} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[var(--accent)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t("hospital_affiliation")}</label>
                  <input type="text" defaultValue="City General Hospital" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[var(--accent)] outline-none" />
                </div>
                <button type="button" className="w-full py-3 bg-[var(--accent)] hover:bg-purple-500 text-white font-bold rounded-xl shadow-md transition-all hover-lift">
                  {t("save_changes")}
                </button>
             </form>
          </section>
        )}
      </div>
    </main>
  );
}
