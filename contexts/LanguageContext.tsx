
import React, { createContext, useState, useContext, ReactNode } from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'or', name: 'Odia (ଓଡ଼িয়া)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'mai', name: 'Maithili (मैथिली)' },
  { code: 'sat', name: 'Santali (संताली)' },
  { code: 'ks', name: 'Kashmiri (कश्मीरी)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'kok', name: 'Konkani (कोंकणी)' },
  { code: 'sd', name: 'Sindhi (सिंधी)' },
  { code: 'doi', name: 'Dogri (डोगरी)' },
  { code: 'mni', name: 'Manipuri (मणिपुरी)' },
  { code: 'brx', name: 'Bodo (बड़ो)' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)' }
];

// Basic dictionary for static UI elements. 
const TRANSLATIONS: Record<string, any> = {
  en: {
    app_name: "CropMate AI",
    nav_dashboard: "Dashboard",
    nav_history: "History",
    nav_chat: "Chat",
    nav_resources: "Resources",
    nav_logout: "Logout",
    nav_new_scan: "New Scan",
    hero_title_1: "Your Personal",
    hero_title_2: "Crop Assistant",
    hero_subtitle: "Identify plant diseases instantly with AI. Take a photo or upload an image to receive detailed health reports and agronomist-grade recommendations.",
    btn_take_photo: "Take Live Photo",
    btn_upload: "Upload Image",
    feature_crop_id: "Crop ID",
    feature_crop_id_desc: "Recognize hundreds of crop varieties instantly.",
    feature_pest: "Pest Detection",
    feature_pest_desc: "Early warning signs for common infestations.",
    feature_care: "Expert Care",
    feature_care_desc: "Personalized nutrient and irrigation advice.",
    welcome_back: "Welcome Back",
    analyzing: "Analyzing Samples...",
    analyzing_desc: "Consulting agricultural database & expert pathology models.",
    analysis_failed: "Analysis Failed",
    try_again: "Try Again",
    scan_new: "Scan New Plant",
    confidence: "AI Confidence",
    diagnosis: "Diagnosis",
    visual_evidence: "Visual Evidence",
    yield_impact: "Yield Impact Prediction",
    treatment_options: "Treatment Options",
    est_price: "Est. Price",
    recommendations: "Recommendations",
    preventative: "Preventative Measures",
    symptoms: "Detected Symptoms",
    priority_action: "Priority Action",
    ask_ai: "Ask AI for Details",
    risk_heatmap: "Disease Risk Heatmap",
    recent_scans: "Recent Scans",
    view_all: "View All",
    ai_insights: "AI Insights",
    identified_patterns: "Identified Patterns",
    predicted_actions: "Predicted Actions",
    chat_title: "CropMate Assistant",
    chat_subtitle: "Powered by Gemini AI",
    chat_placeholder: "Type your message...",
    chat_empty_title: "How can I help you today?",
    chat_empty_desc: "Ask me about plant care, identify a pest from a photo, or get advice on sustainable farming.",
    history_title: "Diagnostic History",
    history_subtitle: "Past prompts and analysis results.",
    no_history: "No diagnostic history found.",
    view_report: "View Full Report",
    resources_title: "Agricultural Resources",
    resources_subtitle: "Trusted sources for crop disease info and management.",
    visit_site: "Visit Site",
    support_networks: "Farmer Support Networks",
    find_office: "Find Local Extension Office",
    login_welcome: "Welcome Back",
    login_create: "Create Account",
    login_subtitle_in: "Enter your credentials to access your crop data.",
    login_subtitle_up: "Join CropMate AI to start diagnosing your crops.",
    email_label: "Email Address",
    username_label: "Username",
    password_label: "Password",
    sign_in: "Sign In",
    sign_up: "Create Account",
    processing: "Processing...",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    sign_up_now: "Sign up now",
    log_in: "Log in"
  },
  hi: {
    app_name: "क्रॉपमेट एआई",
    nav_dashboard: "डैशबोर्ड",
    nav_history: "इतिहास",
    nav_chat: "चैट",
    nav_resources: "संसाधन",
    nav_logout: "लॉग आउट",
    nav_new_scan: "नया स्कैन",
    hero_title_1: "आपका व्यक्तिगत",
    hero_title_2: "फसल सहायक",
    hero_subtitle: "एआई से पौधों की बीमारियों को तुरंत पहचानें। विस्तृत स्वास्थ्य रिपोर्ट और कृषिविज्ञानी-ग्रेड सिफारिशें प्राप्त करने के लिए एक फोटो लें या एक छवि अपलोड करें।",
    btn_take_photo: "लाइव फोटो लें",
    btn_upload: "छवि अपलोड करें",
    welcome_back: "वापसी पर स्वागत है",
    analyzing: "नमूनों का विश्लेषण हो रहा है...",
    analysis_failed: "विश्लेषण विफल",
    try_again: "पुनः प्रयास करें",
    scan_new: "नया पौधा स्कैन करें",
    chat_title: "क्रॉपमेट सहायक",
    chat_placeholder: "अपना संदेश टाइप करें...",
    // Add more as needed
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  const languageName = LANGUAGES.find(l => l.code === language)?.name || 'English';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
