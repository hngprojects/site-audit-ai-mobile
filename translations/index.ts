import type { LanguageCode } from '@/store/language-store';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { ru } from './ru';
import { ur } from './ur';
import { hi } from './hi';
import { it } from './it';
import { sw } from './sw';
import { ar } from './ar';
import { ja } from './ja';
import { de } from './de';
import { vi } from './vi';
import { tr } from './tr';

export type TranslationKeys = typeof en;

// Export all translations
export const translations: Record<LanguageCode, TranslationKeys> = {
  en,
  fr,
  es,
  ru,
  ur,
  hi,
  it,
  sw,
  ar,
  ja,
  de,
  vi,
  tr,
};

