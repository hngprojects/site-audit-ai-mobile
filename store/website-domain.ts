import { create } from "zustand";

interface AuditStore {
  domain: string;
  setDomain: (domain: string) => void;
  resetDomain: () => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  domain: "",

  setDomain: (domain: string) => set({ domain }),

  resetDomain: () => set({ domain: "" }),
}));
