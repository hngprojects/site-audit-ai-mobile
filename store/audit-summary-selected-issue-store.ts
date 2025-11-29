import { create } from "zustand";

export type SelectedIssue = {
  id: string;
  title: string;
  score?: string;
  status?: string;
  description?: string;
};

interface SelectedIssuesState {
  issues: SelectedIssue[];
  availableIssues: SelectedIssue[];

  addIssue: (issue: SelectedIssue) => void;
  removeIssue: (id: string) => void;
  clearIssues: () => void;
  setIssues: (issues: SelectedIssue[]) => void;
}

export const useSelectedIssuesStore = create<SelectedIssuesState>((set) => ({
  issues: [],
  availableIssues: [],

  addIssue: (issue) =>
    set((state) => {
      if (state.issues.some((i) => i.id === issue.id)) return state;
      return { issues: [...state.issues, issue] };
    }),

  removeIssue: (id) =>
    set((state) => ({
      issues: state.issues.filter((i) => i.id !== id),
    })),

  clearIssues: () => set({ issues: [] }),

  setIssues: (issues) => set({ availableIssues: issues }),
}));
