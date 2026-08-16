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
  
  // Filters
  relevanceThreshold: number;
  selectedSkills: string[];
  
  // Bulk Operations
  selectedResumeIds: Set<string>;

  // Annotations
  flaggedResumeIds: Set<string>;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setQuery: (query: string) => void;
  setIsUploadOpen: (isOpen: boolean) => void;
  setLimit: (limit: number) => void;
  setRelevanceThreshold: (threshold: number) => void;
  toggleSkill: (skill: string) => void;
  toggleResumeSelection: (id: string) => void;
  clearSelection: () => void;
  selectAllResults: () => void;
  toggleFlag: (id: string) => void;
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

  relevanceThreshold: 0.0,
  selectedSkills: [],
  selectedResumeIds: new Set(),
  flaggedResumeIds: new Set(
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("flagged-resumes") || "[]")
      : []
  ),

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

  setRelevanceThreshold: (threshold) => set({ relevanceThreshold: threshold }),

  toggleSkill: (skill) => set((state) => {
    const isSelected = state.selectedSkills.includes(skill);
    return {
      selectedSkills: isSelected 
        ? state.selectedSkills.filter((s) => s !== skill)
        : [...state.selectedSkills, skill]
    };
  }),

  toggleResumeSelection: (id) => set((state) => {
    const newSet = new Set(state.selectedResumeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return { selectedResumeIds: newSet };
  }),

  clearSelection: () => set({ selectedResumeIds: new Set() }),

  selectAllResults: () => set((state) => {
    const newSet = new Set(state.selectedResumeIds);
    state.results.forEach((r) => newSet.add(r.id));
    return { selectedResumeIds: newSet };
  }),

  toggleFlag: (id) => set((state) => {
    const newSet = new Set(state.flaggedResumeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    
    // Persist to local storage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("flagged-resumes", JSON.stringify(Array.from(newSet)));
    }
    
    return { flaggedResumeIds: newSet };
  }),

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
          threshold: state.relevanceThreshold,
          page: activePage,
          limit: activeLimit,
          skills: state.selectedSkills, // Pass skills to backend for future usage
        }),
      });

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Search request failed.");
      }

      set((state) => ({ 
        results: activePage === 1 ? (data.results || []) : [...state.results, ...(data.results || [])], 
        hasNextPage: data.hasNextPage || false,
        page: activePage,
        limit: activeLimit
      }));
    } catch (searchError) {
      toast.error(searchError instanceof Error ? searchError.message : "Unknown search error.");
      set({ results: [], hasNextPage: false });
    } finally {
      set({ isSearching: false });
    }
  },
}));
