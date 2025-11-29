import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage, STORAGE_KEYS } from '@/lib/storage';

export type EmailFrequency = 'weekly' | 'monthly' | 'quarterly' | 'never';

interface EmailReportsState {
  frequency: EmailFrequency | null;
  setFrequency: (frequency: EmailFrequency) => void;
}

export const useEmailReportsStore = create<EmailReportsState>()(
  persist(
    (set) => ({
      frequency: null,
      setFrequency: (frequency) => set({ frequency }),
    }),
    {
      name: STORAGE_KEYS.EMAIL_REPORTS_PREFERENCES,
      storage: createJSONStorage(() => storage),
    }
  )
);

