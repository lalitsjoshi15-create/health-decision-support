'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SymptomChecker({ 
  vitals, 
  onPredictionComplete 
}: { 
  vitals?: { bpm: number; spo2: number } | null,
  onPredictionComplete?: (disease: string) => void
}) {
  const { t, lang } = useLanguage();
  const [symptoms, setSymptoms] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const getSpeechLangCode = (l: string) => {
    if (l === 'hi') return 'hi-IN';
    if (l === 'mr') return 'mr-IN';
    return 'en-US';
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setSymptoms((prev) => prev + (prev ? ', ' : '') + finalTranscript.toLowerCase().trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = getSpeechLangCode(lang);
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const handlePredict = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    const symptomList = symptoms.split(/[\s,]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    try {
      const response = await fetch(`${API_URL}/api/predict-disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, 
          symptoms: symptomList,
          vitals: vitals || null
        }),
      });

      
      if (!response.ok) throw new Error('Prediction failed');
      
      const data = await response.json();
      setPrediction(data);
      if (onPredictionComplete && data.predicted_disease) {
        onPredictionComplete(data.predicted_disease);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to the AI backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-[var(--primary-dark)]">{t("ai_symptom_checker_title")}</h2>
      
      <div className="mb-6 bg-white/50 p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
           <p className="font-semibold text-gray-800">{t("mic_instruction")}</p>
           <p className="text-xs text-gray-500">Currently using: {lang.toUpperCase()}</p>
        </div>
        <button 
          onClick={toggleListening}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-blue-50'}`}
        >
          {isListening ? (
            <>
              <span className="w-3 h-3 bg-white rounded-full animate-ping"></span> Stop
            </>
          ) : (
            <>🎤 Start Speaking</>
          )}
        </button>
      </div>

      <textarea 
        className="w-full p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-4"
        rows={4}
        placeholder={t("symptoms_placeholder")}
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button 
        onClick={handlePredict}
        disabled={loading || !symptoms.trim()}
        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] hover-lift shadow-md disabled:opacity-50"
      >
        {loading ? t("analyzing") : t("analyze_btn")}
      </button>

      {prediction && (
        <div className="mt-8 p-6 bg-white/80 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
           <div className="flex items-start justify-between mb-4">
             <div>
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{t("ai_prediction")}</h3>
               <div className="text-3xl font-extrabold text-[var(--primary-dark)]">
                 {prediction.predicted_disease}
               </div>
             </div>
             <div className={`px-4 py-2 rounded-full font-bold text-sm ${
               prediction.severity.risk_level === 'High' || prediction.severity.risk_level === 'Critical' 
                 ? 'bg-red-100 text-red-800' 
                 : 'bg-green-100 text-green-800'
             }`}>
               {t("severity")}: {prediction.severity.risk_level}
             </div>
           </div>
           
           {prediction.understood_symptoms && prediction.understood_symptoms.length > 0 && (
             <div className="mb-4 text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
               <span className="font-bold text-blue-800">AI Medical Translation: </span> 
               {prediction.understood_symptoms.join(", ")}
             </div>
           )}

           <div className="prose prose-blue max-w-none text-gray-700 mb-6">
              <p className="font-medium text-lg leading-relaxed">{prediction.analysis}</p>
           </div> 
           <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">{t("possible_condition")}</p>
              <p className="text-xl font-bold text-blue-900">{prediction.predicted_disease}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider">{t("ai_confidence")}</p>
              <p className="text-xl font-bold text-purple-900">{prediction.confidence}%</p>
            </div>
          </div>

          <div className="p-5 mb-6 bg-blue-50 border border-blue-200 rounded-xl">
             <h4 className="font-bold text-blue-900 mb-2">{t("detailed_analysis")}</h4>
             <p className="text-blue-800">{prediction.analysis}</p>
          </div>

          {(prediction.severity.risk_level === 'Critical' || prediction.severity.risk_level === 'High') && (
            <div className="p-5 mb-6 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-red-900 mb-1">⚠️ {t("emergency_alert")}</h4>
                <p className="text-red-700 text-sm">{prediction.severity.alert}</p>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors whitespace-nowrap">
                {t("find_doctor_now")}
              </button>
            </div>
          )}

          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-2">{t("recommended_precautions")}:</p>
            <ul className="list-disc pl-5 text-gray-600">
              {prediction.precautions.map((p: string, i: number) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-gray-400 italic text-center mt-6">
            {prediction.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
