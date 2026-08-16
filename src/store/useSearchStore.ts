import { create } from "zustand";
import { toast } from "react-hot-toast";
import type { ResumeResult } from "@/src/components/ResumeCard";

type SearchResponse = {
  results?: ResumeResult[];
  error?: string;
  hasNextPage?: boolean;
};

type ThemeMode = "dark" | "light";

interface SearchState {
  theme: ThemeMode;
  query: string;
  results: ResumeResult[];
  isSearching: boolean;
  isUploadOpen: boolean;
  page: number;
  limit: number;
  hasNextPage: boolean;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setQuery: (query: string) => void;
  setIsUploadOpen: (isOpen: boolean) => void;
  setLimit: (limit: number) => void;
  runSearch: (queryOverride?: string, pageOverride?: number, limitOverride?: number) => Promise<void>;
  initializeTheme: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  theme: "dark",
  query: "",
  results: [],
  isSearching: false,
  isUploadOpen: false,
  page: 1,
  limit: 12,
  hasNextPage: false,

  setTheme: (theme) => {
    set({ theme });
    window.localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(newTheme);
  },

  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("theme");
      if (stored === "light") {
        get().setTheme("light");
      }
    }
  },

  setQuery: (query) => set({ query }),
  
  setIsUploadOpen: (isUploadOpen) => set({ isUploadOpen }),
  
  setLimit: (limit) => set({ limit }),

  runSearch: async (queryOverride?: string, pageOverride?: number, limitOverride?: number) => {
    const state = get();
    const activeQuery = (queryOverride ?? state.query).trim();
    const activePage = pageOverride ?? state.page;
    const activeLimit = limitOverride ?? state.limit;

    if (!activeQuery) {
      toast.error("Enter a search query first.");
      return;
    }

    try {
      set({ isSearching: true });

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: activeQuery,
          threshold: 0.35,
          page: activePage,
          limit: activeLimit,
        }),
      });

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Search request failed.");
      }

      set({ 
        results: data.results || [], 
        hasNextPage: data.hasNextPage || false,
        page: activePage,
        limit: activeLimit
      });
    } catch (searchError) {
      toast.error(searchError instanceof Error ? searchError.message : "Unknown search error.");
      set({ results: [], hasNextPage: false });
    } finally {
      set({ isSearching: false });
    }
  },
}));
