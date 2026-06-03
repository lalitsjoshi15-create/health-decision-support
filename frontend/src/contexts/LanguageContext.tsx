"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi" | "mr";

// Dictionaries
const translations = {
  en: {
    nav_patient: "Patient Portal",
    nav_dashboard: "Dashboard",
    nav_doctor_login: "Login",
    nav_patient_login: "Patient Login",
    nav_logout: "Logout",
    hero_title: "Decision Support System",
    hero_subtitle: "Preliminary symptom analysis, emergency risk detection, and medical report interpretation designed for accessibility and rural care.",
    join_patient: "Join as Patient",
    register_doctor: "Register as Doctor",
    card_hospitals: "Connected Hospitals",
    card_hospitals_desc: "Access top-tier medical facilities directly from your dashboard. We connect rural areas to urban specialists.",
    card_ai: "AI Symptom Checker",
    card_ai_desc: "Get instant severity assessments and preliminary predictions to know if it's an emergency.",
    card_specialists: "Top Specialists",
    card_specialists_desc: "Book appointments seamlessly based on AI recommendations and doctor ratings.",
    disclaimer_title: "Medical Disclaimer",
    disclaimer_text: "This system is for educational and decision-support purposes only. It is not a replacement for a doctor. Always seek the advice of your physician or other qualified health provider.",
    symptoms_label: "Enter your symptoms...",
    symptoms_placeholder: "e.g., severe headache, fever, chest pain",
    analyze_btn: "Analyze Symptoms",
    book_appointment: "Book Appointment",
    available_doctors: "Recommended Doctors",
    hospital: "Hospital",
    experience: "Experience",
    years: "years",
    rating: "Rating",
    
    // Internal Dashboard Keys
    patient_dashboard_title: "Patient Dashboard",
    welcome_back: "Welcome back",
    tab_symptoms: "Symptom Checker",
    tab_doctors: "Find Doctors",
    tab_reports: "Medical Reports",
    ai_symptom_checker_title: "AI Symptom Checker",
    speak_symptoms: "Speak Symptoms",
    stop_listening: "Stop Listening",
    english_speech: "English Speech",
    hindi_speech: "Hindi (हिन्दी) Speech",
    marathi_speech: "Marathi (मराठी) Speech",
    prediction_results: "Prediction Results",
    possible_condition: "Possible Condition",
    ai_confidence: "AI Confidence",
    detailed_analysis: "Detailed Analysis",
    emergency_alert: "Emergency Alert",
    find_doctor_now: "Find Doctor Now",
    recommended_precautions: "Recommended Precautions",
    analyzing: "Analyzing with AI...",
    critical_alert: "CRITICAL ALERT",
    high_risk: "High Risk",
    based_on_symptoms: "Based on your recent symptoms",
    ai_prediction: "AI Prediction",
    severity: "Severity",
    mic_instruction: "Describe your symptoms using your microphone",
    
    // Doctor Dashboard Keys
    clinical_dashboard: "Clinical Dashboard",
    tab_appointments: "Appointments",
    tab_patients: "My Patients",
    tab_profile: "Profile Settings",
    total_appointments: "Total Appointments",
    pending_approvals: "Pending Approvals",
    active_patients: "Active Patients",
    average_rating: "Average Rating",
    upcoming_appointments: "Upcoming Appointments",
    th_patient_name: "Patient Name",
    th_date_time: "Date & Time",
    th_symptoms: "Reported Symptoms",
    th_status: "Status",
    th_actions: "Actions",
    btn_accept: "Accept",
    btn_view_details: "View Details",
    no_appointments: "No upcoming appointments. Enjoy your break, Doctor!",
    profile_settings: "Profile Settings",
    availability_status: "Availability Status",
    consultation_fee: "Consultation Fee",
    hospital_affiliation: "Hospital Affiliation Update",
    save_changes: "Save Changes",
    
    // Vitals & Reports
    vitals_monitor: "Vitals Monitor",
    vitals_saved: "Vitals Linked to Prediction",
    vitals_instruction: "Please enter your current Heart Rate (BPM) and Blood Oxygen (SpO2) if known. This authentic data will be fused with your symptoms for a highly accurate AI emergency assessment.",
    heart_rate: "Heart Rate (BPM)",
    blood_oxygen: "Blood Oxygen (SpO2)",
    link_vitals: "Link Vitals to AI",
    clear_data: "Clear Data",
  },
  hi: {
    nav_patient: "रोगी पोर्टल",
    nav_dashboard: "डैशबोर्ड",
    nav_doctor_login: "लॉगिन करें",
    nav_patient_login: "रोगी लॉगिन",
    nav_logout: "लॉग आउट",
    hero_title: "निर्णय सहायता प्रणाली",
    hero_subtitle: "ग्रामीण देखभाल और पहुंच के लिए प्रारंभिक लक्षण विश्लेषण, आपातकालीन जोखिम का पता लगाना और मेडिकल रिपोर्ट व्याख्या।",
    join_patient: "मरीज के रूप में जुड़ें",
    register_doctor: "डॉक्टर के रूप में पंजीकरण करें",
    card_hospitals: "जुड़े हुए अस्पताल",
    card_hospitals_desc: "अपने डैशबोर्ड से सीधे शीर्ष चिकित्सा सुविधाओं तक पहुंचें। हम ग्रामीण क्षेत्रों को शहरी विशेषज्ञों से जोड़ते हैं।",
    card_ai: "एआई लक्षण चेकर",
    card_ai_desc: "तत्काल गंभीरता आकलन और प्रारंभिक भविष्यवाणियां प्राप्त करें ताकि पता चल सके कि क्या यह एक आपात स्थिति है।",
    card_specialists: "शीर्ष विशेषज्ञ",
    card_specialists_desc: "एआई सिफारिशों और डॉक्टर रेटिंग के आधार पर निर्बाध रूप से अपॉइंटमेंट बुक करें।",
    disclaimer_title: "चिकित्सा अस्वीकरण",
    disclaimer_text: "यह प्रणाली केवल शैक्षिक और निर्णय-सहायता उद्देश्यों के लिए है। यह डॉक्टर का विकल्प नहीं है। हमेशा योग्य स्वास्थ्य प्रदाता की सलाह लें।",
    symptoms_label: "अपने लक्षण दर्ज करें...",
    symptoms_placeholder: "उदाहरण: तेज सिरदर्द, बुखार, सीने में दर्द",
    analyze_btn: "लक्षणों का विश्लेषण करें",
    book_appointment: "अपॉइंटमेंट बुक करें",
    available_doctors: "अनुशंसित डॉक्टर",
    hospital: "अस्पताल",
    experience: "अनुभव",
    years: "वर्ष",
    rating: "रेटिंग",
    mic_instruction: "माइक्रोफ़ोन का उपयोग करके अपने लक्षणों का वर्णन करें",

    // Internal Dashboard Keys
    patient_dashboard_title: "रोगी डैशबोर्ड",
    welcome_back: "वापसी पर स्वागत है",
    tab_symptoms: "लक्षण चेकर",
    tab_doctors: "डॉक्टर खोजें",
    tab_reports: "मेडिकल रिपोर्ट",
    ai_symptom_checker_title: "एआई लक्षण चेकर",
    speak_symptoms: "लक्षण बोलें",
    stop_listening: "सुनना बंद करें",
    english_speech: "अंग्रेजी (English)",
    hindi_speech: "हिन्दी (Hindi)",
    marathi_speech: "मराठी (Marathi)",
    prediction_results: "भविष्यवाणी के परिणाम",
    possible_condition: "संभावित स्थिति",
    ai_confidence: "एआई विश्वास (Confidence)",
    detailed_analysis: "विस्तृत विश्लेषण",
    emergency_alert: "आपातकालीन चेतावनी",
    find_doctor_now: "अभी डॉक्टर खोजें",
    recommended_precautions: "अनुशंसित सावधानियां",
    analyzing: "एआई से विश्लेषण कर रहे हैं...",
    critical_alert: "गंभीर चेतावनी",
    high_risk: "उच्च जोखिम",
    based_on_symptoms: "आपके हाल के लक्षणों के आधार पर",
    ai_prediction: "एआई भविष्यवाणी",
    severity: "गंभीरता",

    // Doctor Dashboard Keys
    clinical_dashboard: "क्लिनिकल डैशबोर्ड",
    tab_appointments: "अपॉइंटमेंट",
    tab_patients: "मेरे मरीज",
    tab_profile: "प्रोफाइल सेटिंग",
    total_appointments: "कुल अपॉइंटमेंट",
    pending_approvals: "लंबित स्वीकृति",
    active_patients: "सक्रिय मरीज",
    average_rating: "औसत रेटिंग",
    upcoming_appointments: "आगामी अपॉइंटमेंट",
    th_patient_name: "मरीज का नाम",
    th_date_time: "तारीख और समय",
    th_symptoms: "बताए गए लक्षण",
    th_status: "स्थिति",
    th_actions: "कार्रवाई",
    btn_accept: "स्वीकारें",
    btn_view_details: "विवरण देखें",
    no_appointments: "कोई आगामी अपॉइंटमेंट नहीं। आराम करें, डॉक्टर!",
    profile_settings: "प्रोफाइल सेटिंग",
    availability_status: "उपलब्धता स्थिति",
    consultation_fee: "परामर्श शुल्क",
    hospital_affiliation: "अस्पताल संबद्धता",
    save_changes: "बदलाव सहेजें",
    
    // Vitals & Reports
    vitals_monitor: "वाइटल्स मॉनिटर",
    vitals_saved: "डेटा एआई से लिंक किया गया",
    vitals_instruction: "यदि ज्ञात हो तो कृपया अपना वर्तमान हृदय गति (BPM) और रक्त ऑक्सीजन (SpO2) दर्ज करें। यह प्रामाणिक डेटा अत्यधिक सटीक AI आपातकालीन मूल्यांकन के लिए आपके लक्षणों के साथ जोड़ा जाएगा।",
    heart_rate: "हृदय गति (BPM)",
    blood_oxygen: "रक्त ऑक्सीजन (SpO2)",
    link_vitals: "डेटा को एआई से लिंक करें",
    clear_data: "डेटा साफ़ करें",
  },
  mr: {
    nav_patient: "रुग्ण पोर्टल",
    nav_dashboard: "डॅशबोर्ड",
    nav_doctor_login: "लॉगिन करा",
    nav_patient_login: "रुग्ण लॉगिन",
    nav_logout: "बाहेर पडा",
    hero_title: "निर्णय समर्थन प्रणाली",
    hero_subtitle: "ग्रामीण काळजी आणि सुलभतेसाठी डिझाइन केलेले प्राथमिक लक्षण विश्लेषण, आपत्कालीन जोखीम शोधणे आणि वैद्यकीय अहवाल स्पष्टीकरण.",
    join_patient: "रुग्ण म्हणून सामील व्हा",
    register_doctor: "डॉक्टर म्हणून नोंदणी करा",
    card_hospitals: "जोडलेली रुग्णालये",
    card_hospitals_desc: "तुमच्या डॅशबोर्डवरून थेट उच्च-स्तरीय वैद्यकीय सुविधांमध्ये प्रवेश करा. आम्ही ग्रामीण भागांना शहरी तज्ञांशी जोडतो.",
    card_ai: "एआय लक्षण चेकर",
    card_ai_desc: "तातडीची जोखीम शोधण्यासाठी आणि प्राथमिक अंदाजे मिळवण्यासाठी झटपट मूल्यांकन मिळवा.",
    card_specialists: "शीर्ष विशेषज्ञ",
    card_specialists_desc: "एआय शिफारसी आणि डॉक्टर रेटिंगच्या आधारावर विनाव्यत्यय अपॉइंटमेंट बुक करा.",
    disclaimer_title: "वैद्यकीय अस्वीकरण",
    disclaimer_text: "ही प्रणाली केवळ शैक्षणिक आणि निर्णय-समर्थन हेतूंसाठी आहे. हा डॉक्टरांचा पर्याय नाही. नेहमी पात्र आरोग्य प्रदात्याचा सल्ला घ्या.",
    symptoms_label: "तुमची लक्षणे प्रविष्ट करा...",
    symptoms_placeholder: "उदा., तीव्र डोकेदुखी, ताप, छातीत दुखणे",
    analyze_btn: "लक्षणांचे विश्लेषण करा",
    book_appointment: "अपॉइंटमेंट बुक करा",
    available_doctors: "शिफारस केलेले डॉक्टर",
    hospital: "रुग्णालय",
    experience: "अनुभव",
    years: "वर्षे",
    rating: "रेटिंग",
    mic_instruction: "मायक्रोफोन वापरून तुमच्या लक्षणांचे वर्णन करा",

    // Internal Dashboard Keys
    patient_dashboard_title: "रुग्ण डॅशबोर्ड",
    welcome_back: "परत स्वागत आहे",
    tab_symptoms: "लक्षण चेकर",
    tab_doctors: "डॉक्टर शोधा",
    tab_reports: "वैद्यकीय अहवाल",
    ai_symptom_checker_title: "एआय लक्षण चेकर",
    speak_symptoms: "लक्षणे सांगा",
    stop_listening: "ऐकणे थांबवा",
    english_speech: "इंग्रजी (English)",
    hindi_speech: "हिंदी (Hindi)",
    marathi_speech: "मराठी (Marathi)",
    prediction_results: "अंदाज परिणाम",
    possible_condition: "संभाव्य स्थिती",
    ai_confidence: "एआय विश्वास",
    detailed_analysis: "सविस्तर विश्लेषण",
    emergency_alert: "आपत्कालीन इशारा",
    find_doctor_now: "आता डॉक्टर शोधा",
    recommended_precautions: "शिफारस केलेली खबरदारी",
    analyzing: "एआय विश्लेषण करत आहे...",
    critical_alert: "गंभीर इशारा",
    high_risk: "उच्च जोखीम",
    based_on_symptoms: "तुमच्या अलीकडील लक्षणांवर आधारित",
    ai_prediction: "एआय अंदाज",
    severity: "गंभीरता",

    // Doctor Dashboard Keys
    clinical_dashboard: "क्लिनिकल डॅशबोर्ड",
    tab_appointments: "अपॉइंटमेंट",
    tab_patients: "माझे रुग्ण",
    tab_profile: "प्रोफाइल सेटिंग्ज",
    total_appointments: "एकूण अपॉइंटमेंट",
    pending_approvals: "प्रलंबित मंजुरी",
    active_patients: "सक्रिय रुग्ण",
    average_rating: "सरासरी रेटिंग",
    upcoming_appointments: "आगामी अपॉइंटमेंट",
    th_patient_name: "रुग्णाचे नाव",
    th_date_time: "तारीख आणि वेळ",
    th_symptoms: "नोंदवलेली लक्षणे",
    th_status: "स्थिती",
    th_actions: "क्रिया",
    btn_accept: "स्वीकारा",
    btn_view_details: "तपशील पहा",
    no_appointments: "कोणतेही आगामी अपॉइंटमेंट नाहीत. आराम करा, डॉक्टर!",
    profile_settings: "प्रोफाइल सेटिंग्ज",
    availability_status: "उपलब्धता स्थिती",
    consultation_fee: "परामर्श शुल्क",
    hospital_affiliation: "रुग्णालय संलग्नता अद्यतन",
    save_changes: "बदल जतन करा",
    
    // Vitals & Reports
    vitals_monitor: "महत्त्वपूर्ण मॉनिटर",
    vitals_saved: "एआयशी जोडलेला डेटा",
    vitals_instruction: "माहित असल्यास कृपया आपला वर्तमान हृदय गती (BPM) आणि रक्त ऑक्सिजन (SpO2) प्रविष्ट करा. हा मूळ डेटा अत्यंत अचूक एआय मूल्यांकनासाठी वापरला जाईल.",
    heart_rate: "हृदय गती (BPM)",
    blood_oxygen: "रक्त ऑक्सिजन (SpO2)",
    link_vitals: "एआयशी लिंक करा",
    clear_data: "डेटा साफ करा",
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: keyof typeof translations.en) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
