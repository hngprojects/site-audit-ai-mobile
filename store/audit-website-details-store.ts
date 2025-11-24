import { create } from 'zustand';

interface AuditInfo {
  domain: string;
  status: string;
  score: string;
  scanDate: string;
}

interface AuditInfoStore {
  auditInfo: AuditInfo;
  setAuditInfo: (info: AuditInfo) => void;
  getAuditInfo: () => AuditInfo;
}

export const useAuditInfoStore = create<AuditInfoStore>((set, get) => ({
  auditInfo: {
    domain: '',
    status: '',
    score: '',
    scanDate: '',
  },
  setAuditInfo: (info: AuditInfo) => set({ auditInfo: info }),
  getAuditInfo: () => get().auditInfo,
}));
