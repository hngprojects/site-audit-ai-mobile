import { create } from "zustand";

export type SelectedIssue = {
  id: string;
  title: string;
  score?: string;
  status?: string;
  description?: string;
};

export type FullIssueData = {
  job_id: string;
  website_score: number;
  scan_date: string;
  summary_message: string;
  categories: any[]; // Full category data from /issues endpoint
};

interface SelectedIssuesState {
  issues: SelectedIssue[];
  availableIssues: SelectedIssue[];
  fullIssuesData: FullIssueData | null;

  addIssue: (issue: SelectedIssue) => void;
  removeIssue: (id: string) => void;
  clearIssues: () => void;
  setIssues: (issues: SelectedIssue[]) => void;
  setFullIssuesData: (data: FullIssueData) => void;
}

export const useSelectedIssuesStore = create<SelectedIssuesState>((set) => ({
  issues: [],
  availableIssues: [],
  fullIssuesData: null,

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

  setFullIssuesData: (data) => set({ fullIssuesData: data }),
}));
