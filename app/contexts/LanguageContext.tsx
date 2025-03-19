'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import enTranslations from '@/app/translations/en.json';
import hiTranslations from '@/app/translations/hi.json';

export type Locale = 'en' | 'hi';
type Translations = typeof enTranslations;

// Define the parameter type for substitutions
interface TranslationParams {
  [key: string]: string | number;
}

interface LanguageContextType {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const translations = {
  en: enTranslations,
  hi: hiTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  // Helper function to get nested object values using dot notation
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object') {
        return acc[part];
      }
      return '';
    }, obj);
  };

  // Translation function with parameter support
  const t = useCallback((key: string, params?: TranslationParams): string => {
    let translation = getNestedValue(translations[locale], key);
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Replace parameters in the translation string if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    
    return translation;
  }, [locale]);

  const value = {
    locale,
    translations: translations[locale],
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 