# Language Selector Implementation Guide

This guide explains how the language selector functionality is implemented and how to use it throughout the application.

## Overview

The language selector allows users to choose their preferred language, which is persisted across app sessions. The implementation includes:

1. **Language Store** - Zustand store for managing selected language
2. **Translation System** - Simple translation utility for multi-language support
3. **Language Selector UI** - Updated language selection screen

## Files Created/Modified

### New Files:
- `store/language-store.ts` - Language state management
- `utils/translations.ts` - Translation utility and hook
- `translations/` - Directory containing separate translation files for each language
  - `translations/en.ts` - English translations
  - `translations/fr.ts` - French translations
  - `translations/es.ts` - Spanish translations
  - `translations/ru.ts` - Russian translations (template)
  - `translations/ur.ts` - Urdu translations (template)
  - `translations/hi.ts` - Hindi translations (template)
  - `translations/it.ts` - Italian translations (template)
  - `translations/sw.ts` - Swahili translations (template)
  - `translations/ar.ts` - Arabic translations (template)
  - `translations/ja.ts` - Japanese translations (template)
  - `translations/de.ts` - German translations (template)
  - `translations/vi.ts` - Vietnamese translations (template)
  - `translations/tr.ts` - Turkish translations (template)
  - `translations/index.ts` - Exports all translations

### Modified Files:
- `lib/storage.ts` - Added `LANGUAGE_PREFERENCES` storage key
- `app/(settings)/language.tsx` - Updated to use language store and translations

## How It Works

### 1. Language Store (`store/language-store.ts`)

The language store manages the selected language using Zustand with persistence:

```typescript
import { useLanguageStore } from '@/store/language-store';

// Get selected language
const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

// Set language
const { setLanguage } = useLanguageStore();
setLanguage('fr'); // Set to French
```

### 2. Using Translations

#### Option A: Using the Hook (Recommended for Components)

```typescript
import { useTranslation } from '@/utils/translations';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.save')}</Text>
  );
}
```

#### Option B: Direct Function Call (For Non-Component Code)

```typescript
import { getTranslation } from '@/utils/translations';
import { useLanguageStore } from '@/store/language-store';

const selectedLanguage = useLanguageStore.getState().selectedLanguage;
const text = getTranslation('common.save', selectedLanguage);
```

### 3. Adding New Translations

With the new structure, each language has its own file. To add new translations:

**Step 1:** Add the translation key to `translations/en.ts` (English is the base):

```typescript
// translations/en.ts
export const en = {
  // ... existing translations
  'my.new.key': 'My English Text',
};
```

**Step 2:** Add translations for other languages in their respective files:

```typescript
// translations/fr.ts
export const fr = {
  // ... existing translations
  'my.new.key': 'Mon texte français',
};

// translations/es.ts
export const es = {
  // ... existing translations
  'my.new.key': 'Mi texto en español',
};
```

**Step 3:** The translation will automatically be available through the `useTranslation()` hook.

**Note:** If a translation is missing in a language file, it will fall back to English automatically.

### 4. Language Codes

The supported language codes are:
- `en` - English
- `fr` - French
- `es` - Spanish
- `ru` - Russian
- `ur` - Urdu
- `hi` - Hindi
- `it` - Italian
- `sw` - Swahili
- `ar` - Arabic
- `ja` - Japanese
- `de` - German
- `vi` - Vietnamese
- `tr` - Turkish

## Usage Examples

### Example 1: Using in a Component

```typescript
import { useTranslation } from '@/utils/translations';
import { Text, TouchableOpacity } from 'react-native';

function MyButton() {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity>
      <Text>{t('common.save')}</Text>
    </TouchableOpacity>
  );
}
```

### Example 2: Getting Current Language

```typescript
import { useLanguageStore } from '@/store/language-store';

function MyComponent() {
  const { selectedLanguage, getCurrentLanguage } = useLanguageStore();
  const currentLanguage = getCurrentLanguage();
  
  return (
    <Text>Current language: {currentLanguage?.name}</Text>
  );
}
```

### Example 3: Displaying Selected Language on Profile

To show the selected language on the profile page:

```typescript
import { useLanguageStore } from '@/store/language-store';

function ProfileContent() {
  const { getCurrentLanguage } = useLanguageStore();
  const currentLanguage = getCurrentLanguage();
  
  return (
    <TouchableOpacity onPress={() => router.push('/(settings)/language')}>
      <Text>Language</Text>
      <Text>{currentLanguage?.name || 'English'}</Text>
    </TouchableOpacity>
  );
}
```

## Translation File Structure

```
translations/
├── index.ts      # Exports all translations
├── en.ts         # English (complete)
├── fr.ts         # French (complete)
├── es.ts         # Spanish (complete)
├── ru.ts         # Russian (template - needs translations)
├── ur.ts         # Urdu (template - needs translations)
├── hi.ts         # Hindi (template - needs translations)
├── it.ts         # Italian (template - needs translations)
├── sw.ts         # Swahili (template - needs translations)
├── ar.ts         # Arabic (template - needs translations)
├── ja.ts         # Japanese (template - needs translations)
├── de.ts         # German (template - needs translations)
├── vi.ts         # Vietnamese (template - needs translations)
└── tr.ts         # Turkish (template - needs translations)
```

## Next Steps

### 1. Add More Translations

Currently, only English, French, and Spanish have full translations. To add translations for other languages:

1. Open the language file (e.g., `translations/de.ts` for German)
2. Replace the `export const de = en;` with actual translations:

```typescript
// translations/de.ts
export const de = {
  'common.save': 'Speichern',
  'common.cancel': 'Abbrechen',
  // ... add all translation keys
};
```

3. Use a translation service or native speakers to ensure accuracy
4. Make sure all keys from `en.ts` are present in each language file

### 2. Translate Existing UI Text

Go through your app and replace hardcoded strings with translation keys:

**Before:**
```typescript
<Text>Save</Text>
```

**After:**
```typescript
const { t } = useTranslation();
<Text>{t('common.save')}</Text>
```

### 3. Advanced: Install i18next (Optional)

For a more robust solution, consider installing `react-i18next`:

```bash
npm install react-i18next i18next
```

This provides:
- Better translation management
- Pluralization support
- Interpolation
- Namespace organization
- Better tooling

### 4. Language Detection

You can add automatic language detection based on device settings:

```typescript
import * as Localization from 'expo-localization';

// In language-store.ts, initialize with device language
const deviceLanguage = Localization.locale.split('-')[0] as LanguageCode;
```

## Testing

1. **Test Language Selection:**
   - Go to Settings → Language
   - Select a language
   - Verify it persists after app restart

2. **Test Translations:**
   - Change language
   - Navigate through app
   - Verify text changes to selected language

3. **Test Persistence:**
   - Select a language
   - Close app completely
   - Reopen app
   - Verify language is still selected

## Troubleshooting

### Translation not showing
- Check if the translation key exists in `translations.ts`
- Verify the language code is correct
- Ensure the translation exists for the selected language (falls back to English)

### Language not persisting
- Check if `STORAGE_KEYS.LANGUAGE_PREFERENCES` is added to `storage.ts`
- Verify Zustand persist middleware is working
- Check AsyncStorage permissions

## Notes

- The translation system defaults to English if a translation is missing
- Language selection is persisted using AsyncStorage
- The language store uses the same pattern as `email-reports-store.ts`
- All language codes follow ISO 639-1 standard

