import React, { createContext, useContext, useState, useEffect } from 'react';
import cvDataEs from '../data/cv-content.json';
import cvDataEn from '../data/cv-content-en.json';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  cvData: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cv-language') as Language;
      return saved || 'es';
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv-language', lang);
    }
  };

  const cvData = language === 'es' ? cvDataEs : cvDataEn;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, cvData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
