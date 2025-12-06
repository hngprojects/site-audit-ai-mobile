import { create } from "zustand";

export type ScanEvent =
  | "scan_started"
  | "loading_page"
  | "performance_check"
  | "extracting_content"
  | "seo_check"
  | "accessibility_check"
  | "performance_analysis"
  | "scan_complete"
  | "discovery_started"
  | "crawling_pages"
  | "analyzing_structure"
  | "prioritizing_pages"
  | "discovery_complete"
  | "scan_error"
  | "scan_failed";


interface ScanState {
  jobId: string | null;
  url: string | null;

  progress: number;          
  currentEvent: ScanEvent | null;
  lastEventData: any;
  isCompleted: boolean;
  eventMessages: Record<string, string>;

  setInitial: (jobId: string, url: string) => void;
  updateFromEvent: (event: ScanEvent, data: any) => void;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  jobId: null,
  url: null,

  progress: 0,
  currentEvent: null,
  lastEventData: null,
  isCompleted: false,
  eventMessages: {},

  setInitial: (jobId, url) =>
    set({
      jobId,
      url,
    }),

  updateFromEvent: (event: ScanEvent, data: any) =>
    set((state) => {
      const completed = event === "scan_complete" || event === "discovery_complete";
      const message = data?.message || '';

      return {
        currentEvent: event,
        lastEventData: data,
        progress: data.progress ?? state.progress,
        isCompleted: completed,
        eventMessages: {
          ...state.eventMessages,
          [event]: message,
        },
      };
    }),

  reset: () =>
    set({
      jobId: null,
      url: null,
      progress: 0,
      currentEvent: null,
      lastEventData: null,
      isCompleted: false,
      eventMessages: {},
    }),
}));
