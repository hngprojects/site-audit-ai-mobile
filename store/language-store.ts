import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage, STORAGE_KEYS } from '@/lib/storage';

export type LanguageCode = 'en' | 'fr' | 'es' | 'ru' | 'ur' | 'hi' | 'it' | 'sw' | 'ar' | 'ja' | 'de' | 'vi' | 'tr';

export interface Language {
  name: string;
  code: LanguageCode;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { name: 'English', code: 'en', nativeName: 'English' },
  { name: 'French', code: 'fr', nativeName: 'Français' },
  { name: 'Spanish', code: 'es', nativeName: 'Español' },
  { name: 'Russian', code: 'ru', nativeName: 'Русский' },
  { name: 'Urdu', code: 'ur', nativeName: 'اردو' },
  { name: 'Hindi', code: 'hi', nativeName: 'हिन्दी' },
  { name: 'Italian', code: 'it', nativeName: 'Italiano' },
  { name: 'Swahili', code: 'sw', nativeName: 'Kiswahili' },
  { name: 'Arabic', code: 'ar', nativeName: 'العربية' },
  { name: 'Japanese', code: 'ja', nativeName: '日本語' },
  { name: 'German', code: 'de', nativeName: 'Deutsch' },
  { name: 'Vietnamese', code: 'vi', nativeName: 'Tiếng Việt' },
  { name: 'Turkish', code: 'tr', nativeName: 'Türkçe' },
];

interface LanguageState {
  selectedLanguage: LanguageCode | null;
  setLanguage: (languageCode: LanguageCode) => void;
  getCurrentLanguage: () => Language | null;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      selectedLanguage: null,
      setLanguage: (languageCode: LanguageCode) => {
        set({ selectedLanguage: languageCode });
      },
      getCurrentLanguage: () => {
        const code = get().selectedLanguage;
        if (!code) return null;
        return LANGUAGES.find(lang => lang.code === code) || null;
      },
    }),
    {
      name: STORAGE_KEYS.LANGUAGE_PREFERENCES,
      storage: createJSONStorage(() => storage),
    }
  )
);

