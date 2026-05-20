'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import bn from '@/i18n/bn.json';
import en from '@/i18n/en.json';

const translations = { bn, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('bn');

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'bn';
    setLanguage(savedLang || 'bn');
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language] || bn;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Bengali, then to key
        let fallback = bn;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, language };
}
