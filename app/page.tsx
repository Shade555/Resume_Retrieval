"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ResumeCard, type ResumeResult } from "@/src/components/ResumeCard";
import { SearchBar } from "@/src/components/SearchBar";
import { UploadModal } from "@/src/components/UploadModal";

type SearchResponse = {
  results?: ResumeResult[];
  error?: string;
};

type ThemeMode = "dark" | "light";

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResumeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }

    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const runSearch = useCallback(async (queryOverride?: string) => {
    const activeQuery = (queryOverride ?? query).trim();

    if (!activeQuery) {
      setError("Enter a search query first.");
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: activeQuery,
          threshold: 0.35,
          count: 12,
        }),
      });

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Search request failed.");
      }

      setResults(data.results || []);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Unknown search error.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const summary = useMemo(() => {
    if (results.length === 0) {
      return "Upload resumes, then run a semantic search to rank candidates by relevance.";
    }

    return `Top result score: ${Math.round(results[0].similarity * 100)}%`;
  }, [results]);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 text-[var(--text-primary)] sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(167,139,250,0.35)_0%,_rgba(167,139,250,0)_65%)]" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(125,211,252,0.26)_0%,_rgba(125,211,252,0)_70%)]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.2)_0%,_rgba(244,114,182,0)_70%)]" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-[linear-gradient(125deg,rgba(18,18,25,0.88),rgba(24,24,35,0.76))] p-6 shadow-[0_18px_38px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#bca7ff]">AI Resume Retrieval</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Find the right candidate with semantic search
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                Local embeddings, vector similarity, and a matte gradient interface built for high-signal hiring workflows.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="self-start rounded-xl border border-white/15 bg-black/20 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-black/35"
            >
              {theme === "dark" ? "Switch to light" : "Switch to dark"}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="rounded-xl bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#7dd3fc] px-5 py-3 text-sm font-semibold text-[#131420] transition hover:brightness-110"
            >
              Add Resume Text
            </button>
            <span className="rounded-full border border-[#6ee7b7]/30 bg-[#6ee7b7]/10 px-3 py-1 text-xs text-[#6ee7b7]">
              {summary}
            </span>
          </div>
        </header>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={runSearch}
          isLoading={isSearching}
          resultCount={results.length}
        />

        {error ? (
          <p className="rounded-xl border border-[#fca5a5]/25 bg-[#fca5a5]/10 px-4 py-3 text-sm text-[#ffd5d5]">
            {error}
          </p>
        ) : null}

        {isSearching ? (
          <section className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {results.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </section>
        )}
      </main>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={() => {
          if (query.trim()) {
            void runSearch();
          }
        }}
      />
    </div>
  );
}
