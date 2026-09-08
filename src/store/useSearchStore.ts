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
  _abortController: AbortController | null;
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

  relevanceThreshold: 0.35,
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
    
    // @ts-ignore
    if (typeof document !== "undefined" && document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => {
        get().setTheme(newTheme);
      });
    } else {
      get().setTheme(newTheme);
    }
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

  // AbortController reference for canceling stale requests
  _abortController: null as AbortController | null,

  runSearch: async (queryOverride?: string, pageOverride?: number, limitOverride?: number) => {
    const state = get();
    const activeQuery = (queryOverride ?? state.query).trim();
    const activePage = pageOverride ?? state.page;
    const activeLimit = limitOverride ?? state.limit;

    if (!activeQuery) {
      toast.error("Enter a search query first.");
      return;
    }

    // Cancel any ongoing search request
    if (state._abortController) {
      state._abortController.abort();
    }

    const abortController = new AbortController();
    set({ _abortController: abortController, isSearching: true });

    try {
      const response = await fetch(`/api/search?_t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        },
        cache: "no-store",
        body: JSON.stringify({
          query: activeQuery,
          threshold: state.relevanceThreshold,
          page: activePage,
          limit: activeLimit,
          skills: state.selectedSkills,
        }),
        signal: abortController.signal,
      });

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Search request failed.");
      }

      // If this request was aborted, ignore the results
      if (abortController.signal.aborted) return;

      set((state) => {
        const newResults = data.results || [];
        
        if (activePage === 1) {
          return {
            results: newResults,
            hasNextPage: data.hasNextPage || false,
            page: activePage,
            limit: activeLimit,
          };
        }

        const existingIds = new Set(state.results.map(r => r.id));
        const filteredNewResults = newResults.filter(r => !existingIds.has(r.id));

        return {
          results: [...state.results, ...filteredNewResults],
          hasNextPage: data.hasNextPage || false,
          page: activePage,
          limit: activeLimit,
        };
      });
    } catch (searchError: any) {
      if (searchError.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      toast.error(searchError instanceof Error ? searchError.message : "Unknown search error.");
      set({ results: [], hasNextPage: false });
    } finally {
      // Only reset isSearching if this is still the active request
      if (!abortController.signal.aborted) {
        set({ isSearching: false });
      }
    }
  },
}));
