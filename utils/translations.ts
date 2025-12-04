import { useLanguageStore, type LanguageCode } from '@/store/language-store';
import { translations } from '@/translations';

// Helper function to get translation
export const getTranslation = (key: string, languageCode: LanguageCode | null = 'en'): string => {
    const code = languageCode || 'en';
    const langTranslations = translations[code] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || translations.en[key as keyof typeof translations.en] || key;
};

// React hook for translations
export const useTranslation = () => {
    const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

    const t = (key: string): string => {
        return getTranslation(key, selectedLanguage);
    };

    return { t, language: selectedLanguage || 'en' };
};

