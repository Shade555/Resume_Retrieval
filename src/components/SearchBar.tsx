"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchStore } from "@/src/store/useSearchStore";

const HISTORY_KEY = "resume-query-history";
const AUTO_SEARCH_MIN_CHARS = 3;

export function SearchBar() {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const runSearch = useSearchStore((state) => state.runSearch);
  const isLoading = useSearchStore((state) => state.isSearching);
  const resultCount = useSearchStore((state) => state.results.length);

  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item): item is string => typeof item === "string")
        .slice(0, 8);
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < AUTO_SEARCH_MIN_CHARS) {
      return;
    }

    const timer = window.setTimeout(() => {
      void runSearch(trimmed);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  const filteredHistory = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return history;
    }

    return history.filter((item) => item.toLowerCase().includes(normalized));
  }, [history, query]);

  const persistHistory = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    setHistory((current) => {
      const next = [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, 8);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSearch = (override?: string) => {
    const term = (override ?? query).trim();

    if (!term) {
      return;
    }

    if (override && override !== query) {
      setQuery(term);
    }

    persistHistory(term);
    void runSearch(term);
    setIsHistoryOpen(false);
  };

  return (
    <section className="relative z-30 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur search-bar-awwwards">
      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
        <label className="sr-only" htmlFor="resume-query">
          Search resumes
        </label>
        <input
          ref={inputRef}
          id="resume-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsHistoryOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
            if (event.key === "Escape") {
              setIsHistoryOpen(false);
            }
          }}
          placeholder="Frontend developer with React and TypeScript experience"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-alt)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition focus:border-[#a78bfa]"
        />
        {query.trim().length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsHistoryOpen(false);
            }}
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--btn-hover)]"
          >
            Clear
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="rounded-xl bg-gradient-to-r from-[#a78bfa] via-[#7dd3fc] to-[#6ee7b7] px-5 py-3 text-sm font-semibold text-[#111217] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>

        {isHistoryOpen && filteredHistory.length > 0 ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-[var(--border)] bg-[var(--panel-alt)] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
            <p className="px-2 pb-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Recent searches</p>
            <ul className="space-y-1">
              {filteredHistory.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => handleSearch(item)}
                    className="w-full rounded-lg px-2 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--btn-bg)]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-[var(--text-secondary)]">
          {resultCount > 0 ? `${resultCount} matches found` : "No results yet."}
        </p>
        <p className="text-[11px] text-[var(--text-secondary)]">Shortcut: Ctrl+K</p>
      </div>
    </section>
  );
}
