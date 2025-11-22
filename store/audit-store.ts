import type { Status } from '@/type';
import { create } from 'zustand';

export interface AuditHistoryItem {
  id: string;
  domain: string;
  score: number;
  status: Status;
  scanDate: string;
}

export interface AuditState {
  currentAudit: {
    url: string;
    progress: number;
    isScanning: boolean;
    scanDate: string | null;
  } | null;
  auditResult: {
    domain: string;
    score: number;
    status: Status;
    scanDate: string;
  } | null;
  auditHistory: AuditHistoryItem[];
  setCurrentAudit: (url: string) => void;
  updateProgress: (progress: number) => void;
  setAuditResult: (result: { domain: string; score: number; status: Status; scanDate: string }) => void;
  addToHistory: (result: AuditHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearCurrentAudit: () => void;
  clearAuditResult: () => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  currentAudit: null,
  auditResult: null,
  auditHistory: [],

  setCurrentAudit: (url: string) => {
    set({
      currentAudit: {
        url,
        progress: 0,
        isScanning: true,
        scanDate: new Date().toISOString(),
      },
    });
  },

  updateProgress: (progress: number) => {
    set((state) => {
      if (state.currentAudit) {
        return {
          currentAudit: {
            ...state.currentAudit,
            progress: Math.min(progress, 100),
            isScanning: progress < 100,
          },
        };
      }
      return state;
    });
  },

  setAuditResult: (result: { domain: string; score: number; status: Status; scanDate: string }) => {
    const historyItem: AuditHistoryItem = {
      ...result,
      id: `${result.domain}-${result.scanDate}-${Date.now()}`,
    };
    set((state) => ({
      auditResult: result,
      currentAudit: null,
      auditHistory: [historyItem, ...state.auditHistory],
    }));
  },

  addToHistory: (result: AuditHistoryItem) => {
    set((state) => ({
      auditHistory: [result, ...state.auditHistory],
    }));
  },

  removeFromHistory: (id: string) => {
    set((state) => ({
      auditHistory: state.auditHistory.filter((item) => item.id !== id),
    }));
  },

  clearCurrentAudit: () => {
    set({ currentAudit: null });
  },

  clearAuditResult: () => {
    set({ auditResult: null });
  },
}));

