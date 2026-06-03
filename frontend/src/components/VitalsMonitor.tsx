import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VitalsMonitor({ onVitalsUpdate }: { onVitalsUpdate: (vitals: { bpm: number; spo2: number } | null) => void }) {
  const { t } = useLanguage();
  const [bpm, setBpm] = useState<number | ''>('');
  const [spo2, setSpo2] = useState<number | ''>('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (bpm !== '' && spo2 !== '') {
      onVitalsUpdate({ bpm: Number(bpm), spo2: Number(spo2) });
      setIsSaved(true);
    }
  };

  const handleClear = () => {
    setBpm('');
    setSpo2('');
    onVitalsUpdate(null);
    setIsSaved(false);
  };

  return (
    <div className="glass-panel p-8 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--primary-dark)] flex items-center gap-2">
          ⌚ {t("vitals_monitor") || "Current Vitals"}
        </h2>
        {isSaved && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            ✅ {t("vitals_saved") || "Vitals Linked to Prediction"}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        {t("vitals_instruction") || "Please enter your current Heart Rate (BPM) and Blood Oxygen (SpO2) if known. This authentic data will be fused with your symptoms for a highly accurate AI emergency assessment."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heart Rate Input */}
        <div className="bg-white/70 p-6 rounded-2xl border-2 border-red-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">❤️</div>
           <p className="text-sm font-bold text-red-800 mb-2">{t("heart_rate") || "Heart Rate (BPM)"}</p>
           <div className="flex items-end gap-2">
             <input 
               type="number"
               min="30" max="250"
               value={bpm}
               onChange={(e) => { setBpm(Number(e.target.value)); setIsSaved(false); }}
               disabled={isSaved}
               placeholder="e.g., 75"
               className="w-32 bg-transparent text-5xl font-black text-red-600 focus:outline-none placeholder-gray-300"
             />
             <span className="text-red-400 font-bold mb-2">BPM</span>
           </div>
        </div>

        {/* SpO2 Input */}
        <div className="bg-white/70 p-6 rounded-2xl border-2 border-blue-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🫁</div>
           <p className="text-sm font-bold text-blue-800 mb-2">{t("blood_oxygen") || "Blood Oxygen (SpO2)"}</p>
           <div className="flex items-end gap-2">
             <input 
               type="number"
               min="50" max="100"
               value={spo2}
               onChange={(e) => { setSpo2(Number(e.target.value)); setIsSaved(false); }}
               disabled={isSaved}
               placeholder="e.g., 98"
               className="w-32 bg-transparent text-5xl font-black text-blue-600 focus:outline-none placeholder-gray-300"
             />
             <span className="text-blue-400 font-bold mb-2">%</span>
           </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {isSaved ? (
           <button onClick={handleClear} className="px-6 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
             {t("clear_data") || "Clear Data"}
           </button>
        ) : (
           <button 
             onClick={handleSave} 
             disabled={bpm === '' || spo2 === ''}
             className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-xl shadow-md disabled:opacity-50 hover-lift"
           >
             {t("link_vitals") || "Link Vitals to AI"}
           </button>
        )}
      </div>
    </div>
  );
}
