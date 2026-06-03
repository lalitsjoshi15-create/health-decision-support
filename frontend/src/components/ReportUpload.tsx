'use client';

import React, { useState } from 'react';

export default function ReportUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('blood_report');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report_type', reportType);
    formData.append('user_id', '1'); // Mock user ID

    try {
      const response = await fetch('http://localhost:8000/api/upload-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload and analyze report.');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Error analyzing the report. Ensure the backend is running and Gemini API is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">📄 Medical Report & Scan Analyzer</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-2">Select Upload Type</label>
        <select 
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Blood Test">Blood Test (Text OCR)</option>
          <option value="Prescription">Prescription (Text OCR)</option>
          <option value="XRay">X-Ray Image (Vision AI)</option>
          <option value="MRI">MRI Scan (Vision AI)</option>
        </select>
      </div>

      <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer relative">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-4xl mb-4">📸</div>
        <p className="font-semibold text-blue-900 mb-1">
          {file ? file.name : "Tap to upload image or take a photo"}
        </p>
        <p className="text-sm text-blue-600">Supports JPG, PNG (Max 5MB)</p>
      </div>

      <button 
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full mt-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
           <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Analyzing with AI...</>
        ) : (
           <>✨ Analyze {reportType === 'XRay' || reportType === 'MRI' ? 'Scan' : 'Report'}</>
        )}
      </button>

      {result && (
        <div className="mt-8 p-6 bg-white/80 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
           <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Summary</h3>
           <div className="prose prose-blue max-w-none text-gray-700">
             {/* Simple formatting for the markdown returned by Gemini */}
             {result.ai_summary.split('\n').map((line: string, i: number) => (
                <p key={i} className="mb-2">{line}</p>
             ))}
           </div>
           
           <p className="text-xs text-gray-400 italic text-center mt-6 pt-4 border-t border-gray-200">
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
